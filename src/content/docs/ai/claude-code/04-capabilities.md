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

常见两种用法（可并存）：

| 用法 | 典型内容 | 怎么触发 |
| --- | --- | --- |
| **规范 / 知识** | 约定、检查清单、领域说明 | 多半靠 `description` 匹配，模型判定相关时加载 |
| **固定流程** | 发版检查、固定多步操作 | 常配合 `/name`；也可用 `disable-model-invocation` 只允许斜杠触发 |

**渐进式加载**（官方 Skills 的常见做法）：技能目录先在；`SKILL.md` 正文按需进 Context；更长的参考材料放在技能目录下的其它文件里，用到再读——避免一上来灌满窗口。

### MCP

给的是**行动能力**（数据库、Slack、浏览器…），不是「怎么写 commit message」的知识。  
vs Skill：MCP 接真系统；Skill 教「我们怎么查、怎么措辞」。

### Hooks

SessionStart、PreToolUse、PostToolUse、Stop、SessionEnd…  
**确定性**：事件到了就跑。适合格式化、拦 `rm -rf`、记账、通知。  
「不要改 .env」写在 md 里只是请求；PreToolUse 拦住才是强制。

职责上常这样分：

- **PreToolUse** — 执行前守门：拦危险命令、挡敏感路径  
- **PostToolUse** — 执行后质量：格式化、lint、记审计日志  

### Subagents

主环需要隔离工人时委托；**独立 loop**，摘要回主会话，中间过程不塞爆主 Context。  
子代理不能再生成子代理（一层委托）。

适合动手的场景：

| 场景 | 为什么用 Subagent |
| --- | --- |
| 全库搜索 / 大范围探查 | 中间过程隔离，主会话只收摘要 |
| 只读审查 | 权限收窄，降低误改风险 |
| 测试输出、长日志 | 高噪声消化后再汇报 |
| 彼此独立的多路探查 | 可并行，再在主会话汇总 |

vs Agent teams：同 Session 内的工人 vs 多 Session 协作（后者偏 experimental）。

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
| 同一段开场 prompt 打第三遍 | Skill（可 `/`）；规范类靠 description，流程类可强制斜杠 |
| 总从浏览器抄 Claude 看不见的数据 | MCP |
| 必须每次编辑后 lint / 格式化 | PostToolUse Hook |
| 危险命令只靠「请小心」 | deny 或 PreToolUse Hook |
| 支线搜库、长日志淹没主对话 | Subagent（先隔离，再堆更多写进 Context 的说明） |
| 第二家仓库要同一套 | Plugin |

---

## 5. 五个容易混的点

1. **CLAUDE.md vs Skills** — 启动必加载 vs 按需 / 斜杠  
2. **Skill vs MCP** — 教怎么做 vs 能调用的外部动作  
3. **Hooks vs 一切说明** — 事件必跑 vs 给模型看的请求；Pre 守门 vs Post 质量  
4. **Subagent vs Agent teams** — 同 Session 工人 vs 多 Session 协作  
5. **Plugin vs 新引擎** — 打包单元，不是第五种运行时  
6. **规范型 Skill vs 流程型 Skill** — description 匹配 vs 常 `/name`（可 `disable-model-invocation`）  

能指着表说出至少五个扩展的「何时调用」，并分清说明 / 工具 / 事件三类，这一篇就算过关。动手见 [07 实操](/ai/claude-code/07-practice/)。

---

## 6. 下一步

扩展最终会调用 **模型**、碰到 **可及面**。

→ [03 Harness 层：主环](/ai/claude-code/03-loop/) · [05 模型层与可及面](/ai/claude-code/05-wiring/)
