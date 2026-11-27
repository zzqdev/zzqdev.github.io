---
title: 02 四类图：装上画图能力
description: 实战——装画图 Skill、四类图用途、review 硬线；提示词见手册
---

**结论：** 画全景之前先让 Agent 能出 SVG/PNG。图必有错——**AI 起稿，你 review，定稿进 `docs/`。**

提示词全文 → [07 提示词手册 · 四类图](/ai/legacy-project/07-prompts/#四类图)

---

## 装画图能力（5 分钟）

Skill = 目录 + `SKILL.md`，装在 `~/.claude/skills/` 或项目 `.claude/skills/`。

常用方案（Mermaid 为主）：

```bash
npm install -g claude-mermaid   # Node ≥ 20
```

Claude Code 内：

```text
/plugin marketplace add veelenga/claude-mermaid
/plugin install claude-mermaid@claude-mermaid
```

**完全退出再启动**，用手册里的「画图验证」话术试一张。

工具取舍：Mermaid 日常 90%；PlantUML 偶发复杂 UML；draw.io 只做对外精修。

---

## 四类图速查

| 图 | 回答 | 何时翻 |
| --- | --- | --- |
| 架构图 | 系统骨架 | 对齐共识、写 CLAUDE.md、估影响 |
| 模块依赖图 | 仓内谁依赖谁 | 改动辐射、找循环 |
| 时序图 | 一次请求怎么走 | 追接口、对照改造前后 |
| ER 图 | 表与主外键 | 数据改造、讲模型 |

命门：**读真文件 / 先 grep**，禁止按名字脑补。全景三张在 [03](/ai/legacy-project/03-main-path/) 正式落盘。

---

## Review 硬线

- [ ] 核心模块在不在？废弃物有没有画成核心？  
- [ ] 依赖方向是否和构建文件一致？循环有没有标红？  
- [ ] 周边设施有没有抢戏淹没主干？  
- [ ] 已进 `docs/`，可再渲  

好看三点：同类同色、方框只留标题+一句、全项目架构图统一 TD 或 LR。

---

## 本篇验收

- [ ] 能渲染并保存至少一张图到磁盘  
- [ ] 四类图知道各自干什么  
- [ ] 会打开手册复制对应提示词  

→ [03 三张全景](/ai/legacy-project/03-main-path/)
