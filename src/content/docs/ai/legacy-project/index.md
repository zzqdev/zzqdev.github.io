---
title: 老项目理解 · 文章目录
description: 摸清陌生老项目的可实战流程：八步 → 图 → 清单 → CLAUDE.md → Skill → 一键串跑
---

目标不是读懂每一行，而是**当天能产出一套 AI 协作基础设施**，之后改代码有地图、有常识、有可复用流程。

素材来自《Claude Code 企业级老项目改造实战》第二部分；正文讲方法与验收，**可复制提示词集中在 [07 提示词手册](/ai/legacy-project/07-prompts/)**。

## 文章目录

| # | 文章 | 你当场能带走什么 |
| --- | --- | --- |
| 01 | [八步心法](/ai/legacy-project/01-overview/) | 锚点清单 + 三原则 |
| 02 | [四类图](/ai/legacy-project/02-repo-map/) | 画图能力装法 + 四类图用途 |
| 03 | [三张全景](/ai/legacy-project/03-main-path/) | 架构 / 模块 / 外部依赖落盘与 review |
| 04 | [接口与模型](/ai/legacy-project/04-modules/) | 清单、模型、互校要点 |
| 05 | [常识与 Skill](/ai/legacy-project/05-relations/) | CLAUDE.md 写法 + 挖 Skill |
| 06 | [一键摸清](/ai/legacy-project/06-change-entry/) | 串跑流程、产出树、完成标准 |
| 07 | [提示词手册](/ai/legacy-project/07-prompts/) | 全部可复制提示词（含一键） |

## 最短路径

1. 扫一眼 [01](/ai/legacy-project/01-overview/)  
2. 打开 [07](/ai/legacy-project/07-prompts/) 粘贴「一键摸清」  
3. 卡壳再回 [02](/ai/legacy-project/02-repo-map/)–[06](/ai/legacy-project/06-change-entry/) 看坑与验收  

## 跑完仓库应有

```text
CLAUDE.md
.claude/skills/<某个技能>/SKILL.md
docs/
  architecture.svg
  module-deps.svg
  external-deps.svg
  api-list.md
  data-model.md
  data-model-er.svg
```
