---
title: Claude Code · 分层读法
description: 按架构分层读懂 Claude Code——概念轨建地图，实操轨推到熟练与精通
---

没有产品源码可读时，把官方架构文档、Agent SDK 说明、本机配置与会话落盘，当成「可读的系统说明书」。

本系列分两条轨，互不污染：

| 轨 | 读什么 | 带走什么 |
| --- | --- | --- |
| **概念** | 下方 01–06 | 一张分层图 + 易混边界 |
| **实操** | [07 实操：熟练到精通](/ai/claude-code/07-practice/) | 熟练六步、精通动手（Subagent / Hook 守门 / 非交互调用等）、模板与验收清单 |

概念篇只建地图，不堆长练习。熟练与精通的键入步骤、过关标准写在 07：前半是熟练主线，后半是精通动手；卡壳再回对应概念篇。

阅读顺序：概念按 **全貌 → 输入 → Harness 主环 → 扩展 → 模型/可及面 → 输出**；要推到熟练 / 精通，走 07。

---

## 概念轨（01–06）

| 层 | 文章 | 关注点 |
| --- | --- | --- |
| 全貌 | [01 分层全貌：输入到输出](/ai/claude-code/01-system/) | 产品 = Harness；五层 + 易混词 |
| 输入层 | [02 输入层](/ai/claude-code/02-layout/) | 说明、策略、历史、memory、加载开关 |
| Harness | [03 Harness 层：主环](/ai/claude-code/03-loop/) | gather → act → verify、回灌、内核零件 |
| Harness | [04 扩展挂载：何时调用](/ai/claude-code/04-capabilities/) | md / Skill / MCP / Hook… 各自何时挂上 |
| 模型 / 可及面 | [05 模型层与可及面](/ai/claude-code/05-wiring/) | 只发 tool call；可及 ≠ 放行；环境三分 |
| 输出 | [06 输出层与定制](/ai/claude-code/06-extend/) | G1/G2/G3（本系列读法）、对着坏输出下第一刀 |

## 实操轨

| 文章 | 关注点 |
| --- | --- |
| [07 实操：熟练到精通](/ai/claude-code/07-practice/) | 熟练六步；精通：委托 Subagent、Hook 守门、非交互调用；可选接 MCP；checklist |

赶时间：扫一眼 01 → 打开 07 从「最小输入面」写起；熟练勾完再做精通动手；概念卡壳再回 02–06。

---

## 材料边界

- 主线：[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Extend](https://code.claude.com/docs/en/features-overview)、[Glossary](https://code.claude.com/docs/en/glossary)、Agent SDK 的 agent loop
- 辅证：本机 `~/.claude`、项目 `.claude`、公开仓 changelog / plugins（不是产品源码）
- 不做：从 npm sourcemap 还原闭源实现当作正文依据
