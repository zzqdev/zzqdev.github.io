---
title: 06 工具谱系与选型：四套流程、三种模式
description: Robert 闭环 / 轻量手工 / OpenSpec / Spec-Kit / Kiro 的命令与工件；三种模式六维对比；三套选型框架
---

**结论：** SDD 有四套不同重量的落地流程，从轻到重：**Robert 四步闭环（无工具）→ 轻量手工模式（无工具）→ OpenSpec（轻工具）→ Spec-Kit（重工具）**，企业级再往上是 AWS Kiro。不是越重越好，是按团队体量、项目阶段、工程师水平选。

> 材料边界：各工具命令名 / 安装方式 / 集成形态在版本间会变（Spec-Kit 对 Claude Code 的集成已从早期 slash 命令演进到 skills 模式）。本篇记原理与判断标准，具体命令以实施时官方文档为准。

---

## 四套流程一览

| 流程 | 步骤 | 产出工件 | 适用 |
| --- | --- | --- | --- |
| **Robert 四步闭环**（无工具） | 定规范 → AI 执行 → 人验证 → 迭代规范 | CLAUDE.md + 模块接口契约 + 任务规范 | 所有项目、贯穿生命周期 |
| **轻量手工模式**（无工具） | 脑子想透方案 → 拆小任务 → AI 一段段执行 → 每段立刻 review | CLAUDE.md + Skill + 任务卡片 | 熟悉的技术栈、增量、关键路径、资深工程师 |
| **OpenSpec 三态**（轻工具） | Propose → Apply → Archive | proposal / design / tasks / **delta spec**（ADDED/MODIFIED/REMOVED） | brownfield 增量改造、多 change 并行、开源贡献 |
| **Spec-Kit 4 阶段**（重工具） | constitution → specify →〔clarify〕→ plan → tasks →〔analyze〕→ implement | constitution.md / spec.md(~800 行) / plan.md / tasks.md | greenfield 中大项目、严格合规、方法论训练 |

---

## 轻量手工模式（不用任何 SDD 工具）

> 核心：人在脑子里完成方案设计和任务拆分，AI 一段一段执行，人一段一段 review。只用两件工具：**CLAUDE.md**（项目上下文 + 编码规范）+ **Skill**（封装重复模式）。

任务粒度小到「AI 一次能写完、你一次能 review 完」——一般是一个函数、一个类、一段几十行逻辑。

**五个优势**：① 质量可控（AI 不做创造性决策）② 代码可 review（增量始终在认知带宽内）③ 可维护（半年后认得出是你的代码，虽然字是 AI 敲的）④ 速度其实不慢（AI 做错决策的成本远高于人做对决策再让 AI 执行）⑤ 工具学习成本极低。

**适用边界**：适合已熟悉的技术栈、想得清楚的业务、增量开发、关键路径；不适合完全陌生的领域、需大量探索的项目、规模过大（任务数太多纯靠脑子拆会乱）。

> 金句：**SDD 的核心是思考方法，不是工具本身。** 当你对项目足够熟、规模可控、任务粒度天然小，「想清楚再做」在你脑子里就能完成，产出物不需要外化——这不是 SDD 失效，是 SDD 已内化成工作习惯，不需要外部脚手架了。

---

## OpenSpec（轻工具、增量、brownfield-first）

**三态**：每个 change 是独立状态机 / 独立 folder。

- **Propose**：写出 change 的 proposal、design、tasks、delta spec（还没实施）
- **Apply**：AI 按 tasks 执行（中途出问题可从断点 resume）
- **Archive**：change folder 移到 `openspec/changes/archive/<date>-<name>/`，delta 合并到主 spec `openspec/specs/<domain>/spec.md`

**delta spec 三个 marker**（OpenSpec 最关键设计，Spec-Kit 当下没有）：

- `ADDED Requirements`：这次新增的需求
- `MODIFIED Requirements`：这次修改的需求（**要写明「之前是什么」**）
- `REMOVED Requirements`：这次删除的需求

> 你不需要写完整 spec，只需写「这次要改什么、改成什么样、为什么改、不破坏什么」。两个并行的 change 可以同时改同一份 spec 的不同 requirement，互不冲突。

