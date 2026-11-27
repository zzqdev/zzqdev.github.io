# zzqdev.github.io

基于 [Astro Starlight](https://starlight.astro.build/) 的个人站点，视觉偏 [Fumadocs](https://fumadocs.dev) 的文档站风格。

新开 Cursor 对话时，项目规则 `.cursor/rules/site-workflow.mdc` 会自动带上；下面是给人看的速查。

## 本地开发

```sh
pnpm i
pnpm dev      # http://localhost:4321
pnpm build
pnpm preview
```

## 目录说明

| 路径 | 用途 |
| --- | --- |
| `src/content/docs/index.mdx` | 首页（splash，无侧栏） |
| `src/content/docs/notes/` | 技术笔记 |
| `src/content/docs/ai/` | AI 编程 |
| `src/content/docs/projects/` | 作品 / 项目 |
| `astro.config.mjs` | 站点信息、侧边栏 |
| `src/styles/global.css` | 主题色与 Fumadocs 风格微调 |
| `.cursor/rules/site-workflow.mdc` | 给 Agent 的操作约定 |

## 新增笔记

1. 新建文件，例如 `src/content/docs/notes/go-generics.md`：

```md
---
title: Go 泛型笔记
description: 记录常用泛型写法
---

正文……
```

2. 在 `astro.config.mjs` 的 sidebar 里挂上：

```js
{
  label: '技术笔记',
  items: [
    { label: '示例笔记', slug: 'notes/example' },
    { label: 'Go 泛型笔记', slug: 'notes/go-generics' },
  ],
},
```

3. `pnpm dev` 打开对应页面确认。

> `notes/foo.md` 的 slug 是 `notes/foo`，不要写成 `notes/foo/index`。

## 新增作品

1. 列表页：`src/content/docs/projects/index.md`（sidebar slug：`projects`）
2. 单项目：新建 `src/content/docs/projects/my-app.md`，sidebar 加 `{ label: 'My App', slug: 'projects/my-app' }`
3. 在列表页表格里补一行

## 改颜色

编辑 `src/styles/global.css`：

- `@theme` 里的 `--color-accent-*`：强调色（链接、当前项）
- `@theme` 里的 `--color-gray-*`：灰阶（现为 stone）
- `[data-theme='light']` 的 `--sl-color-bg`：米白背景

## 在 Cursor 里怎么说

新开窗口可以直接说，例如：

- 「加一篇笔记：标题 xxx，内容……」
- 「加一个作品页：项目名 xxx」
- 「把强调色改成蓝色」
- 「提交并推送」

## 部署

推送到 `main` 后由 GitHub Actions 发布。  
仓库 Settings → Pages → Source 选 **GitHub Actions**。  
站点：https://zzqdev.github.io
