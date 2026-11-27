---
title: AI 编程入门
description: 用 AI 辅助编程的实践笔记入口
---

记录和 AI 一起写代码时的流程、提示词与踩坑。

## 子栏目

- [老项目理解](/ai/legacy-project/)：全局 → 局部 → 关系 → 改动
- [Claude Code](/ai/claude-code/)：分层读法（全貌 → 输入/接入 → Harness 主环 → 扩展 → 模型/可及面 → 输出）
- [Cursor 使用备忘](/ai/cursor-tips/)

## 可以记什么

- 常用工作流（规划 → 实现 → 审查）
- 提示词模板与可复用约定
- 工具选型（编辑器 Agent、CLI、MCP 等）
- 失败案例：幻觉、误改、过度改动

## 怎么写新文章

1. 在 `src/content/docs/ai/` 新建 Markdown / MDX
2. 在 `astro.config.mjs` 的 sidebar「AI 编程」里挂上链接
3. 本地运行 `pnpm dev` 预览
