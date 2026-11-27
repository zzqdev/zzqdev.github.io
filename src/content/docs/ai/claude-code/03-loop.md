---
title: 03 Harness 层：主环
description: Harness 主环 gather → act → verify，以及 Context / Gate / Tools
---

Claude Code 官方自称 **agentic coding harness**：包在模型外面的运行时。  
没有 Tools，它只是聊天；有了 Tools + 主环，才是 Agent。

本篇只钉 **主环怎么转**，以及 Context / Gate / Tools 各管什么。  
扩展（Skills / MCP / Hooks…）叠在环上，但不替换环——「何时调用」另说。

材料：[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Agent loop](https://code.claude.com/docs/en/agent-sdk/agent-loop)、[Glossary](https://code.claude.com/docs/en/glossary)。

![Harness 主环：gather → act → verify](/ai/claude-code/03-harness-loop.svg)

---

## 1. 一句话：产品 = 驱动环的运行时

| | 管什么 |
| --- | --- |
| **模型** | 读 Context，决定下一步，输出文本或 tool call |
| **Harness** | 喂上下文、执行工具、做门控、驱动循环、把结果回灌 |

壳可以换（Terminal / IDE / CI），**底下是同一套环**。换客户端 ≠ 换引擎。

---

## 2. 主环：gather → act → verify

官方把每轮工作收成三个会**交织**的阶段：

| 阶段 | 在干什么 | 典型动作 |
| --- | --- | --- |
| **gather** | 弄清要做什么 | 搜文件、读代码、看报错、问你澄清 |
| **act** | 动手 | 改文件、跑测试、调 MCP、派 subagent |
| **verify** | 检查结果 | 再跑测试 / 构建、对照目标、必要时回退 |

任务不同，环的形态不同：

- 只问「项目结构」→ 可能几乎停在 gather  
- 修 bug → 三阶段反复  
- 大重构 → verify 往往最长  

**人也在环里**：随时打断、改向、拒绝某次工具调用——不是点火后只能旁观。

---

## 3. 实现向：同一套 loop

Agent SDK 把 CLI 共用的循环写得更直白：

```text
1. 收 prompt（+ system / 工具定义 / 历史）
2. 模型评估 → 文本 和/或 tool calls
3. 运行时执行工具（可过 hooks / 权限）
4. 结果作为 tool_result 回灌
5. 回到 2，直到不再带 tool call（或触顶 / 被中断）
```

几个直觉：

- **无 tool call 的最终文本** ≈ 本轮对你说完了  
- **有 tool call** ≈ 还要行动；结果必须回灌，否则下一步瞎推  
- **失败是常态路径**：verify 不过就再 gather / act，不是「一次生成完事」

CLI 与 SDK **共享这套环**，不另起引擎。

---

## 4. 内核零件

### Context

组装「这一轮模型看得见什么」：system、CLAUDE.md / rules、已加载 Skills、历史、auto memory、工具 schema……  
窗口将满会 **Compaction**（摘要压缩）。Context 涨是长任务的主税；扩展乱加载会直接吃窗口。

### Gate

行动前的门——管**信任与可回滚**，不是另一个 Agent：

| 机制 | 作用 |
| --- | --- |
| **Permission** | 模式 + allow / ask / deny：放行、询问、拒绝 |
| **Sandbox** | 限制危险执行面 |
| **Checkpoint** | 编辑前快照，便于 rewind |
| **project trust** | 是否信任本项目自动行为 |

### Tools

把意图变成动作。内建大致五类：文件、搜索、执行（shell / git）、Web、代码智能（常需插件）。  
MCP 工具进**同一张表**——调用方式仍是模型发 tool call。

### Orchestration

- **Subagents**：隔离上下文跑完，摘要回主会话  
- **Dynamic workflow**：模型写脚本调度一批 worker  
- **Agent teams**（experimental）：多 Session，不是同环内 subagent  

它们挂在 Harness 上服务主环，**不替换主环**。

### 执行落点（与接入层正交）

| 落点 | 含义 |
| --- | --- |
| Local | 默认，在你机器上跑工具 |
| Cloud | 托管 / 自建环境里跑 |
| Remote Control | UI 可在别处，执行与文件仍可在本地 |

问的是「代码跑哪」，不是「你从哪个壳点进来」。

---

## 5. 回灌为什么重要

没有「工具结果 → Context」这一笔，模型只活在自己上一次幻觉里。  
**Agentic** 的技术含义就是：行动结果必须成为下一步的输入。图上的虚线不是装饰，是主环成立的条件。

---

## 6. 五个容易混的点

1. **Harness vs Model** — 运行时管行动与约束；模型管推理  
2. **主环 vs 扩展** — 环怎么转 vs 往环上插什么  
3. **Gate vs Agent** — 门控不是第二个大脑  
4. **执行落点 vs 接入层** — 跑在哪 vs 从哪说话  
5. **失败 vs 结束** — verify 不过再转一圈，是设计路径不是异常  

能默写 gather → act → verify，并说清 Context / Gate / Tools 各管一类事，这一篇就算过关。

---

## 7. 下一步

主环清楚了，看叠在环上的扩展各自**何时调用**。

→ [02 输入层](/ai/claude-code/02-layout/) · [04 扩展挂载：何时调用](/ai/claude-code/04-capabilities/)
