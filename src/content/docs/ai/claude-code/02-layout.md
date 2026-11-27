---
title: 02 输入层
description: 进 Session 的可控材料——说明、策略、Output style、历史、memory 与加载开关
---

每次 Session 开始，模型面对的是**空的 Context 窗口**。  
能跨会话留下来的，不是「它记得你」，而是你（和它）写进盘里的材料——说明文件、策略 JSON、历史轨迹、自动笔记。

**输入层**就是这些材料：决定「永远知道什么、能干什么、怎么答、这次带着哪些历史」。  
它不是 Terminal / IDE 壳（接入层），也不是跑在本机还是云上（执行落点）。

材料：[Memory](https://code.claude.com/docs/en/memory)、[Settings](https://code.claude.com/docs/en/settings)、[Output styles](https://code.claude.com/docs/en/output-styles)、[Sessions](https://code.claude.com/docs/en/sessions)、[Permissions](https://code.claude.com/docs/en/permissions)。

![输入层：进 Session 的材料](/ai/claude-code/02-input-layer.svg)

---

## 1. 一览：有什么、何时进 Context

| 材料 | 作用 | 何时进 Context |
| --- | --- | --- |
| **任务 / 提问** | 当前 turn 的意图（含打断、改向） | 当前 turn |
| **CLAUDE.md** / **AGENTS.md** | 你写的持久说明 | Session 启动；子目录按需 |
| **rules** | 按主题 / 路径拆开的说明 | 无 `paths`：启动；有 `paths`：读写匹配文件时 |
| **Settings** | 权限、模型、hooks、注入开关等 | 启动时按优先级合并 |
| **Output style** | 语气 / 角色 / 回复格式 | 启动或切换后，对后续回复生效 |
| **transcript** | 本次 Session 消息链 | resume / 同 Session 延续 |
| **Auto memory** | Claude 自己记的笔记 | 启动加载 `MEMORY.md` 索引（有体积上限） |
| **Skills 定义** | 可复用工作流说明书 | **目录先在**；正文按需或 `/name` |
| **授权 / 权限模式** | 约束 Gate，不全是正文 | 影响能不能执行 |
| **加载面开关** | `--bare`、env 等 | 决定哪些材料根本不加载 |

说明文件是 **context，不是强制配置**——「永远别碰 `.env`」写在 md 里只是请求；要拦死用 Hook。

---

## 2. 你写的说明：CLAUDE.md · AGENTS.md · rules

### CLAUDE.md

写你会反复解释的事：构建命令、约定、架构、工作流。适合具体到可验证的路径与命令；少写空话。单文件尽量控制在 **200 行以内**，太长就拆 rules / Skill。

| 范围 | 路径 |
| --- | --- |
| Managed | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`；Linux `/etc/claude-code/CLAUDE.md`；Windows `C:\Program Files\ClaudeCode\CLAUDE.md` |
| 用户 | `~/.claude/CLAUDE.md` |
| 项目 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md`（建议进 git） |
| 本机项目 | `./CLAUDE.local.md`（gitignore） |

父目录启动加载；**子目录**按需。日常维护：同一错误第二次出现、评审里发现「本该知道」、每 session 都在口头纠正 → **写进文件**。

```text
/init                          # 扫仓库生成起步版；已有则给改进建议
CLAUDE_CODE_NEW_INIT=1 /init   # 可交互选 CLAUDE.md / skills / hooks
/context all  或  /memory      # 核对是否加载
/doctor prompt-audit           # 审冲突 / 过期
```

**`@` 导入**其它文件（相对「含 import 的那个文件」；代码块里不导入；约 4 跳）：

```md
See @README for project overview and @package.json for npm scripts.
```

上下文将满会 compaction。可在 CLAUDE.md 加 **Compact instructions**，约定摘要时必须保留目标、路径、测试结果与决策；单次也可用 `/compact focus on …`。

### AGENTS.md

仓库若已有给其它 coding agent 的 `AGENTS.md`，不必先抄成 CLAUDE.md。

| 仓库情况 | 默认读什么 |
| --- | --- |
| 只有 `AGENTS.md` | 读它 |
| 同时有 CLAUDE.md | **只读 CLAUDE.md** |
| CLAUDE.md 里 `@AGENTS.md` | 两者都带上（推荐） |

也可用 `/config` → **Project instructions** 改策略（如 `claude-md-and-agents-md`）。直读 AGENTS.md 需较新版本；不稳时用 `@` 导入最稳。

### rules（`.claude/rules/`）

按主题拆多个 `.md`，避免巨型 CLAUDE.md。用户级：`~/.claude/rules/`。`.md` 递归发现。

```md
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules
- All API endpoints must include input validation
```

无 `paths`：启动加载。有 `paths`：读写匹配文件时才加载。

---

## 3. 策略与气质：Settings · Output style · 授权

### Settings（`settings.json`）

**策略面**：权限、默认模型、hooks、sandbox、Output style、产品注入开关。严格 JSON（无注释、无尾逗号）。

| 范围 | 文件 |
| --- | --- |
| 用户 | `~/.claude/settings.json` |
| 项目 | `.claude/settings.json`（建议进 git） |
| 本机项目 | `.claude/settings.local.json` |
| Managed / CLI | 组织下发；`claude --settings …` |

优先级（高 → 低）：**Managed → CLI → Project local → Project → User**。多数列表（如 `permissions.allow`）跨文件**合并**。

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "model": "claude-sonnet-5",
  "outputStyle": "Explanatory",
  "permissions": {
    "allow": ["Bash(git diff *)", "Bash(npm run lint)"],
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  },
  "includeGitInstructions": false
}
```

| | Settings | CLAUDE.md |
| --- | --- | --- |
| 形态 | JSON 策略 | Markdown 说明 |
| 典型 | 免问跑 lint、关 git 注入 | 「我们用 pnpm」 |

### Output style

管 **怎么答**（语气、角色、篇幅、格式），不是项目事实。与 CLAUDE.md 正交。

- 会话：`/output-style concise`，或 `/config`  
- Settings：`"outputStyle": "Explanatory"`（大小写敏感；内置如 `Proactive`、`Concise`、`Explanatory`、`Learning`）  
- 自定义：`~/.claude/output-styles/<name>.md` 或 `.claude/output-styles/`；终端里新增后通常要**重启**会话  

### 授权与权限模式

`Shift+Tab` 循环模式（也可 `permissions.defaultMode` / CLI）：

| 模式 | 概要 |
| --- | --- |
| Auto | 分类器拦高风险，少打断 |
| Manual（default 类） | 编辑 / 命令多先问 |
| Accept edits | 文件编辑少问 |
| Plan | 先探查出方案，不直接改源码 |

细规则仍用 Settings 的 `allow` / `ask` / `deny`。「信任这个文件夹」影响 hooks、部分项目 settings 是否真正生效。

---

## 4. 历史与记忆：transcript · Auto memory

**transcript** = Session 落盘消息链（输入、回复、工具调用与结果）。  
默认：`~/.claude/projects/<project>/<session-id>.jsonl`

- **resume / `--continue`**：同一 Session 续写  
- **fork / `/branch`**：拷历史到新 ID（不带走原 Session 的 file checkpoints）  

```bash
claude --continue
claude --resume
claude --resume <name-or-id>
claude --continue --fork-session
```

**Auto memory** 是 Claude **自己写**的跨 Session 笔记（你纠正、偏好等）。默认：

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md   # 启动约前 200 行或 25KB
└── *.md
```

