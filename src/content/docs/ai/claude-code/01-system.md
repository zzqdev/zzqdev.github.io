---
title: 01 系统全貌：Agentic Harness
description: 全局——Claude Code 是什么、边界在哪、后面顺着什么读
---

没有完整源码时，读 Claude Code 最稳的入口不是命令清单，而是官方自己给出的那层定义：  
**Claude 是模型；Claude Code 是包在模型外面的 agentic harness。**

本篇只建立全局判断。材料主要来自 [How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works) 与 [Glossary](https://code.claude.com/docs/en/glossary)。

## 章节目录

1. 这一篇要回答什么
2. 一句话定位：是什么 / 不是什么
3. 两层结构：Model 推理，Harness 提供行动与约束
4. 主循环预告：gather → act → verify
5. 它能碰到什么：项目、终端、会话记忆
6. 同一引擎，多种表面
7. 安全面预告：权限与 checkpoint
8. 全貌阶段的完成标准
9. 下一步：落盘地图

---

## 1. 这一篇要回答什么

后面几篇会进目录、拆主循环、拆能力零件。本篇只做一件事：  
**先把「系统骨架」钉住，再进细节。**

读完应能回答：

- Claude Code 和「对话框里的 Claude」差在哪一层
- 官方说的 agentic harness 具体管什么
- 一次任务大致怎么转，扩展点大概挂在哪
- 自动化真实边界大概在哪，期望该压到什么水平

没有这张图，容易把它当成「更强的补全」或「无人工程师」，后面读配置和扩展都会偏。

---

## 2. 一句话定位：是什么 / 不是什么

**是什么：** 跑在终端（以及 IDE / Desktop / Web 等表面）里的 **agentic coding harness**。它给模型接上工具、管上下文、管执行环境与权限，让模型能在仓库里读改跑、多步纠偏。

**不是什么：**

| 常见误解 | 更准确的说法 |
| --- | --- |
| 又一个聊天机器人 | 无工具时只能吐文字；有工具才 agentic |
| IDE 行内补全 | 补全偏局部文件；它偏整条任务链路 |
| 等于 Claude 模型本身 | 模型负责推理；Claude Code 是外围那层 |
| 开源可通读的产品源码 | 公开仓主要是 changelog / plugins / 示例；产品本体闭源 |
| 无人值守全自动工程师 | 人可以打断、改向、验收；权限与检查点仍是设计前提 |

一句话收束：**Claude Code = 把 Claude 变成「能在你环境里行动的编码 Agent」的那层 harness，而不是模型商标换皮。**

---

## 3. 两层结构：Model 推理，Harness 提供行动与约束

官方把动力拆成两块：

1. **Models**  
   读代码、拆步骤、决定下一步、根据工具结果改道。文档里写「Claude chooses / decides」时，指的是模型在推理。

2. **Tools + context management + execution environment**  
   这才是 harness：文件与搜索、Shell、Web、代码智能、子代理编排；以及把哪些东西塞进上下文、在什么环境执行、什么动作要过权限。

没有工具，模型只能回复文本。  
有了工具，每次工具结果回流进循环，下一步才有依据——这就是 agentic 的技术含义。

扩展面（Skills、MCP、Hooks、Subagents）不另起炉灶，而是 **叠在这条主循环之上**。后面「能力面」「咬合」两篇会分别拆零件和接线。

---

## 4. 主循环预告：gather → act → verify

官方把每轮工作概括成三个会交织的阶段：

| 阶段 | 在干什么 |
| --- | --- |
| Gather context | 搜文件、读代码、看报错、拉外部信息 |
| Take action | 改文件、跑命令、调 MCP、派 subagent |
| Verify results | 再跑测试 / 构建 / 对照目标，不对就继续循环 |

任务不同，环的形态不同：只问结构可能停在 gather；修 bug 会反复三阶段；重构往往在 verify 上花很久。  
人也在环里：随时 `Esc` 打断，或塞一句纠正让它改道——不是点火后只能旁观。

Agent SDK 文档把同一套循环写得更「实现向」：收 prompt → 模型输出（文本和/或 tool calls）→ 运行时执行工具 → 结果回灌 → 直到不再要工具。  
**CLI 与 SDK 共享这套 loop**；读 SDK 的 agent loop，相当于读「核心运行时」的公开说明书。

本篇只记骨架；具体 turn、消息类型、何时结束，留给 [03 主循环](/ai/claude-code/03-loop/)。

---

## 5. 它能碰到什么：项目、终端、会话记忆

在某目录启动后，官方写明 harness 默认可及：

- **项目树**：当前目录及子目录；别处文件通常要你的许可
- **终端能力**：你能在 shell 里做的事，它原则上也能做（构建、git、包管理……）
- **Git 状态**：分支、未提交改动、近期历史
- **CLAUDE.md / AGENTS.md**：你写的持久项目说明
- **Auto memory**：它自己记的偏好与纠正（有体积上限，会话开始加载一部分）
- **你接上的扩展**：MCP、Skills、Subagents、浏览器相关能力等

和「只看见当前打开文件」的行内助手比，差别在：**上下文默认是仓库级的**，所以才能跨文件协调修改再验证。

会话本身也是系统的一部分：对话与工具轨迹会落成可恢复的 transcript；改文件前可做 checkpoint。细节进 [02 落盘地图](/ai/claude-code/02-layout/)。

---

## 6. 同一引擎，多种表面

| 维度 | 要点 |
| --- | --- |
| 执行环境 | Local（默认，在你机器上）、Cloud（托管或自建环境）、Remote Control（文件仍在本地，界面可在别处） |
| 交互表面 | 终端、Desktop、IDE 扩展、claude.ai/code、CI 等 |

官方强调：**表面变的是「你怎么看、怎么点」；底下的 agentic loop 同一套。**  
项目里的 CLAUDE.md、settings、MCP，在共享引擎的前提下跨表面复用——读系统时，应盯引擎与配置面，而不是某个 UI 皮肤。

---

## 7. 安全面预告：权限与 checkpoint

Harness 不是「模型想干什么就干什么」，至少有两道官方写明的安全机制：

1. **Permissions**  
   权限模式决定「不问你也能做多少」：Manual、Accept edits、Plan、Auto（分类器挡风险）等。细规则可写在 settings 里 allow / ask / deny。

2. **Checkpoints**  
   改文件前快照，便于 rewind；管的是文件编辑，不管远端系统副作用（DB、部署、不可逆 API）。那些仍要靠权限与你的验收。

再往外还有 sandbox、project trust、managed settings 等企业向控制。全貌阶段只需记住：  
**约束与可回滚，是 harness 的一等公民，不是附加插件。**

---

## 8. 全貌阶段的完成标准

不必背文档。能用自己的话讲清下面几条，全貌就算过关：

1. Claude Code 是 agentic harness，不是模型本身，也不是行内补全。
2. 动力 = 模型推理 + 工具行动；扩展叠在主循环上，不另起引擎。
3. 主循环是 gather → act → verify，人可以打断改向。
4. 默认可及仓库、终端与持久说明（CLAUDE.md / memory）；会话可恢复。
5. 多表面共用同一引擎；读系统应盯 loop 与配置，而不是某个客户端。
6. 权限与 checkpoint 是系统设计的一部分；没有源码时，官方架构页 + SDK loop + 本机落盘，就是可读的「源代码替代品」。

---

## 9. 下一步：落盘地图

全貌只回答「它是什么系统」。下一篇换镜头：东西实际写在磁盘哪。

→ [02 落盘地图：配置与会话](/ai/claude-code/02-layout/)

先分清用户级 `~/.claude` 与项目级 `.claude`，再看 settings 分层、会话 transcript、skills / hooks 通常落在哪——没有 `src/`，这些路径就是结构图。
