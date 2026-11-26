# zzqdev.github.io

基于 [Astro Starlight](https://starlight.astro.build/) 的个人站点，视觉偏 [Fumadocs](https://fumadocs.dev) 的文档站风格。

## 本地开发

```sh
pnpm i
pnpm dev
```

## 构建

```sh
pnpm build
pnpm preview
```

## 内容

- 首页：`src/content/docs/index.mdx`
- 笔记：`src/content/docs/notes/`
- 作品：`src/content/docs/projects/`
- 侧边栏 / 站点信息：`astro.config.mjs`
- 主题色：`src/styles/global.css`

## 部署

推送到 `main` 后由 GitHub Actions 发布到 GitHub Pages。  
仓库 Settings → Pages → Source 选 **GitHub Actions**。
