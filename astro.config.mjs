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
								{ label: '01 八步心法', slug: 'ai/legacy-project/01-overview' },
								{ label: '02 四类图', slug: 'ai/legacy-project/02-repo-map' },
								{ label: '03 三张全景', slug: 'ai/legacy-project/03-main-path' },
								{ label: '04 接口与模型', slug: 'ai/legacy-project/04-modules' },
								{ label: '05 常识与 Skill', slug: 'ai/legacy-project/05-relations' },
								{ label: '06 一键摸清', slug: 'ai/legacy-project/06-change-entry' },
								{ label: '07 提示词手册', slug: 'ai/legacy-project/07-prompts' },
							],
						},
						{
							label: 'Claude Code',
							items: [
								{ label: '文章目录', slug: 'ai/claude-code' },
								{ label: '01 分层全貌', slug: 'ai/claude-code/01-system' },
								{ label: '02 输入层', slug: 'ai/claude-code/02-layout' },
								{ label: '03 Harness 层', slug: 'ai/claude-code/03-loop' },
								{ label: '04 扩展挂载', slug: 'ai/claude-code/04-capabilities' },
								{ label: '05 模型与可及面', slug: 'ai/claude-code/05-wiring' },
								{ label: '06 输出与定制', slug: 'ai/claude-code/06-extend' },
								{ label: '07 实操', slug: 'ai/claude-code/07-practice' },
							],
						},
						{
							label: 'SDD',
							items: [{ label: '文章目录', slug: 'ai/sdd' }],
						},
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
				Footer: './src/components/Footer.astro',
			},
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
