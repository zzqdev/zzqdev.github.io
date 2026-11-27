---
title: 04 关键模块：局部深入
description: 局部——Agent、SDD 工具、Skills 与 Harness 组件
---

主链路像地铁线路图；这一篇是车站特写。  
我不打算做成工具说明书——只想搞清：**每个模块解决什么问题、边界在哪、什么时候值得搬上台面。**

## 章节目录

1. 这一篇要回答什么
2. Agent 五组件：LLM / Tools / Memory / Loop / Environment（参考扩展篇·Agent）
3. 用五组件看 Claude Code（对照 Cursor / 其他 Agent）
4. Spec-Kit：原理、命令与适用边界（参考扩展篇·Spec-Kit 和 OpenSpec）
5. OpenSpec：原理、命令与适用边界
6. Skills：能力上提与偏好编码（参考扩展篇·Skills）
7. Harness 工具箱：CLAUDE.md、Subagents、Plan Mode、Permission、Hooks
8. Superpowers：工作流型 Skills 框架（参考扩展篇·Superpowers）
9. Hermes Agent：可对照的另一类 Agent 形态（参考扩展篇·Hermes）
10. 模块怎么选：场景对照表
11. 下一步：看模块之间的关系

---

## 1. 这一篇要回答什么

词被用滥了：什么都叫 Agent，什么都叫 Skill。  
我想要一把尺子——看见一个新名词，能放到骨架上，而不是又收藏一个链接。

---

## 2. Agent 五组件：LLM / Tools / Memory / Loop / Environment

课前材料给过一句技术定义：Agent 是能感知环境、自主决策、执行动作、并基于反馈循环迭代的程序。落地成五个零件：

| 组件 | 角色 |
| --- | --- |
| LLM | 决策引擎：理解、规划、选工具、判完成 |
| Tools | 行动能力：读写文件、跑命令、调 API、MCP |
| Memory | 状态：上下文、会话、长期记忆 |
| Loop | 循环：感知 → 决策 → 行动 → 反馈 |
| Environment | 交互对象：仓库、终端、浏览器、外部系统 |

没有 LLM，自主决策立不住，只剩脚本。  
没有 Tools，模型只会说话，改不了世界。  
**Agent 的自主边界，本质上是 Tools 的边界**——没给的能力，它做不了；乱给的能力，它会闯祸。

---

## 3. 用五组件看 Claude Code（对照 Cursor / 其他 Agent）

同一把尺子量下来：

- **Claude Code**：CLI 环境 + 强工具面（读写、bash、任务）+ 会话记忆 + 明显 Loop；偏「长任务工程协作者」  
- **Cursor Agent**：环境主要在 IDE；交互强，Agent 化深度因模式而异  
- **套壳 Chat**：有 LLM，Tools / Loop 很弱，更像聊天机器人  
- **纯 Workflow**：有 Loop 和 Tools，但决策被写死，缺真正的自主决策  

ChatGPT 算不算 Agent？五组件不齐就别硬叫。名字不重要，**缺哪块，能力天花板就在哪。**

---

## 4. Spec-Kit：原理、命令与适用边界

Spec-Kit 走 **spec-as-source**：规格是事实来源，不是 chat 历史。命令链覆盖从 constitution / specify 到 implement 的闭环，自动化味道重。

适合：中等复杂度新功能、探索性开发、团队要用同一份 tasks 对齐、新人练 SDD。  
不适：关键架构决策想全权给人、老项目只改一小角却硬写完整 Spec、你其实只需要 delta。

它的哲学很纯粹——也因此有点重。用它，是在买「结构化」；买贵了的时候，你会感觉流程比问题还大。

---

## 5. OpenSpec：原理、命令与适用边界

OpenSpec 更 **brownfield-first**：Propose → Apply → Archive，核心资产是 **delta spec**。人控拆任务，AI 控局部执行。

适合：改造、开源贡献、增量 feature、关键路径要人盯着。  
不适：你想最大程度甩手、或任务天然适合「整本 Spec 一次铺开」。

和 Spec-Kit 不是谁淘汰谁，是两个流派：完整规格 vs 增量规格。读老项目时，我更常先问：「这里缺的是圣经，还是一张变更单？」

---

## 6. Skills：能力上提与偏好编码

Skill ≈ SOP + 工具箱：固定步骤写下来，需要时带上对的工具用法。一个目录、一份 `SKILL.md`，跨工具兼容性越来越好。

两类价值我分得很开：

1. **Capability Uplift**：教会 AI 做它本来不熟的事（某类迁移、某类审查）  
2. **Encoded Preference**：教会 AI 按你的方式做事（风格、禁区、产出格式）

和邻居的界限：

- MCP：能调用什么外部能力  
- Skill：某类任务按什么标准做（可指导如何用 MCP）  
- Subagents：隔离上下文的执行单元  
- Commands：手动触发的短流程  
- Plugins：打包分发的一层皮  

Skills 不是装得越多越强。装一堆从不触发的 Skill，只是另一种名存实亡目录。

---

## 7. Harness 工具箱：CLAUDE.md、Subagents、Plan Mode、Permission、Hooks

Harness 不是单个文件，是一套合奏：

- **CLAUDE.md**：一上来就懂项目  
- **Skills / Commands**：可复用能力  
- **Subagents**：脏活隔离，护住主对话  
- **Plan Mode**：重要操作先出示计划  
- **Permission**：自主边界  
- **Hooks**：事后（和事前）自动校验  

轻量场景两个就够；改造大型仓库时 Subagents + Permission 往往比花哨 Skill 更救命。  
**克制是工程师姿态：该用才用。**

---

## 8. Superpowers：工作流型 Skills 框架

Superpowers 可以看成「把一整条工作流打成 Skills 组合」的社区实践——不只是单个 SOP，而是围绕真实工程节奏编排放技能包。

我把它放在「Skills 的进阶形态」：当你自己的零散 Skill 开始互相打架、缺少编排时，再去看这类框架怎么组织，比一上来就全盘照搬有用。

---

## 9. Hermes Agent：可对照的另一类 Agent 形态

Hermes 一类项目强调持久记忆、自我改进、更「Agent OS」向的能力。对照价值不在安利某个仓库，而在：

- 单 Agent（Claude Code）解决「一个工程师旁边的协作者」  
- Agent OS 解决「多 Agent、记忆、路由、企业接入」  

读 OryxOS 这类项目时，Hermes 是很好的参照系：同样是 Agent，问题域上了一层。五组件还在，多了系统级的调度与隔离。

---

## 10. 模块怎么选：场景对照表

| 场景 | 我更先摸的模块 |
| --- | --- |
| 新模块，需求还糊 | Spec-Kit 或先写手写 Spec |
| 老项目改一角 | delta spec + Permission + Hooks |
| 熟栈小步迭代 | CLAUDE.md + Skill + 轻量手工 |
| 要读十万行 | Subagents，别污染主对话 |
| 接 CI | Headless + Hooks + 严 Permission |
| 重复劳动第三次 | 沉淀 Skill，而不是再讲一遍 |

没有万能组合。模块是零件，场景才是图纸。

---

## 11. 下一步：看模块之间的关系

零件认识了，下一篇看咬合：谁依赖谁、哪些能组合、哪些会错配，以及项目文档链怎样把「想」喂给「做」。

→ [05 关系：谁依赖谁](/ai/legacy-project/05-relations/)
