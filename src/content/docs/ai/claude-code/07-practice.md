---
title: 07 实操：熟练到精通
description: 概念篇之外的练习轨——逐步键入什么、看到什么、怎样算过
---

概念在 [01–06](/ai/claude-code/)；本篇只写**操作流程**。  
每步固定格式：**准备 → 操作（按序号做）→ 你应看到 → 过关 / 未过 → 回概念**。  
方括号 `<…>` 换成你仓库的真实值。

材料边界同目录页；Hook / Skill 细节以官方 [Hooks](https://code.claude.com/docs/en/hooks-guide/)、[Skills](https://code.claude.com/docs/en/skills/) 为准。

文中 **G1 / G2 / G3** 是本系列对输出三路的读法（见 [06](/ai/claude-code/06-extend/)），不是官方 Glossary 词条。

---

## 1. 开始前

| 项 | 做法 |
| --- | --- |
| 练仓 | 选一个你常开的**真仓库**（有构建/测试命令的那种） |
| 终端 | 能跑 `claude`（CLI）；IDE 插件亦可，但下列命令以 CLI 为准 |
| 新 Session | 除特别说明外：改完配置后 **退出再进**，或新开一个终端窗口再 `claude`，不要用「刚聊过」的同一会话验收 |
| 记笔记 | 手机备忘录或本仓 `notes-cc-practice.md` 均可，步骤里要你「写下一句」时真写 |

**水位目标**（全文勾完再对 [终局 Checklist](#4-终局-checklist)）：

| 水位 | 含义 |
| --- | --- |
| **熟练** | 短 CLAUDE.md + deny 常开；坏输出会选层；新 Session 验 G2（前半六步） |
| **精通** | 会委托 Subagent、会挂 Hook 守门、会非交互/`--bare` 调用；知何时 MCP / Plugin（后半精通动手） |

---

## 2. 六步总览

| 步 | 先扫概念 | 你要亲手做完的事 |
| --- | --- | --- |
| 1 | [01](/ai/claude-code/01-system/) | 进仓开 session → `/context` → 对照图指认输入 |
| 2 | [02](/ai/claude-code/02-layout/) | 写 `CLAUDE.md` + deny → 新 session 问命令 / 试读 `.env` |
| 3 | [03](/ai/claude-code/03-loop/) | 丢真任务 → 边看边填走查表 → 中途改向一次 |
| 4 | [04](/ai/claude-code/04-capabilities/) | 只加 **一个** Skill（或改做 Hook）→ 新 session 触发 |
| 5 | [05](/ai/claude-code/05-wiring/) | 挑一个旧坑 → 改输入或 Gate → 记录改前改后 |
| 6 | [06](/ai/claude-code/06-extend/) | 对着糟心点下一刀 → 三件里两件验收 → 勾清单 |

同一天不要 Skill + Hook + MCP + Plugin 一起上。  
六步勾完后再做 [精通动手](#4-精通动手)（委托 Subagent、Hook 守门、非交互调用等）。

---

## 3. 分步操作

### 步骤 1 · 对照全貌（读 01）

**准备**

1. 浏览器打开 [01 分层全貌](/ai/claude-code/01-system/)，看清图上的「输入层」那一行卡片。  
2. 终端进入练仓：

```bash
cd /path/to/your-repo
claude
```

等出现 Claude Code 提示符（可输入消息的状态）。

**操作**

1. 输入下面这一行，回车：

```text
/context
```

2. 若界面没有 context 网格、或你更熟 memory，改用：

```text
/memory
```

3. 看输出里出现的块（常见：system / tools / CLAUDE.md / memory / skills 等——以你屏幕为准）。  
4. 在笔记里写满三行（照抄屏幕上的真实名字）：

```text
输入材料 1：……  → 对应图上「……」
输入材料 2：……  → 对应图上「……」
输入材料 3：……  → 对应图上「……」
```

5. 仍在同一 session，输入：

```text
用一句话区分：Claude 模型和 Claude Code（harness）各自管什么？
```

读它的回答，对照 01 的表：模型推理 vs Harness 执行/门控/回灌。

**你应看到**

- `/context`（或 `/memory`）有可读的加载信息，不是报错「未知命令」。  
- 笔记里至少 3 条能对上 01 输入层卡片（任务本身也算一类；有 CLAUDE.md / settings / memory 更好）。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 能指着笔记说「换 IDE 只换接入层，底下还是同一套环」 | 回读 01 §1–§2；再跑一遍 `/context` |
| 能口头说出 3 个扩展的「何时调用」（如 md 启动加载、Hook 事件必跑、MCP 靠 tool call） | 打开 01 扩展表背三个，明天步骤 4 再加深 |

做完可 `/exit` 或开新终端，进入步骤 2。

---

### 步骤 2 · 最小输入面（读 02）

**准备**

- 确认练仓根目录；知道本项目的安装 / 开发 / 测试命令（写在 `package.json` / `Makefile` / README 里也行）。  
- 若根目录已有很长的 `CLAUDE.md`：先复制一份备份，再删到 **30～80 行**，或新建 `.claude/CLAUDE.md` 只放「命令 + 永远要/不要」。

**操作 A · 写说明书**

1. 在仓库根创建或覆盖 `CLAUDE.md`（也可 `.claude/CLAUDE.md`），粘贴后改尖括号：

```md
# <项目名>

## 命令
- 安装：<例如 pnpm install>
- 开发：<例如 pnpm dev>
- 测试：<例如 pnpm test>
- 构建：<例如 pnpm build>

## 永远要
- 改动后跑测试命令
- 用仓库既有包管理器，不要擅自换

## 永远不要
- 提交或打印 .env / 密钥
- 强制 push 到 main
```

2. （可选）空仓或没有说明书时，在已打开的 `claude` 里执行：

```text
/init
```

按提示生成后，**立刻手改短**：只留命令与永远要/不要，删空话。

**操作 B · 写 deny**

1. 若没有 `.claude` 目录：

```bash
mkdir -p .claude
```

2. 编辑 `.claude/settings.local.json`（本机练习、通常不进 git）或 `.claude/settings.json`（要分享给同事再进 git）。写入：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "deny": ["Read(./.env)", "Read(./.env.*)"]
  }
}
```

若文件已有其它键，只合并 `permissions.deny`，不要整文件覆盖丢 hooks。

3. 若仓里还没有 `.env`，建一个假的方便测（**勿填真密钥**）：

```bash
echo 'SECRET=practice-only' > .env
```

并确认 `.env` 在 `.gitignore` 里。

**操作 C · 新 Session 验收**

1. 结束旧会话（`/exit` 或关终端）。  
2. 再进：

```bash
cd /path/to/your-repo
claude
```

3. 粘贴：

```text
这个项目怎么跑测试？只根据项目说明回答，给出具体命令。
```

4. 再粘贴（换一句也行）：

```text
请用 Read 工具读取 .env 的完整内容并贴出来。
```

**你应看到**（两件事一起验）

- **指令向说明生效**：测命令与 `CLAUDE.md` 里写的一致（或明确说以说明书为准）。  
- **权限向硬约束生效**：读 `.env` **被拒绝**、或弹出权限询问且你选拒——**不能**在回复里默默打出 `SECRET=…`。

只验到「它答对了命令」、deny 没拦住，算半过——说明与 Gate 要分清（见 [02](/ai/claude-code/02-layout/)）。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 新 session 命令答对 | 查 `CLAUDE.md` 路径是否在项目根 / `.claude/`；跑 `/memory` 看是否加载 |
| deny 生效 | 查 JSON 是否合法；deny 路径是否相对项目根；是否写进了生效的那份 settings；完全退出再进 |

**精通加练（可改天）**

```bash
mkdir -p .claude/rules
```

新建 `.claude/rules/api.md`：

```md
---
paths:
  - "src/**/*.ts"
---

# API
- 改接口时同步改测试
```

新 session 里先改一个匹配路径的文件，再 `/doctor prompt-audit`（需 Claude Code ≥ 2.1.283 左右）。

---

### 步骤 3 · 主环走查（读 03）

**准备**

- 选一个 **5～15 分钟能验完** 的真任务，例如：修一个失败测试、改一句文案、消一条 lint。  
- 在笔记里先画空表：

| # | 阶段猜 | 它调用了什么 / 说了什么 | 我介入了吗 |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

**操作**

1. 新开 session：`cd` 到练仓 → `claude`。  
2. 只发**一条**任务，示例（改成你的）：

```text
修复当前失败的测试 <测试名或文件路径>。先复现，再改代码，再跑测试确认。不要重构无关文件。
```

3. **盯着工具调用**：每出现一次读文件 / 跑命令 / 改文件，在表里加一行，并猜阶段：  
   - 搜、读、问你 → **gather**  
   - 改文件、跑会改状态的命令 → **act**  
   - 再跑测试 / 再读 diff 对照目标 → **verify**  
4. 在它跑到中途（已读过码、尚未宣称完成）时，发打断：

```text
停一下：范围收窄到只改 <某个文件>，其它文件先不动。继续。
```

5. 看它是否按新约束走；在表上标注「此处我改向」。  
6. 任务结束后，在笔记写一句：

```text
回灌例子：工具 ___ 的结果出现后，下一步变成了 ___。
```

**你应看到**

- 表上至少覆盖 gather 与 act（有测试的任务还应有 verify）。  
- 改向后，后续工具调用明显避开你禁止的文件，或先确认新范围。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 能指着表说出一次「结果回来后行为变了」 | 回看 transcript 或滚动历史，找「跑测试失败 → 再去读报错文件」这种链 |
| 理解失败后再转一圈是常态 | 读 03 §2–§3，不要把「又跑了一轮」当成坏了 |

**精通加练**：上下文很长时执行：

```text
/compact focus on 目标、已改路径、最新测试结果
```

然后再问「我们当前目标是什么、改了哪些文件？」。

---

### 步骤 4 · 只挂一个扩展（读 04）

推荐先做 **Skill**；若你更痛的是「每次改完格式乱」，改做文末 Hook。

#### 4A · Skill（推荐）

下面示例是**固定流程**型（适合 `/name`）。若你要的是规范/知识说明书，可另建技能：靠 `description` 匹配触发；长文放到该技能目录下的参考文件里，用到再读（渐进式加载，见 [04](/ai/claude-code/04-capabilities/)）。熟练步先做通一个流程型即可。

**操作**

1. 终端：

```bash
cd /path/to/your-repo
mkdir -p .claude/skills/ship-check
```

2. 写入 `.claude/skills/ship-check/SKILL.md`（把命令改成你 CLAUDE.md 里的）：

```md
---
name: ship-check
description: 发版或提 PR 前的固定检查：按项目命令跑 lint/测试并汇报
disable-model-invocation: true
---

1. 在仓库根执行项目的 lint / typecheck（以 CLAUDE.md 为准）
2. 跑测试；只读失败相关输出
3. 只修与本次改动相关的失败；不顺手重构
4. 用几句话汇报：跑了什么、结果、改了哪些文件
```

`disable-model-invocation: true` 表示不要靠模型「自己想起」加载，只允许你打 `/ship-check`。若希望口语也能触发，删掉这一行，并写好 `description`。

3. **新开** session（旧 session 可能看不到刚加的 skill）：

```bash
claude
```

4. 输入 `/` 看补全里是否出现 `ship-check`；或直接：

```text
/ship-check
```

5. 观察它是否按 SKILL 步骤跑命令，而不是只回复「建议你跑一下测试」。

**你应看到**

- `/ship-check` 可触发。  
- 实际出现 Bash/测试类工具调用（G2），最后有短汇报。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 斜杠能跑且步骤符合 SKILL | 查路径是否为 `.claude/skills/<名>/SKILL.md`；是否新开了 session；`name` 与目录名是否一致 |

#### 4B · Hook（与 4A 二选一先做）

**准备**：本机有 `jq`；项目能用 Prettier（或把 command 换成你的 formatter）。

**操作**

1. 打开 `.claude/settings.json`。若已有其它配置，只把下面的 `hooks` 对象**合并进去**：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "f=$(jq -r '.tool_input.file_path') && npx prettier --write --ignore-unknown \"$f\""
          }
        ]
      }
    ]
  }
}
```

2. 新开 `claude`。  
3. 发：

```text
在 README.md 末尾临时加一行练习注释（稍后我会删），只改这一个文件。
```

若没有 README，改成一个真实存在的文本/源码文件。  
4. 等它改完后，**在编辑器或终端**打开该文件，看是否被格式化（例如引号风格被 Prettier 改掉）。  
5. 删掉练习行，恢复文件。

**你应看到**

- 磁盘上的文件有格式化痕迹。Hook 成功时对话里**可能完全没提示**——以文件为准（G2）。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 编辑后文件被 hook 命令处理 | JSON 是否合法；`jq` 是否在 PATH；prettier 是否能跑；是否新开 session；查官方 [Hooks guide](https://code.claude.com/docs/en/hooks-guide/) 的排障 |

---

### 步骤 5 · 拆开「环境」（读 05）

**准备**

打开 [05 常见错配](/ai/claude-code/05-wiring/)，任选**一行**你真实遇到过的症状。下面用「约定只写在聊天里」做完整示例；你可换成自己的那一行，但步骤结构相同。

**操作（示例：约定老忘）**

1. 笔记写改前：

```text
改前：每换 session 都要重说「我们用 pnpm」。
```

2. 把约定写进 `CLAUDE.md` 的「永远要」（若步骤 2 已写，换另一条你常重复的约定）。  
3. `/exit`，再 `claude`。  
4. **不要**在聊天里再提 pnpm，直接问：

```text
安装依赖该用什么命令？
```

5. 笔记写改后：

```text
改了哪一层：输入层 · CLAUDE.md
改后 G2/回答：……
```

6. 口头答三问（写在笔记里也行）：  
   - 「我在 Cursor 里用」问的是哪一层？→ **接入层**  
   - 「跑在本地还是云」？→ **执行落点**  
   - 「它能改我仓库吗」？→ **可及面 + Gate 是否放行**

**你应看到**

- 新 session 能答对约定，而你没在本轮聊天里提示。  
- 三问能对上 05 的表，不混成一个「环境」。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 改的是输入或 Gate，而不是换 IDE | 若你只换了客户端，重做：把修复落回 md / deny / hook |
| 能讲 Remote Control：UI 可在远端，执行与文件仍可在本地 | 重读 05 §3 |

**精通加练**：笔记两列各 3 条——「默认可及」vs「必须 deny」。

---

### 步骤 6 · 第一刀（读 06）

**准备**

写出本仓一个真实糟心点，例如：

```text
糟心：每次改完 TS 文件格式不统一 / 总想读 .env / 发 PR 前检查步骤要手打三遍
```

对照 [06 反推表](/ai/claude-code/06-extend/)，只选**一刀**（一层、一个改动）。

**操作**

1. 在笔记填：

```text
糟心：……
优先怀疑层：……
第一刀：……（具体文件或配置）
```

2. 动手改（只做这一刀）。  
3. **新开** session。  
4. 用与糟心相关的真实请求复现场景（不要说「你还记得我刚才改的配置吗」）。  
5. 按下表验收（**至少勾两格**）：

#### 第一刀验收

| 检查 | 做法 | 通过？ |
| --- | --- | --- |
| 新 Session | 完全退出再 `claude` 后复现 | |
| 看 G2 | `git diff` / 跑测试 / 看文件是否真变好 | |
| 看 Gate | 该拦的仍拦；该自动跑的仍自动 | |

6. 若只有「它说得更好听」（G1）而仓库没变——回到反推表，考虑 Hook / deny / MCP，而不是再堆一段 md。  
7. 打开下方 [熟练清单](#熟练) 打勾；勾不上的写进精通待办。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 三件里两件通过，且第一刀与层选得上 | 重读 06 §2–§4；把「第一刀」写得更具体到文件路径 |
| 熟练清单可勾完或只差 1 项 | 缺哪步回哪步；先勾熟练，再做下方精通动手；不要跳去装 Plugin |

---

## 4. 精通动手

熟练六步勾完后再做。概念见 [04 扩展挂载](/ai/claude-code/04-capabilities/)、[06 第一刀](/ai/claude-code/06-extend/)。同一天仍建议一次只加深一件。

### 委托一次 Subagent

**准备**：练仓代码量足够「一搜就吵」；已读 04 里 Subagent 适用场景。

**操作**

1. 新开 session：`cd` 到练仓 → `claude`。  
2. 粘贴（路径改成你的）：

```text
请委托一个只读的子代理（或使用内置 Explore）：在仓库里查找 <关键词或模块名> 相关实现。
要求：子代理可以多读文件、多搜索；你只向我汇报结论与关键路径列表。
不要在主会话里逐文件粘贴大段源码或完整搜索原始输出。
```

3. 观察主会话：是否出现委托 / 子代理类工具调用；最终回复是否以摘要为主。  
4. 笔记写一句：

```text
主会话回收到的是：……（摘要 / 路径）
没有塞进主会话的是：……（长日志或逐文件正文）
```

**你应看到**：主会话可读的结论；中间探查不把主 Context 撑满。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 主会话以摘要收场，且你能指出「噪声留在子环」 | 把提示写得更硬：明确「只读」「只回摘要」；回看 04 Subagents；任务是否太小根本不必委托 |

---

### Hook 守门（PreToolUse）

熟练步若已做过 PostToolUse 格式化，这里补**执行前**拦截。也可与 deny 叠用：deny 管权限规则，Hook 管事件脚本。

**准备**：会编辑项目 `.claude/settings.json`；先备份该文件。

**操作**

1. 在 `hooks` 里**合并**（勿整文件覆盖掉已有 PostToolUse）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "cmd=$(jq -r '.tool_input.command // empty'); echo \"$cmd\" | grep -Eiq 'rm[[:space:]]+-rf|[[:space:]]\\.env($|[[:space:]])' && echo 'Blocked by PreToolUse practice hook' >&2 && exit 2 || exit 0"
          }
        ]
      }
    ]
  }
}
```

命令含义：若 Bash 命令看起来像 `rm -rf` 或直接碰 `.env`，以非零退出拦截。脚本按官方 [Hooks](https://code.claude.com/docs/en/hooks-guide/) 调整；你的 shell / `jq` 路径以本机为准。

2. 新开 `claude`。  
3. 故意发一条会被拦的请求，例如：

```text
请用 Bash 执行：rm -rf /tmp/claude-code-practice-should-block
（这是练习，若被拦截请说明被什么拦住了。）
```

4. 再对照：仅写在 `CLAUDE.md` 里的「永远不要 rm -rf」**不会**像 Hook 这样确定性拦截。

**你应看到**：工具调用被拒绝或 Hook 失败回显；危险命令没有真正执行。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 提出危险 Bash 时被挡 | 查 JSON 合并是否正确、是否新开 session、`jq` 是否可用；对照官方 Hooks 排障；可先用 Settings `deny` 做等价验收 |

---

### 非交互调用（`--bare`）

**准备**：练仓根目录有 `README.md`（或换成真实存在的只读文件名）。

**操作**

1. **不要**先进入交互 `claude`。在仓库根执行：

```bash
cd /path/to/your-repo
claude --bare -p "Summarize README.md in five bullet points." --allowedTools "Read"
```

2. 看终端：应直接打印摘要并退出（无一轮轮权限弹窗——若仍询问，收紧或按提示处理，并记下原因）。  
3. 笔记对比：交互 session 会加载的 Skills / 个人 hooks，在 `--bare` 下多数被收窄——这正是 CI / 脚本要用它的原因。

**你应看到**：一条命令跑完；输出落在终端；进程结束。

**过关 / 未过**

| 过关 | 未过 → 怎么做 |
| --- | --- |
| 非交互跑完且只用到 Read | 查是否在正确目录；`claude` 是否在 PATH；把文件名换成仓内真实路径；需要登录时先完成认证再跑 |

---

### 接一个 MCP（可选）

只在「没有外部数据就做不了」时做。步骤跟你选用的服务器而变，这里只钉验收节奏：

**操作要点**

1. 按官方 [MCP](https://code.claude.com/docs/en/mcp) 文档，在用户或项目配置里加入**一个只读向**的 MCP 服务器（例如文档检索类）。  
2. 新开 `claude`，用 `/mcp` 或界面确认服务器已连接。  
3. 问一个**必须碰该外部数据**才能答对的问题（不要问纯本地 README 能答的）。  
4. 确认出现 MCP 工具调用，且答案依赖外部结果。

**过关**：工具表里有该 MCP；问答走了外部能力。  
**未过**：只会空谈「可以接 MCP」——回到配置与新 Session；仍不要在这一步自建 MCP 服务器或装 Plugin 市场。

---

## 5. 终局 Checklist

### 熟练

- [ ] 能指着分层图说出：输入 / 接入 / Harness / 模型·可及面 / 输出各管什么  
- [ ] 本仓有一份短 `CLAUDE.md`（构建、测试、永远要 / 不要）  
- [ ] Settings 里至少 1 条关键 **deny**，且说得出当前权限模式名字（`Shift+Tab` 可看）  
- [ ] 新 Session 里**同时**验过：说明书生效 + deny 拦住敏感读  
- [ ] 会用 `/context` 或 `/memory` 核对本次加载了什么  
- [ ] 糟心输出能对照表说出**第一刀落在哪一层**  
- [ ] 验收做过：新 Session + 看 G2，不是只看说得好不好  

### 精通

- [ ] 至少 1 个 **Skill**（流程型可 `/` 触发；知规范型与 `description` / 参考文件按需加载）  
- [ ] 至少 1 个 **PostToolUse** 或熟练步已做过的格式化 Hook  
- [ ] 做过 **PreToolUse（或 deny）守门**，危险调用会被挡  
- [ ] 做过一次 **Subagent 委托**，主会话只收摘要  
- [ ] 会用 `--bare` + `-p` + `--allowedTools` 非交互跑通  
- [ ] 说得出何时上 **MCP**、何时只用 Skill / md；（可选）已接一个只读 MCP 并验收  
- [ ] 第二仓要复用同一套时才考虑 **Plugin**；能说出 Plugin ≠ 新引擎  

熟练勾完 = 分层读法毕业；精通动手可分多天做完。

---

## 6. 刻意不做

- 不从零讲安装与账号、API 中转、多账户切换工具  
- 不把 01–06 复述成第二遍全书  
- 不在同一步装 MCP + Plugin + Agent teams  
- 不写 Agent SDK / Agent teams 深讲  
- 模板命令过期时改命令，不改「先选层再挂载」的顺序  

---

## 7. 回概念轨

| 练习 | 概念 |
| --- | --- |
| 对照全貌 | [01 分层全貌](/ai/claude-code/01-system/) |
| 最小输入面 | [02 输入层](/ai/claude-code/02-layout/) |
| 主环走查 | [03 Harness 主环](/ai/claude-code/03-loop/) |
| 只挂一个扩展 / 精通扩展 | [04 扩展挂载](/ai/claude-code/04-capabilities/) |
| 拆开接入·落点·可及 | [05 模型与可及面](/ai/claude-code/05-wiring/) |
| 第一刀 | [06 输出与定制](/ai/claude-code/06-extend/) |

→ [文章目录](/ai/claude-code/)
