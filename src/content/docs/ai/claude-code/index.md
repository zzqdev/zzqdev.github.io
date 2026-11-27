---
title: Claude Code · 系统理解
description: 没有完整源码时，用官方文档与可观察面读懂 Claude Code
---

没有产品源码可读时，把官方架构文档、Agent SDK 说明、本机配置与会话落盘，当成「可读的系统说明书」。  
阅读顺序仍按：**全局 → 局部 → 关系 → 改动**。

## 文章目录

| 层次 | 文章 | 关注点 |
| --- | --- | --- |
| 全局 | [01 系统全貌：Agentic Harness](/ai/claude-code/01-system/) | 模型 vs Harness、边界、主循环预告 |
| 全局 | [02 落盘地图：配置与会话](/ai/claude-code/02-layout/) | `~/.claude`、项目 `.claude`、会话与设置分层 |
| 局部 | [03 主循环：Context → Action → Verify](/ai/claude-code/03-loop/) | agentic loop 怎么转、turn 是什么 |
| 局部 | [04 能力面：Tools 与扩展](/ai/claude-code/04-capabilities/) | 内建工具、Skills、MCP、Hooks、Subagents |
| 关系 | [05 咬合：上下文、权限、扩展点](/ai/claude-code/05-wiring/) | 零件如何挂上 loop，常见错配 |
| 改动 | [06 改动入口：从哪定制](/ai/claude-code/06-extend/) | CLAUDE.md、权限、Skill、Hook 的第一刀 |

## 材料边界

- 主线：[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)、[Glossary](https://code.claude.com/docs/en/glossary)、Agent SDK 的 agent loop
- 辅证：本机 `~/.claude`、项目 `.claude`、公开仓 changelog / plugins（不是产品源码）
- 不做：从 npm sourcemap 还原闭源实现当作正文依据
