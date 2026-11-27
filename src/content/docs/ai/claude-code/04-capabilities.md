---
title: 04 扩展挂载：何时调用
description: Harness 扩展条——CLAUDE.md、Skills、MCP、Hooks、Subagents…
---

扩展叠在主环上，**不是另起引擎**。  
搞混的人通常不是「不会装」，而是分不清：**谁决定调用、什么时候进 Context、什么时候必跑**。

本篇只钉三件事：挂在哪、何时调用、和谁别混。  
官方建议新人顺序也很实在：先 CLAUDE.md → 再 Skill → 再 MCP → 再 Hook → 最后 Plugin。

材料：[Extend](https://code.claude.com/docs/en/features-overview)、[Glossary](https://code.claude.com/docs/en/glossary)。

![扩展挂载：何时调用](/ai/claude-code/04-extensions.svg)

---

## 1. 怎么往环上插

| 插法 | 典型扩展 |
| --- | --- |
| 多喂 Context | CLAUDE.md、rules、Skills、Output style、memory |
| 加长 Tools 表 | MCP、Code intelligence |
| 卡生命周期 | Hooks（确定性） |
| 拆出子环 | Subagents、Dynamic workflow |
| 打包带走 | Plugins |

`--bare` 可关掉多数扩展与项目说明，适合 CI 最小面。

---

## 2. 总表：何时调用

| 扩展 | 挂在哪 | 何时调用 |
| --- | --- | --- |
| **CLAUDE.md** / **rules** | → Context | **Session 启动自动加载**（「永远知道」）；带 `paths` 的 rule 按需 |
| **Skills** | → Context | **你打 `/name`**，或模型判定相关时按需 |
| **MCP** | → Tools 表 | **模型发出 tool call** 调外部能力时 |
| **Hooks** | → 生命周期 / Gate | **固定事件必触发**，不靠模型「想起来」 |
| **Subagents** | → Orchestration | **主 Agent 委托**隔离任务时 |
| **Output style** | → 指令面 | **整段 Session 生效** |
| **Plugins** | 打包单元 | **安装后**随包带上 Skills / Hooks / MCP / Subagents |
| **Code intelligence** | → Tools | 跳转定义 / 读诊断等需要时 |

此外还有 Auto memory、Dynamic workflow、Agent teams（experimental）、Artifacts / Channels 等。

---

## 3. 逐项咬死时机

### CLAUDE.md / rules

启动就进 Context；适合构建命令、约定、「永远不要 X」。  
**不适合**靠它保证每次格式化——那是 Hook。  
vs Skills：总是知道 vs 有时需要 / 可 `/` 触发。

### Skills

Markdown 说明书（知识或工作流），不是二进制插件。  
显式 `/deploy`，或描述匹配当前任务时由模型拉取。可与 Subagent 组合。

### MCP

给的是**行动能力**（数据库、Slack、浏览器…），不是「怎么写 commit message」的知识。  
vs Skill：MCP 接真系统；Skill 教「我们怎么查、怎么措辞」。

### Hooks

SessionStart、PreToolUse、PostToolUse、Stop、SessionEnd…  
**确定性**：事件到了就跑。适合格式化、拦 `rm -rf`、记账、通知。  
「不要改 .env」写在 md 里只是请求；PreToolUse 拦住才是强制。

### Subagents

主环需要隔离工人时（搜很多文件、并行查证）；摘要回主会话，中间过程不塞爆主 Context。  
vs Agent teams：同 Session 内 vs 多 Session（实验向）。

### Output style

整段 Session 的语气 / 角色 / 格式。  
vs CLAUDE.md：项目事实与规矩 vs 这会儿怎么答。

### Plugins

打包与分发，**不是新的运行时原语**。装上就生效；Skill 常带命名空间 `/plugin:skill`。

---

## 4. 怎么选：对着痛点下刀

| 你反复遇到 | 加什么 |
| --- | --- |
| 同一条约定说两遍还错 | CLAUDE.md / rules |
| 同一段开场 prompt 打第三遍 | Skill（可 `/`） |
| 总从浏览器抄 Claude 看不见的数据 | MCP |
| 必须每次编辑后 lint | Hook |
| 支线任务淹没主对话 | Subagent |
| 第二家仓库要同一套 | Plugin |

---

## 5. 五个容易混的点

1. **CLAUDE.md vs Skills** — 启动必加载 vs 按需 / 斜杠  
2. **Skill vs MCP** — 教怎么做 vs 能调用的外部动作  
3. **Hooks vs 一切说明** — 事件必跑 vs 给模型看的请求  
4. **Subagent vs Agent teams** — 同 Session 工人 vs 多 Session 协作  
5. **Plugin vs 新引擎** — 打包单元，不是第五种运行时  

能指着表说出至少五个扩展的「何时调用」，并分清说明 / 工具 / 事件三类，这一篇就算过关。

---

## 6. 下一步

扩展最终会调用 **模型**、碰到 **可及面**。

→ [03 Harness 层：主环](/ai/claude-code/03-loop/) · [05 模型层与可及面](/ai/claude-code/05-wiring/)
