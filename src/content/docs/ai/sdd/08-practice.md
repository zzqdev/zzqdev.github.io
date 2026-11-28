---
title: 08 实践与常用命令
description: 把 SDD 端到端跑一遍（一句话需求 → 规格 → 实现 → 验收 → 沉淀），附 Claude Code / Spec-Kit / OpenSpec 常用命令速查
---

**结论：** 这一篇是动手轨——用一个完整模块把前七篇串起来跑一遍，再把每天要敲的命令收成速查表。流程固定后，把它编码成 Skill，下次一句话触发。

---

## 一次完整实践：加一个「模型提供商管理」模块

这是全链路课的第一个完整交付闭环，后面每个模块都复用它。

| 步 | 动作 | 模式 / 命令 | 验收 |
| --- | --- | --- | --- |
| 0 | 先亲自看现状（改系统时） | 跑起来用一遍 | 知道现有功能长什么样 |
| 1 | 想清楚：职责 / 数据模型 / 方案对比 | **咨询模式**：「先别写代码，梳理 XXX 并给 2-3 方案」 | 你拍板选定方案 |
| 2 | 定 / 补规范 | 写进 `CLAUDE.md`（统一 Result、错误码分段、DTO、跨模块走 Service） | 规范可追溯到决策 |
| 3 | 写规格 | 用 [07 feature spec 五节](/ai/sdd/07-templates/#feature-spec-五节spec-coding) | 含目标 / 非目标 / 接口契约 / 边界 / 验收 |
| 4 | review 规格 | 你自己读 | 改 5 分钟规范比改 5 小时代码省 |
| 5 | 按层拆解执行 | **执行模式**：Entity+Mapper → Service → Controller | 每步编译 / curl 通过再进下一步 |
| 6 | 前端对接 | mock 换真实 API | 浏览器能跑通 |
| 7 | 完整验收 | 全链路：浏览器 → Nginx → 后端 → SSE → 前端渲染 | curl 通 ≠ 用户能用；旧功能不回退 |
| 8 | 沉淀 | 把这条流程编码成 Skill | 下个模块一句话触发 |

第 5 步跨模块校验（如 Agent 引用 modelConfigId）必须**走 Service 接口、不直连他模块 Mapper**——这是模块化单体的生死线，也是规范里要钉死的一条。

---

## 常用命令速查

### Claude Code 内置

| 命令 / 操作 | 用途 |
| --- | --- |
| `/init` | 在新项目扫一遍代码、生成 `CLAUDE.md` 初稿 |
| `#` 开头输入 | 快速把一条约定追加进 memory / `CLAUDE.md` |
| `/memory` | 直接编辑 memory 文件 |
| `@文件名` | 在对话里引用某个文件作为上下文 |
| `!命令` | 不进对话、直接跑一条 bash |
| `/clear` | 清空上下文——开新任务前用，避免旧任务污染 |
| `/compact` | 压缩上下文——长会话保留要点继续 |
| `/model` | 切模型；生成与 review 用不同模型 → 双模型互补 |
| `/agents` | 管理 subagent（只读审计 / 高噪声 / 并行流水线） |
| `/review` | review 一个 GitHub PR |
| `/security-review` | 对改动做安全审查 |
| `shift + tab` | 切换 plan mode——先规划、确认后再执行 |

### Spec-Kit 工作流（团队 / greenfield 中大项目）

9 步标准流程：

```text
specify init        # 生成 .specify/ 工作区（含 memory/constitution.md）
/speckit.constitution  # 写项目宪法（非协商原则，只写一次，不许 AI 改）
/speckit.specify       # 需求 → spec（user story + acceptance criteria，~800 行）
/speckit.clarify       # 〔可选推荐〕AI 反过来问你 spec 里的模糊点
/speckit.plan          # spec + constitution → 技术方案（违反宪法的方案不采纳）
/speckit.tasks         # plan → 有序任务清单（按 user story 组织，标并行/依赖）
/speckit.analyze       # 〔强烈推荐〕跨 artifact 一致性检查，防 spec 漂移（只读）
/speckit.implement     # 按 tasks 逐个执行（推荐一个 task 一个 task 跑，方便审查）
review + commit        # 每个 task 完成后人工 review，人始终在 review 环节
```

环境：Specify CLI（Python 3.11+，推荐 `uv` 安装）。`/speckit.analyze` 是每个 user story 结束后的**硬性环节，不能省**——被跳过会导致 spec 跟代码漂移。

### OpenSpec 工作流（brownfield 增量 / 开源贡献）

```text
npm install -g @fission-ai/openspec   # Node 20.19+
openspec init                         # 扫描 .claude/.cursor 等已有配置自动预选

/opsx:propose <change-name>   # 写 proposal + design + tasks + delta spec
/opsx:explore                 # 先和 AI 讨论，不产工件
/opsx:apply                   # 按 tasks 执行（可从断点 resume）
/opsx:verify                  # archive 前一致性检查（CRITICAL/WARNING/SUGGESTION）
/opsx:archive                 # 归档，delta 合并到主 spec
/opsx:onboard                 # 把现有项目接入 OpenSpec
```

delta spec 用 `ADDED / MODIFIED / REMOVED Requirements` 三个 marker；spec 用 RFC 2119（MUST/SHOULD/MAY）+ Given/When/Then 写，方便直接转测试。

### 高频提示词习惯（不是斜杠命令，但天天用）

| 场景 | 怎么说 |
| --- | --- |
| 报错处理 | 把**报错 + 上下文**一起贴给 AI 让它定位——比只贴报错高效得多 |
| 防止抢跑 | 「不要写代码，先复述你理解的布局 / 链路，我确认后再动手」 |
| 要决策权 | 「给我 2-3 个方案对比，别替我拍板」 |
| 圈死改动 | 「只改 XXX；先跑旧用例确认没坏，再跑新用例」 |
| 补规范 | 「这次哪里跑偏了？是不是规范没覆盖？补一条进 CLAUDE.md，带原因」 |

---

## 把流程固化成 Skill

流程既然固定，就编码成 Skill，让 AI 以后自动按流程走（如 `module-delivery.md`，8 步，每步有「目标 / 产出物 / 流程 / 注意事项」）：

- 每步写清**产出 + 验证方式**，编译或验证通过再进下一步；
- 关键决策点标「**⚠️ 等待用户确认**」，不让 AI 自己拍板；
- 踩过的坑写成**注意事项**（如「JSON 字段需 `@TableName(autoResultMap=true)` + JacksonTypeHandler，否则反序列化为 null」）。

触发：「按模块交付 Skill 的流程，帮我做 Agent 模块」。

> Skill 和 CLAUDE.md 一样是**活文档**：SDD 闭环（定规范→执行→发现问题→迭代）在 Skill 上同样适用。做到第四五个模块，Skill 已覆盖绝大多数场景，AI 几乎不需要额外指导就能按你的标准交付。

目录结构：

```text
.claude/skills/
├── module-delivery.md
└── provider-adapter.md
```

---

## 进阶：给 AI 配一个「影响面分析」只读子代理

SDD 有个盲区：AI 不知道改动会影响哪些下游服务、不知道端用户 SLA（→ [09 局限](/ai/sdd/09-pitfalls/) 有真实事故）。解法是配一个 `impact-analyzer` 只读子代理：

- `tools: Read, Grep, Glob, Bash`、`permissionMode: plan`（只读不改）
- 挂载 `chain-knowledge`（链路拓扑 + SLA 约束）和 `recent-incidents` 两个 skill
- 分析五步：读改动文件 → **用 Grep 追调用链找所有 caller** → 检查集成点（HTTP / MQ / DB）→ 与链路知识交叉引用 → 评估 SLA 影响 → 输出 Impact Analysis Report

---

## 本篇验收

- [ ] 能照着 0–8 步把一个模块从需求跑到验收  
- [ ] 知道 `/clear` 与 `/compact` 各自何时用  
- [ ] 能默写 Spec-Kit 9 步，并说出 `analyze` 为什么不能省  
- [ ] 把一条固定流程沉淀成了 Skill  

上一篇：[07 模板与提示词](/ai/sdd/07-templates/)｜下一篇：[09 局限与踩坑](/ai/sdd/09-pitfalls/)
