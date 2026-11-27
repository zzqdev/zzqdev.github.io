---
title: 01 分层架构：输入到输出
description: 按分层图读 Claude Code：输入、Harness、扩展时机、模型与输出
---

没有完整源码时，把官方文档当成架构说明书来读。  
材料：[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Extend](https://code.claude.com/docs/en/features-overview)、[Glossary](https://code.claude.com/docs/en/glossary)、[Settings](https://code.claude.com/docs/en/settings)。

本篇以一张分层图为轴：**输入 → 接入 → Agentic Harness → 模型 / 可及面 → 输出**。落盘细节、能力清单、改动入口留给后续篇。

![Claude Code 分层架构：输入、输出与扩展时机](/ai/claude-code/01-architecture-io.svg)

---

## 1. 先看整张图在说什么

产品本体不是「某个 Claude 模型」，而是包在模型外面的运行时——官方叫 **agentic coding harness**。

- **模型**负责推理：读上下文、决定下一步、生成文本或 tool call  
- **Harness**负责接线：喂上下文、执行工具、做门控、驱动主环、把结果回灌  

无 Tools 则无 agentic，只剩聊天。壳可以是 Terminal / IDE / Desktop / Web / CI，**底下是同一套环**。一次运行 ≈ 一个 **Session**（可 resume / fork）。

图从上到下五层（L0–L4）；L2 里还有一条 **扩展挂载**，标了各扩展 **何时调用**。

---

## 2. L0 · 输入

进 Session 的材料与约束，不是「代码跑在哪」：

- 任务 / 提问（含你中途打断、改向）  
- **CLAUDE.md**、rules、Settings  
- 会话历史 / memory、授权与 trust  
- Skills 的定义（先存在，用不用另说）  
- Output style 等会话级偏好  

Settings 同 key 时大致：Managed → CLI `--settings` → 项目 local → 项目 → 用户。路径怎么叠见 [02](/ai/claude-code/02-layout/)。

---

## 3. L1 · 接入

Terminal、IDE、Desktop、Web、CI/CD、Remote Control UI……  
**壳可变，Loop 不变。** 换客户端不等于换引擎。

---

## 4. L2 · Agentic Harness

这一层是产品本体。可以拆成三块看：主环、内核零件、扩展挂载。

### 4.1 主环：gather → act → verify

官方把循环收成三步：

1. **gather** — 弄清要做什么（读文件、搜代码、问你、加载说明）  
2. **act** — 动手（改文件、跑测试、调服务）  
3. **verify** — 检查结果（看输出、再读代码、必要时回退或继续）

实现向（Agent SDK 同一套 loop）：

```
收 prompt
  → 模型输出（文本和/或 tool calls）
  → 运行时执行工具
  → 结果回灌 Context
  → 再调模型……
直到不再要工具（或你打断 / 触顶）
```

人可以随时插入；长任务会 Compaction；verify 不过就再转一圈——失败是常态路径。turn 级细节见 [03](/ai/claude-code/03-loop/)。

### 4.2 内核零件

| 零件 | 管什么 |
| --- | --- |
| **Context** | 组装每轮模型所见；窗口满了会压缩 |
| **Gate** | Permission、Sandbox、Checkpoint——行动前拦、编辑前快照 |
| **Tools** | 把意图变成动作：内建读改搜跑 + MCP 工具表 |
| **Orchestration** | Subagents、Dynamic workflow——任务怎么拆、隔离怎么跑 |
| **执行落点** | Local / Cloud / Remote Control——与策略面正交，问「跑在哪」 |

虚线 **工具结果回灌 Context**：没有回灌，主环转不下去。

### 4.3 扩展挂载 · 何时调用

扩展叠在 Loop 上，**不是另起一个引擎**。日常定制最常摸这几块：

| 扩展 | 挂在哪 | 何时调用 |
| --- | --- | --- |
| **CLAUDE.md** / **rules** | → Context | **Session 启动自动加载**（「永远知道」的约定） |
| **Skills** | → Context | **你打 `/name`**，或模型判定相关时按需加载 |
| **MCP** | → Tools 表 | **模型发出 tool call** 时调外部服务/数据 |
| **Hooks** | → 生命周期 / Gate | **固定事件必触发**（SessionStart、Pre/PostToolUse…），不靠模型「想起来」 |
| **Subagents** | → Orchestration | **主 Agent 委托**隔离任务；独立 loop，摘要回主会话 |
| **Output style** | → 指令面 | **整段 Session 生效**；语气 / 角色 / 回复格式 |
| **Plugins** | 打包单元 | **安装后**把 Skills / Hooks / MCP / Subagents 一起带上 |
| **Code intelligence** | → Tools | **跳转定义 / 读诊断** 等需要时（LSP 类） |

此外还有，图上不逐格展开：

- **Auto memory**：会话中写入；下次启动加载索引  
- **Dynamic workflow**：模型写脚本拉起一批 subagent  
- **Agent teams**（experimental）：多 Session 协作 ≠ 同 Session 内 Subagents  
- **Artifacts / Channels**：产出可视化页面、外部事件推进会话等  

`--bare` 可关掉多数扩展与项目说明，适合 CI 最小面。

用法与咬合见 [04](/ai/claude-code/04-capabilities/)、[05](/ai/claude-code/05-wiring/)、[06](/ai/claude-code/06-extend/)；本篇只钉位置和时机。

---

## 5. L3 · 模型与可及面

**L3a Model**  
推理引擎（可换）。读 Context，输出文本和/或 tool calls。文档写「Claude chooses / decides」时，多半指这里。  
**何时用 Skill / MCP / Subagent，多半由模型在环里决定**；**Hooks 除外**——Hooks 是事件驱动，确定性触发。

**L3b Access**  
Tools（含 MCP）实际能碰什么：项目 / Git、Shell、外部服务、浏览器、LSP 等。

口语里的「环境」常把三件事糊在一起，图上要拆开：

| 说法 | 实际指 |
| --- | --- |
| 「在 IDE 里用」 | L1 接入 |
| 「跑在本地还是云上」 | L2 旁的执行落点 |
| 「它能改我仓库吗」 | L3b 可及面 + Gate 是否放行 |

---

## 6. L4 · 输出

Loop 的产出分三路：

| | 去向 |
| --- | --- |
| **G1** | 给你：解释、提问、计划、摘要 |
| **G2** | 给可及面：改文件、跑命令、调服务 |
| **G3** | 可回滚形态：Checkpoint 覆盖的文件编辑 |

**机制在 Gate；G3 只描述形态**——别把 Checkpoint 理解成另一套引擎。远端副作用（已 push 的 PR、已发出的请求）通常不在 checkpoint 里。

---

## 7. 几个容易混的词

- **Harness vs Model**：L2 管行动与约束，L3a 管推理  
- **CLAUDE.md vs Skills**：前者启动必加载；后者按需 / 斜杠触发  
- **Skill vs Tool / MCP**：Skill 教「怎么做」；Tool（含 MCP）是「能调用的动作」  
- **Hooks vs Skill / CLAUDE.md**：Hooks 是确定性事件脚本；后两者是给模型看的说明，不保证每次执行  
- **Subagent vs Agent teams**：同 Session 内隔离工人 vs 多 Session 协作（后者偏 experimental）  
- **Checkpoint vs 撤销远端副作用**：前者主要罩文件编辑  

---

## 8. 边界

- 默认是 **人 + Agent 协作**，不是无人交付  
- Gate 管得住纳入 checkpoint 的本地编辑；**管不住**没纳入的远端副作用  
- 只会某个客户端（只盯 L1）永远学不完；差距在 Context 怎么喂、Gate 怎么设、Loop 里你怎么验收  

能指着图讲清 **Harness / Loop / L0–L4**，以及扩展各在何时挂上，这一篇就算过关。

---

## 9. 下一步

换镜头看配置和会话**落在磁盘哪**，Settings 怎么叠。

→ [02 落盘：配置与会话](/ai/claude-code/02-layout/)
