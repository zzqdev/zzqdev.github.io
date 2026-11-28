---
title: AI 工程入门
description: 做 AI 系统时的范式与工程实践入口
---

记录把大模型做成可用系统时的范式、组件与踩坑。偏「造 AI」，与 [AI 编程](/ai/)（用 AI 写代码）并列。

## 子栏目

- [RAG](/ai-eng/rag/)：检索增强生成
- **Agentic**：自主规划与工具调用（待建）
- **Multi-Agent**：多 Agent 协作（待建）

## 可以记什么

- 范式对比（RAG / Agent / Workflow 等）
- 检索、切分、向量库与评测
- Agent 循环、工具、记忆与编排
- 观测、成本、延迟与上线清单

## 怎么写新文章

1. 在 `src/content/docs/ai-eng/` 下建 Markdown / MDX（子系列用子目录）
2. 在 `astro.config.mjs` 的 sidebar「AI 工程」里挂上链接
3. 本地运行 `pnpm dev` 预览
