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
					label: '作品',
					items: [{ label: '项目一览', slug: 'projects' }],
				},
			],
			customCss: ['./src/styles/global.css'],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
