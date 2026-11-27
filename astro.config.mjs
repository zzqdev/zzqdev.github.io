// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://zzqdev.github.io',
	integrations: [
		starlight({
			title: 'zzq',
			description: '皆有定数、加油',
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/zzqdev/zzqdev.github.io',
				},
			],
			sidebar: [
				{
					label: '技术笔记',
					items: [{ label: '示例笔记', slug: 'notes/example' }],
				},
				{
					label: 'AI 编程',
					items: [
						{ label: 'AI 编程入门', slug: 'ai' },
						{ label: 'Cursor 使用备忘', slug: 'ai/cursor-tips' },
						{
							label: '老项目理解',
							items: [
								{ label: '文章目录', slug: 'ai/legacy-project' },
								{ label: '01 全貌', slug: 'ai/legacy-project/01-overview' },
								{ label: '02 目录地图', slug: 'ai/legacy-project/02-repo-map' },
								{ label: '03 主链路', slug: 'ai/legacy-project/03-main-path' },
								{ label: '04 关键模块', slug: 'ai/legacy-project/04-modules' },
								{ label: '05 关系', slug: 'ai/legacy-project/05-relations' },
								{ label: '06 改动入口', slug: 'ai/legacy-project/06-change-entry' },
							],
						},
						{ label: 'Claude Code', slug: 'ai/claude-code' },
					],
				},
				{
					label: '作品',
					items: [{ label: '项目一览', slug: 'projects' }],
				},
			],
			customCss: ['./src/styles/global.css'],
			components: {
				Header: './src/components/Header.astro',
				Sidebar: './src/components/Sidebar.astro',
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
