---
title: 示例笔记
description: 技术笔记的写作示例
---

这是一篇示例笔记。打开文章后，右侧会出现「本页目录」。

## 为什么用 Starlight

- 左侧导航适合按主题整理笔记
- 文章页自带 TOC，阅读长文更方便
- 静态构建，适合 GitHub Pages

## 怎么写新文章

1. 在 `src/content/docs/notes/` 新建 Markdown / MDX
2. 在 `astro.config.mjs` 的 `sidebar` 里挂上链接（或改成 `autogenerate`）
3. 本地运行 `pnpm dev` 预览

## 代码块示例

```ts
export function hello(name: string) {
	return `Hello, ${name}`;
}
```

## 下一步

- 把这篇删掉或改成你的真实笔记
- 在作品页补上项目介绍