**命令**（前缀 `/opsx:`）：core profile 有 `propose`、`explore`（先讨论不产工件）、`apply`、`sync`、`archive`；扩展 profile 有 `new`、`continue`（一次产一个工件）、`ff`（一次产所有）、`verify`（archive 前一致性检查，给 CRITICAL/WARNING/SUGGESTION 三档）、`bulk-archive`、`onboard`（把现有项目接入）。

**spec 写法约定**：用 **RFC 2119 keywords（MUST/SHALL/SHOULD/MAY）** 表需求强度，用 **Given/When/Then** 表场景——与 BDD 一致，每个 requirement 可直接转测试用例。

官方口号：`fluid not rigid, iterative not waterfall, easy not complex, brownfield-first`。**一个 PR 本质上就是一个 delta spec**，所以开源贡献尤其顺手。

---

## Spec-Kit（重工具、4 阶段闭环、spec-as-source）

**四阶段**：`specify → plan → tasks → implement`，每阶段有正式 artifact，前一阶段输出是后一阶段输入，**没有跨阶段 shortcut**。

**6 个核心命令**（前缀 `/speckit.`）：

1. `constitution` — 写项目宪法，定义非协商原则。**每个项目只写一次，整个生命周期不轻易改，不允许 AI 自己修改**
2. `specify` — 把需求转成 spec，输出 user story + acceptance criteria（**spec-as-source 的源头**，生成的 spec 通常 800 行左右）
3. `plan` — 根据 spec + constitution 生成技术方案；会主动检查与 constitution 的一致性，违反的方案不采纳
4. `tasks` — 把 plan 拆成可执行有序任务列表，**按 user story 组织**，标记可并行任务与依赖
5. `taskstoissues` — 把任务列表转成 GitHub issues
6. `implement` — AI 按 tasks 逐个执行（**推荐一个一个 task 跑，方便中途审查**）

**3 个可选命令（严格项目强烈推荐）**：

- `clarify` — 在 specify 后、plan 前跑：AI 自动找出 spec 模糊点，**反过来问你问题**，减少 plan 返工
- `analyze` — 在 tasks 后、implement 前跑：**跨 artifact 一致性检查**（constitution↔spec↔plan↔tasks）。**这是防 spec 漂移的核心工具**，只读、只报告不改文件
- `checklist` — 自定义质量校验清单（如「测试覆盖率达标」「公开 API 有文档」）

**环境**：Specify CLI（Python 3.11+，推荐 uv 安装）；`specify init` 生成 `.specify/` 工作区（含 `.specify/memory/constitution.md` 与 spec/plan/tasks 目录）。支持 20~30+ AI agent。

