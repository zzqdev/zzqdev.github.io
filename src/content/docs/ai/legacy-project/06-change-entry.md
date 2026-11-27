---
title: 06 一键摸清：串跑与完成标准
description: 实战——串跑流程、产出树、完成标准；一键提示词见手册
---

**结论：** 分步是为了看清；熟了就一条提示词串跑。跑完验收 summary + 人手补禁区，再进护栏阶段。

一键提示词 → [07 提示词手册 · 一键摸清](/ai/legacy-project/07-prompts/#一键摸清)

---

## 准备

```bash
git clone <repo>
cd <project-root>
mkdir -p docs .claude/skills
```

在项目根开 Claude Code，打开手册粘贴「一键摸清」（改方括号）。

| 写法 | 为什么 |
| --- | --- |
| 不要每步问我 | 授权一口气跑完 |
| 不合格自己重跑 | review 责任在执行方 |
| summary 攒最后 | 一次决策换十次打断 |
| 禁区「待补充」 | 防瞎编 |

耗时常见 15–30 分钟。你回来只做三件事：读 summary、手写禁区/包袱、抽查关键图与清单。

---

## 期望产出树

```text
your-project/
├── CLAUDE.md
├── .claude/skills/
│   └── docs-auto-sync/
│       └── SKILL.md
└── docs/
    ├── architecture.svg
    ├── module-deps.svg
    ├── external-deps.svg
    ├── api-list.md
    ├── data-model.md
    └── data-model-er.svg
```

---

## 完成标准

- [ ] 凭图/清单能指出核心链路与改动入口  
- [ ] 图、接口、模型已互校，矛盾有结论  
- [ ] `CLAUDE.md` 链接真实、禁区/包袱非幻觉  
- [ ] 至少一个 Skill 用真实话术跑通过  
- [ ] summary 里「待人工确认」已处理或记下  

---

## 卡壳时回哪篇

| 现象 | 回 |
| --- | --- |
| 不会画 / 不落盘 | [02](/ai/legacy-project/02-repo-map/) |
| 三张图缺或乱 | [03](/ai/legacy-project/03-main-path/) |
| 接口漏模块 / 模型对不上 | [04](/ai/legacy-project/04-modules/) |
| CLAUDE 太长 / Skill 不触发 | [05](/ai/legacy-project/05-relations/) |
| 缺可复制话术 | [07](/ai/legacy-project/07-prompts/) |
| 不知道为什么要摸清 | [01](/ai/legacy-project/01-overview/) |

---

## 下一步

```text
建护栏（环境 + 测试摸底 + 必要时 Characterization + CI）
  → 拆需求与方案
  → 小步改 + 人拍板
```

地图有了，还要围栏——**先能跑、能测，再敢改。**

系列目录：[老项目理解 · 文章目录](/ai/legacy-project/)
