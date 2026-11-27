---
title: 06 输出层与定制
description: 输出层三路产出，以及从哪下定制第一刀
---

Loop 转完（或转的过程中），产出分三路：**给你看的、落到可及面的、可回滚的**。  
定制不是「功能清单购物」——是对着坏输出选层，才不至于一上来堆插件。

材料：[Extend](https://code.claude.com/docs/en/features-overview)、[Settings](https://code.claude.com/docs/en/settings)、[How Claude Code works](https://code.claude.com/docs/en/how-claude-code-works)。

![输出层三路与定制第一刀](/ai/claude-code/06-output.svg)

---

## 1. 三路产出：G1 / G2 / G3

**G1 / G2 / G3 是本系列的读法**，用来区分「给你看的 / 落到可及面的 / 可回滚的」；不是官方 Glossary 词条。机制仍对应 Gate、Checkpoint 与工具副作用。

| | 去向 | 你怎么验收 |
| --- | --- | --- |
| **G1** | 给你：解释、提问、计划、摘要 | 读、追问、改向 |
| **G2** | 给可及面：改文件、跑命令、调服务 | diff、测试、日志 |
| **G3** | 可回滚形态：Checkpoint 覆盖的文件编辑 | `/rewind`、对照快照 |

**机制在 Gate；G3 只描述形态。**  
Checkpoint 主要罩**文件编辑**；已 push 的 PR、已打的生产请求、未纳入快照的副作用——不在同一套回滚里。

G1 的提问 / 计划是协作设计的一部分，不是「没干活」。

---

## 2. 从输出反推：问题出在哪一层

| 你看到的糟心输出 | 优先怀疑 | 第一刀常落在 |
| --- | --- | --- |
| 口吻 / 格式每次都要重说 | 输入层 / Output style | Output style 或 CLAUDE.md 短规则 |
| 总忘项目约定 | 输入层 · Context | CLAUDE.md / rules |
| 会说不会连真系统 | 可及面 / Tools | MCP |
| 每次改完文件格式乱 | Gate 后置动作 | PostToolUse Hook |
| 乱删乱推仍靠「别这样」 | Gate | Permission 规则 + PreToolUse Hook |
| 主会话被搜库淹没 | Orchestration | Subagent |
| 远端副作用无法 rewind | 期望错误 | 权限收紧 + 人工验收，不幻想 G3 |

---

## 3. 第一刀顺序

官方 Extend 的演进顺序，落到手上可以是：

1. **CLAUDE.md（短）** — 只写「永远要 / 永远不要」和构建测试命令；超过约两百行，拆到 `rules/` 或 Skills  
2. **权限模式与关键 deny** — 先挡住不可逆操作；比写十句「请小心」有效  
3. **一个高频 Skill** — 已经手打第三遍的同一段流程 → `/name`  
4. **一个 Hook** — 必须每次发生的事（format、拦命令）→ 事件驱动  
5. **MCP** — 只有当「外部真数据 / 真动作」成为瓶颈时再接  
6. **Plugin** — 第二家仓库要复用同一套时再打包  

若糟心点是**主会话被搜库或长日志淹没**，优先 Subagent（编排隔离），不要先堆更长的 CLAUDE.md——那只会让 Context 更胀。

CI 脚本路径：优先 `--bare` + 显式需要的最小面，避免把个人 Skills 意外带进流水线。

---

## 4. 验收：怎么算改对了

每下一刀，至少做三件里的两件：

1. **新开一个 Session**（避免「聊天里刚说过」的假成功）  
2. **看 G2**：diff / 测试是否真变好  
3. **看 Gate**：该拦的是否仍拦、该自动的是否仍自动  

若只有 G1 变得更会说话、G2 没变——你可能只写进了 Context，没有挂上 Tools / Hooks。

---

## 5. 边界

- 默认是 **人 + Agent 协作**；输出层里 G1 是设计的一部分  
- G3 不是时光机；远端与未快照副作用要靠 Gate + 人  
- 只会某个接入层客户端学不完；差距在输入层喂什么、Gate 怎么设、你怎么验 G2  

---

## 6. 五个容易混的点

1. **G1 vs G2** — 说得好 ≠ 仓库真变好  
2. **G3 vs 撤销一切** — Checkpoint 主要罩文件编辑  
3. **定制 vs 堆扩展** — 先对坏输出选层，再装功能  
4. **写进 Context vs 挂上强制** — md / Skill 是请求；Hook / deny 才是门  
5. **换客户端 vs 换约束** — 壳换了，输入与 Gate 没设，坑还在  

能指着图说出 G1 / G2 / G3，并能从一个糟心输出反推第一刀，这一篇就算过关。

---

## 7. 系列收束

概念六篇对齐同一张分层图：

| 篇 | 层 |
| --- | --- |
| [01](/ai/claude-code/01-system/) | 全貌（输入到输出） |
| [02](/ai/claude-code/02-layout/) | 输入层 |
| [03](/ai/claude-code/03-loop/) | Harness 主环 |
| [04](/ai/claude-code/04-capabilities/) | 扩展挂载 |
| [05](/ai/claude-code/05-wiring/) | 模型与可及面 |
| 06 | 输出与定制 |

没有产品源码时，这张图 + 官方 How it works / Extend + 本机 `.claude`，就是可读的系统说明书。

要把地图用到**熟练 / 精通**，练习与 checklist 在实操轨，不堆在概念文里：

→ [07 实操：熟练到精通](/ai/claude-code/07-practice/)

→ [05 模型层与可及面](/ai/claude-code/05-wiring/) · [目录](/ai/claude-code/)
