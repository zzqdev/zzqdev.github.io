---
title: Claude Code · 分层读法
description: 按架构分层读懂 Claude Code
---

没有产品源码可读时，把官方架构文档、Agent SDK 说明、本机配置与会话落盘，当成「可读的系统说明书」。  
阅读顺序对齐分层图：**全貌 → 输入层 → Harness 主环 → 扩展 → 模型/可及面 → 输出**。每篇可独立打开；合起来是同一张图。

## 文章目录

| 层 | 文章 | 关注点 |
| --- | --- | --- |
| 全貌 | [01 分层全貌：输入到输出](/ai/claude-code/01-system/) | 产品 = Harness；五层 + 易混词 |
| 输入层 | [02 输入层](/ai/claude-code/02-layout/) | 说明、策略、历史、memory、加载开关 |
| Harness | [03 Harness 层：主环](/ai/claude-code/03-loop/) | gather → act → verify、回灌、内核零件 |
| Harness | [04 扩展挂载：何时调用](/ai/claude-code/04-capabilities/) | md / Skill / MCP / Hook… 各自何时挂上 |
| 模型 / 可及面 | [05 模型层与可及面](/ai/claude-code/05-wiring/) | 只发 tool call；可及 ≠ 放行；环境三分 |
| 输出 | [06 输出层与定制](/ai/claude-code/06-extend/) | G1/G2/G3、对着坏输出下第一刀 |

## 材料边界

- 主线：[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Extend](https://code.claude.com/docs/en/features-overview)、[Glossary](https://code.claude.com/docs/en/glossary)、Agent SDK 的 agent loop
- 辅证：本机 `~/.claude`、项目 `.claude`、公开仓 changelog / plugins（不是产品源码）
- 不做：从 npm sourcemap 还原闭源实现当作正文依据