开关：`/memory`，或 `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`。要进 CLAUDE.md 就明确说或自己编辑——别指望「remember」自动改说明书。

---

## 5. Skills 定义（输入侧）

定义落在输入层；**正文何时进 Context** 是扩展时机问题。

| 范围 | 路径 |
| --- | --- |
| 用户 | `~/.claude/skills/<name>/SKILL.md` |
| 项目 | `.claude/skills/<name>/SKILL.md` |

`description` 影响是否被自动选用；目录名或 `name` 对应 `/` 命令。`disable-model-invocation: true` 可让描述也不进 Context，直到你手动 `/`。

---

## 6. 加载面：剪掉 / 收窄输入

比改单个文件更粗——控制「哪些材料根本不进这次 Session」。

```bash
# CI / 脚本：跳过 hooks、skills、plugins、MCP、auto memory、CLAUDE.md 等
claude --bare -p "Summarize README.md" --allowedTools "Read"

# 只加载指定 settings 源
claude --setting-sources user,project

# 额外目录可访问文件；默认不加载其 CLAUDE.md
CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1 claude --add-dir ../shared-config
```

| 变量 | 作用 |
| --- | --- |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS=1` | 不加载各层 CLAUDE.md |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1` | 关 auto memory |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` | 关内置 git 说明 |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS=1` | 关附件类注入 |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` | `--add-dir` 也加载说明 |
| `CLAUDE_CODE_NEW_INIT=1` | 增强 `/init` |

也可写在 settings 的 `env` 块。

---

## 7. 落盘速查

**`~/.claude/`**：`settings.json` · `CLAUDE.md` / `rules/` · `output-styles/` · `skills/` · `projects/<project>/*.jsonl` · `projects/<project>/memory/`

**项目树**：`CLAUDE.md` / `.claude/CLAUDE.md` · `AGENTS.md` · `CLAUDE.local.md` · `.claude/settings(.local).json` · `.claude/rules/` · `output-styles/` · `skills/`

---

## 8. 五个容易混的点

1. **CLAUDE.md vs Settings** — 说明 vs 策略；「用 pnpm」写 md，「免问跑 lint」写 JSON  
2. **CLAUDE.md vs Auto memory** — 你写的指令 vs Claude 自己记的笔记  
3. **CLAUDE.md vs Output style** — 项目事实 vs 整段 Session 的答法  
4. **CLAUDE.md vs Skills** — 启动必加载 vs 按需 / `/name`  
5. **说明 vs Hook** — md 是请求；要「每次必发生 / 必拦住」用 Hook  

能说出每类材料「写哪、何时进 Context」，并用 `/init`、`/memory`、`--bare` 收窄一次输入，这一篇就算过关。

---

## 9. 下一步

材料配齐后，看 Harness **主环怎么转**。

→ [01 分层全貌](/ai/claude-code/01-system/) · [03 Harness 层：主环](/ai/claude-code/03-loop/)
