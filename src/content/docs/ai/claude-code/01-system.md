---
title: 01 分层全貌：输入到输出
description: 一张图讲清 Claude Code——不是模型本身，而是包在模型外面的 Agentic Harness
---

很多人说「用 Claude 写代码」，其实叠了两层：**Claude 模型**负责推理；**Claude Code**负责把推理接到真实工程动作上——读改仓库、跑命令、管权限、驱动多步任务。

官方把自己叫 **agentic coding harness**：包在模型外面的运行时。没有 Tools，它只是聊天；有了 Tools + 主环，才是 Agent。

本篇只钉一张分层图。细节留给系列后续；材料来自 [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Extend](https://code.claude.com/docs/en/features-overview)、[Glossary](https://code.claude.com/docs/en/glossary)。

![Claude Code 分层架构：输入、输出与扩展时机](/ai/claude-code/01-architecture-io.svg)

---

## 1. 一句话：产品 = Harness，不是模型

| | 管什么 |
| --- | --- |
| **模型** | 读 Context，决定下一步，输出文本或 tool call |
| **Harness** | 喂上下文、执行工具、做门控、驱动主环、把结果回灌 |

壳可以换——Terminal / IDE / Desktop / Web / CI——**底下是同一套环**。换客户端 ≠ 换引擎。

一次对话对应一个 **Session**（落盘上是一条 transcript）：

- **resume / `--continue`**：同一 Session，往 transcript 上续写  
- **fork / `/branch`**：拷一份到新 Session，原会话不动  

Settings、仓库代码、CLAUDE.md 都不是 Session 本身——它们是进 Session 的材料，或 Session 去改的对象。

---

## 2. 从上往下五层

### 输入层

进 Session 的材料与约束：任务 / 提问、CLAUDE.md、rules、Settings、会话历史 / memory、Skills 定义、授权与 Output style。

Settings 同 key 时大致：**Managed → CLI `--settings` → 项目 local → 项目 → 用户**。

### 接入层

你从哪跟它说话。壳可变，Loop 不变。

### Harness 层（产品本体）

可以拆成三块：**主环**、**内核零件**、**扩展挂载**。

**主环**官方收成三步，会反复交织：

1. **gather** — 弄清要做什么（读文件、搜代码、问你）  
2. **act** — 动手（改文件、跑测试、调服务）  
3. **verify** — 检查结果（看输出、再读代码、必要时回退）

实现上就是 Agent SDK 同一套 loop：收 prompt → 模型输出（文本和/或 tool calls）→ 运行时执行工具 → 结果回灌 Context → 再调模型……直到不再要工具（或你打断 / 触顶）。人可以随时插入；长任务会 Compaction；verify 不过就再转一圈——失败是常态路径。

**内核零件：**

| 零件 | 管什么 |
| --- | --- |
| **Context** | 组装每轮模型所见；窗口满了会压缩 |
| **Gate** | Permission、Sandbox、Checkpoint——行动前拦、编辑前快照 |
| **Tools** | 把意图变成动作：内建读改搜跑 + MCP |
| **Orchestration** | Subagents、Dynamic workflow——怎么拆任务、怎么隔离跑 |
| **执行落点** | Local / Cloud / Remote Control——问「跑在哪」，与策略面正交 |

虚线很关键：**工具结果必须回灌 Context**，主环才能转下去。

**扩展挂载**叠在 Loop 上，不是另起引擎。日常定制最常摸这几块——关键是「何时调用」：

| 扩展 | 何时调用 |
| --- | --- |
| **CLAUDE.md / rules** | Session 启动自动加载（「永远知道」） |
| **Skills** | 你打 `/name`，或模型判定相关时按需加载 |
| **MCP** | 模型发出 tool call 时调外部能力 |
| **Hooks** | 生命周期事件**必触发**（SessionStart、Pre/PostToolUse…），不靠模型「想起来」 |
| **Subagents** | 主 Agent 委托隔离任务；独立 loop，摘要回主会话 |
| **Output style** | 整段 Session 生效：语气 / 角色 / 格式 |
| **Plugins** | 安装后把 Skills / Hooks / MCP / Subagents 打包带上 |

此外还有 Auto memory、Dynamic workflow、Agent teams（experimental）、Artifacts / Channels 等。`--bare` 可关掉多数扩展，适合 CI 最小面。

### 模型层与可及面

- **模型层**：推理引擎（可换）。文档写「Claude chooses / decides」时，多半指这里。何时用 Skill / MCP / Subagent，多半由模型在环里决定；**Hooks 除外**——事件驱动，确定性触发。  
- **可及面**：Tools（含 MCP）实际能碰什么——项目 / Git、Shell、外部服务、浏览器、LSP 等。

口语里的「环境」常把三件事糊在一起：

| 说法 | 实际指 |
| --- | --- |
| 「在 IDE 里用」 | 接入层 |
| 「跑在本地还是云上」 | 执行落点 |
| 「它能改我仓库吗」 | 可及面 + Gate 是否放行 |

### 输出层

Loop 的产出分三路：

| | 去向 |
| --- | --- |
| **G1** | 给你：解释、提问、计划、摘要 |
| **G2** | 给可及面：改文件、跑命令、调服务 |
| **G3** | 可回滚形态：Checkpoint 覆盖的文件编辑 |

机制在 Gate；G3 只描述形态。远端副作用（已 push 的 PR、已发出的请求）通常不在 checkpoint 里。

---

## 3. 六个容易混的词

转发前值得单独记一记：

1. **Harness vs Model** — Harness 管行动与约束，模型管推理  
2. **CLAUDE.md vs Skills** — 前者启动必加载；后者按需 / 斜杠触发  
3. **Skill vs Tool / MCP** — Skill 教「怎么做」；Tool 是「能调用的动作」  
4. **Hooks vs Skill / CLAUDE.md** — Hooks 是确定性事件脚本；后两者是给模型看的说明，不保证每次执行  
5. **Subagent vs Agent teams** — 同 Session 内隔离工人 vs 多 Session 协作（后者偏 experimental）  
6. **Checkpoint vs 撤销远端副作用** — 前者主要罩文件编辑  

---

## 4. 边界

- 默认是 **人 + Agent 协作**，不是无人交付  
- Gate 管得住纳入 checkpoint 的本地编辑；**管不住**没纳入的远端副作用  
- 只会某个客户端（只盯接入层）永远学不完；差距在 Context 怎么喂、Gate 怎么设、Loop 里你怎么验收  

能指着图讲清 **Harness / Loop / 各层**，以及扩展各在何时挂上，这一篇就算过关。

---

## 5. 下一步

想按层细读，从输入材料从哪来开始：

→ [02 输入层](/ai/claude-code/02-layout/)