> 注：Robert 31 讲演示用的是简化的 `spec/`（project.spec.md / modules/*.spec.md / tasks/*.task.md）结构，与官方 `.specify/` 不同——前者是示意性写法，落地以官方 Specify CLI 为准。

---

## AWS Kiro（企业强制流程）

AWS 的 AI IDE，核心是把「写代码」强制拆成四步 `spec（需求规范）→ design（技术方案）→ tasks（任务拆解）→ implement（执行实现）`，**每步有 AI 辅助但不能跳步骤**（spec 没写完不能进 design，design 没确认不能生成 tasks）。价值：需求变更有记录、技术方案有审批、实现与需求可追溯。代价：流程重，小项目像在走过场。适合 20 人以上团队、有合规要求、需求-开发-测试全链路追溯。

---

## Superpowers（不是 SDD 工具，是工程纪律框架）

Jesse 做的 agentic skills 框架，范围**比 SDD 宽得多**：brainstorm → spec → plan → TDD → subagent → 两阶段 review → debugging。它把 SDD 当成内部的一个 Skill，外面还套着 TDD、review、debugging 一圈别的 Skill。

> **Spec-Kit 和 OpenSpec 是「做 SDD 的工具」；Superpowers 是「管 agent 纪律的框架」，SDD 只是它的一部分。** 能不能一起用？能但要小心：Superpowers 内置的 `writing-specs` 跟 Spec-Kit 重复，**选一个用**。

---

## 三种模式的六维本质区别（核心对比表）

| 维度 | Spec-Kit 自动化 | OpenSpec 手动控制 | 轻量手工 |
| --- | --- | --- | --- |
| **全局视角在谁手里** | AI 同时拥有全局（拆任务）+ 局部（执行），但它的全局是从 spec 推断的，**失真严重** | 全局永远在你手里，AI 只在局部工作 | 同左 |
| **AI 误差放大** | **两轮推断叠加，误差相乘**：拆任务对 80% × 执行对 80% = 最终只有 **64%** 接近你真正想要的 | 只有一轮推断（拆任务由你做），质量上限 = AI 单次执行质量 | 同左 |
| **任务粒度** | 由 AI 决定，**通常偏大**，AI 在大任务里更容易凑合、跳过、幻觉 | 由你决定，按功能切，大小适中 | **最小**：一个函数 / 类 / 几十行 |
| **发现问题的时机** | 最后 review 整体代码时才发现，**回溯成本非常大** | 每个任务执行完立刻 review，**错误不累积，代价线性** | 每段几十行就 review，**纠错成本最低** |
| **工程师角色** | 更像**产品经理**（前期写 spec + 后期 review） | 更像**团队 leader**（拆→给→review→改，贯穿全程） | **就是工程师本人，只把「敲键盘」外包了** |
| **对能力要求** | 相对低，核心是 **spec 写作能力** | 高，需要完整工程感 | **最高，且不能藏拙**，没有工具补位 |

> 三种模式服务不同水平的工程师：**新手用自动化模式更顺**（AI 帮你补还没建立的判断）；**中级用手动控制更稳**；**资深在熟悉的项目上用轻量手工效率最高**（你的判断 AI 替代不了，工具反而拖后腿）。

---

## 选型：三套互补框架

**① 按团队人数（Robert，最简）**：≤3 人 → CLAUDE.md + Skills 完全够；3–15 人 → 加 Spec-Kit 解决规范同步；>15 人 → 才考虑 Kiro。**人少用重工具，大量时间消耗在走流程上，得不偿失。**

**② 按 greenfield/brownfield + 规模 + 周期（决策树）**：

- greenfield 且规模中大 → Spec-Kit；greenfield 且规模小 → **不用 SDD，直接 Claude Code + 提示词**
- brownfield 且增量改 → OpenSpec；brownfield 且要大重构 → Spec-Kit（**重构当作新项目处理**）
- 长期项目（半年+）→ Spec-Kit；短期（几周内）→ OpenSpec
- 严格合规 / 跨语言异构 → Spec-Kit；**个人小工具 → 两个都不推荐**
- 老项目改造 / 开源贡献 → OpenSpec delta spec（「你不是在写未来，是在改过去」）

> 作者立场：**先选 Spec-Kit 学 SDD 范式，再切 OpenSpec 体验增量风格**。Spec-Kit 的强制流程是最好的方法论训练场。

**③ 按工程师水平 × 项目熟悉度**：新手 → 自动化模式；中级 → 手动控制；资深 + 熟悉项目 → 轻量手工。

---

## 混合使用与输出量级

- **混合**：主体开发用 Spec-Kit（大颗粒度 greenfield），增量阶段切手动提示词（1–3 文件改动）；团队场景下 Spec-Kit 的 `tasks.md` 作对齐契约，关键任务手动盯、次要任务让 AI 批量跑。
- **输出量级**：同样一个功能，Spec-Kit 可能产出 **800 行**规格，OpenSpec 约 **250 行**，review 负担小很多。Spec-Kit 完整 artifact 总量上千行，OpenSpec 每个 change 是一份小 delta，约 **3 倍差距**。

---

## 本篇验收

- [ ] 能说出四套流程各自的步骤与适用场景  
- [ ] 知道 Spec-Kit 6+3 命令里 `analyze` 为什么不能省  
- [ ] 能解释 OpenSpec 的 delta spec 三个 marker  
- [ ] 理解「误差相乘 64%」为什么是自动化模式的代价  
- [ ] 能用三套框架里的任意一套给当前项目选型  

上一篇：[05 验收](/ai/sdd/05-acceptance/)｜下一篇：[07 模板与提示词](/ai/sdd/07-templates/)
