---
title: 07 提示词手册：接手理解专用
description: 可复制提示词——画图、全景、接口模型、CLAUDE.md、Skill、一键摸清
---

本页只收**接手理解**阶段可直接粘贴的提示词。  
方法与坑见对应正文；方括号 `[...]` 换成你仓库的真实值。

| 阶段 | 正文 |
| --- | --- |
| 画图能力 / 四类图 | [02](/ai/legacy-project/02-repo-map/) |
| 三张全景 | [03](/ai/legacy-project/03-main-path/) |
| 接口与模型 | [04](/ai/legacy-project/04-modules/) |
| CLAUDE.md / Skill | [05](/ai/legacy-project/05-relations/) |
| 串跑与验收 | [06](/ai/legacy-project/06-change-entry/) |

赶时间：直接用文末 [一键摸清](#一键摸清)。

---

## 画图验证

```text
画个最简单的用户登录流程图，保存到当前目录。
```

```text
帮我画一张项目架构图
```

---

## 四类图

### 架构图（通用）

```text
帮我画一张这个项目的架构图。前端、后端、数据库、外部服务分层画出来。
每个模块写名字加一句话职责。别画实现细节，服务级就够了。
周边基础设施用一个方框概括。保存成 ./docs/architecture.svg。
```

### 模块依赖图

```text
看一下我的 pom.xml，画一张项目内部模块之间的依赖图。
外部库不画。有循环依赖用红色标出来。
保存成 ./docs/module-deps.svg。
```

非 Java 把第一句换成：`go.mod` / `package.json` workspaces / `Cargo.toml` workspace。

### 时序图

```text
帮我画 POST /api/<path> 这个接口的调用链时序图。
先去 grep 真实代码，从 Controller 一路追到 DB。
标清楚每一步是哪个类哪个方法，保存成 ./docs/sequence-<name>.svg。
```

### ER / Schema 图

```text
看项目里的建表 SQL（db/migration 或 resources 里），画一张 ER 图。
主键、外键、表之间的关系标清楚。保存成 ./docs/schema.svg。
```

### 迭代补丁（接在已有图后面）

```text
把 XX 模块展开再画一张
```

```text
把 OpenTelemetry trace 链路补上
```

```text
放大 Server 层，把子模块之间的调用关系画细一点
```

```text
数据库层加上表名
```

---

## 三张全景（推荐落盘版）

### 架构图

```text
读一下这个项目的 README 和顶层目录，给我画一张架构图。
前端、后端、数据库、中间件分层画，核心模块写一句话职责。
周边基础设施（日志、监控、配置）用一个方框概括就行，
不用展开。保存到 docs/architecture.svg。
```

### 模块依赖图

```text
看一下项目的 pom.xml，画一张内部模块依赖图。
只画项目自己的模块，外部库不画。有循环依赖用红色标出来。
保存到 docs/module-deps.svg。
```

### 外部依赖图

```text
综合看 pom.xml、application.yml 和 README，帮我梳理这个项目。
对外依赖了什么，分成三类：关键语言/框架依赖、中间件、外部 API。
画出来，每类用不同颜色。保存到 docs/external-deps.svg。
```

### 补中间件

```text
去读 application.yml 和 application-*.yml，看项目连了什么中间件
```

---

## 接口与数据模型

### REST 清单

```text
扫一下这个项目里所有的 Controller（或路由层），给我整理一份 REST 接口清单。
每个接口列出方法、路径、一句话说明、主要入参、返回结构。
按模块分组。对外接口和内部接口分开标注。
保存到 docs/api-list.md。
```

### 防漏扫

```text
项目是多模块的，每个可能有 Controller 的子模块都要扫
```

```text
你扫了几个模块？有没有漏？
```

### 数据模型 + ER

```text
看项目的 entity 类、DTO、数据库建表 SQL，给我梳理核心数据模型。
每个模型列出字段、类型、一句话说明。标出主键、外键、枚举值。
关键模型之间的关系画一张简单的 ER 图。
以 DB 层为准；entity 和 DTO 分开说，不要默认一一对应。
保存到 docs/data-model.md 和 docs/data-model-er.svg。
```

### 互校

```text
对照 docs/api-list.md 和 docs/data-model.md，
看接口里提到的每个实体在数据模型里是不是都有定义。
有不一致的地方列出来。
然后验证不一致的地方并修复。
```

---

## CLAUDE.md

### 初稿

```text
读 docs/ 下的所有资产，给我生成一份 CLAUDE.md 初稿。
精简：项目定位、核心架构、关键模块、关键约定、怎么跑，
外加两节空着的：禁区、历史包袱。
架构图、接口清单、数据模型的详细内容不要复制进来，
用链接指向 docs/ 就好。保存到项目根目录的 CLAUDE.md。
```

### 压缩 / 留白

```text
这一段太长了，压成一句话+链接
```

```text
禁区和历史包袱这两节留给我自己写，别帮我猜
```

---

## Skill

### 挖候选

```text
扫一下当前项目（包括 git log、CLAUDE.md、docs/、README、CONTRIBUTING、.github/），
找出团队反复在做的操作流程。
判断标准是三特征：可复制、可参数化、可自动化。三个都满足才算候选。

列出每个：流程名、为什么反复、可参数化部分、起点和终点。
最后用表格总结。
```

### Top 3

```text
从上面的清单里挑 3 个最高优先级的，给我做成候选 SKILL。
每个写：name（英文）、description、预期 steps、allowed-tools。
优先级：频率高、痛点深、自动化收益大。用表格总结。
```

### 生成 docs-auto-sync

```text
基于上面的候选，给我生成完整的 SKILL.md。要求：
- 名字 docs-auto-sync
- description 写清触发场景和产出
- steps 清晰可执行
- allowed-tools 限制到最小（建议只读：Read, Grep）
- 只汇报不一致，不要自动改文件，让人决定怎么处理
保存到 .claude/skills/docs-auto-sync/SKILL.md。
```

### 触发验证

```text
我刚改完一批 Controller，帮我看看文档还对不对得上
```

```text
帮我检查一下这段代码
```

（上一句应触发 docs-auto-sync；下一句不应误触发。）

---

## 一键摸清

```text
我刚 clone 了 [项目名]。现在帮我完整摸清这个项目，
产出一整套 AI 协作基础设施。整个过程你自主推进，遇到问题自己修、
自己 review、自己决定下一步，不要每一步都问我。

请按以下顺序执行：

第一步：画三张全景图，保存到 docs/
- architecture.svg（分层架构图，核心模块写一句话职责）
- module-deps.svg（内部模块依赖，循环依赖红色标出）
- external-deps.svg（语言/框架依赖 + 中间件 + 外部 API 三类）

第二步：梳理接口和数据模型
- docs/api-list.md（REST 接口清单，按模块分组，对外/内部区分）
- docs/data-model.md 和 docs/data-model-er.svg（以 DB 层为准）

第三步：对照以上两份，列出不一致的地方并修正，直到自洽

第四步：基于 docs/ 下的所有产出，生成项目根目录的 CLAUDE.md
- 前五节（项目定位、核心架构、关键模块、关键约定、怎么跑）基于 docs/ 生成
- 禁区和历史包袱两节留空，写「待补充」占位
- 整体控制在 300 行以内，不要把 docs/ 的内容复制进来

第五步：挖出最高优先级的一个 SKILL，生成完整 SKILL.md
- 优先选「技术文档自动更新」（docs-auto-sync）
- 保存到 .claude/skills/docs-auto-sync/SKILL.md
- 只读不写（allowed-tools: Read, Grep），不自动修正，只报告

自主原则：
- 每一步跑完自己 review，不合格自己重跑
- 图有漏/错/不清就主动补或重画
- 多模块、前后端分离等项目细节自己处理
- 全部跑完后给 summary：每个产出文件、内容概括、仍需人工确认的点

不要打断来问我。判断不清先做合理选择，在 summary 里标记。跑完再汇报。
```

用法与验收：[06 一键摸清](/ai/legacy-project/06-change-entry/)
