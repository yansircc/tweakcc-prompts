<!--
name: 'Tool Description: Bash'
description: 'Description for the Bash tool, which allows Claude to run shell commands'
ccVersion: 2.0.25
variables:
  - CUSTOM_TIMEOUT_MS
  - MAX_TIMEOUT_MS
  - MAX_OUTPUT_CHARS
  - BASH_TOOL_NAME
  - BASH_TOOL_EXTRA_NOTES
  - SEARCH_TOOL_NAME
  - GREP_TOOL_NAME
  - READ_TOOL_NAME
  - EDIT_TOOL_NAME
  - WRITE_TOOL_NAME
  - GIT_COMMIT_AND_PR_CREATION_INSTRUCTION
-->
持久 shell 会话执行命令。仅用于终端操作（git/npm/docker），文件操作用专用工具。

规则：
- 含空格路径加双引号：cd "/path with spaces"
- 创建目录前先 ls 验证父目录存在
- 超时：默认 ${MAX_TIMEOUT_MS()/60000} 分钟，最长 ${CUSTOM_TIMEOUT_MS()/60000} 分钟
- 输出超 ${MAX_OUTPUT_CHARS()} 字符会截断
- run_in_background 参数可后台运行
${BASH_TOOL_EXTRA_NOTES()}
**工具选择策略**（优先 MCP 工具，其次专用工具，最后 shell）：

| 场景 | 首选 | 备选 |
|------|------|------|
| 项目概览 | mcp__batch-tools__project_scan | tokei + fd |
| 批量读取 (>3 文件) | mcp__batch-tools__batch_read | cat/head + xargs |
| 批量替换 | mcp__batch-tools__batch_edit | sed -i + fd |
| 单文件读取 | ${READ_TOOL_NAME} | - |
| 单文件编辑 | ${EDIT_TOOL_NAME} | - |

**MCP 工具优势**：结构化输入输出、支持 dry_run 预览、内置错误处理

**Shell 批量操作**（MCP 不可用时的备选）：
- 批量读取: fd -e ts \| head -20 \| xargs -I{} sh -c 'echo === {} === && head -30 {}'
- 批量替换: fd -e ts \| xargs sed -i '' 's/from "old"/from "new"/g'
- 并行处理: fd -e ts \| xargs -P 8 -I{} prettier --write {}

**批量重命名**（使用 Perl rename，表达能力最强）：

安装: brew install rename

| 场景 | 命令 |
|------|------|
| 预览模式 | rename -n 's/old/new/' files (-n = dry run，必须先预览) |
| 扩展名修改 | fd -e js \| xargs rename 's/\.js$/.ts/' |
| 添加前缀 | fd -e ts \| xargs rename 's/^/prefix_/' |
| 添加后缀 | fd -e ts \| xargs rename 's/(\.\w+)$/_suffix$1/' |
| 驼峰转 kebab | fd -e ts \| xargs rename 's/([a-z])([A-Z])/$1-\l$2/g' |
| kebab 转驼峰 | fd -e ts \| xargs rename 's/-([a-z])/\u$1/g' |
| 蛇形转驼峰 | fd -e ts \| xargs rename 's/_([a-z])/\u$1/g' |
| 全部小写 | fd -e ts \| xargs rename 'y/A-Z/a-z/' |
| 删除空格 | fd \| xargs rename 's/ /_/g' |

Perl 替换修饰符：
- \l 下个字符小写，\u 下个字符大写
- \L...\E 区间小写，\U...\E 区间大写
- g 全局替换，i 忽略大小写

**必须使用的高性能工具**（禁止用原生命令）：

| 场景 | 必须用 | 禁止用 |
|------|--------|--------|
| 文件搜索 | fd -e ts --type f | find, Glob 工具 |
| 代码搜索 | sg -p 'pattern' --lang ts | grep（仅关键词时可用 Grep 工具） |
| JSON 处理 | jq '.key' | 手动解析 |
| 代码统计 | tokei | wc -l, cloc |
| 并行执行 | xargs -P 8 或 parallel | 串行循环 |

**输出限制**（减少 Token 消耗）：

| 命令 | 限制 | 示例 |
|------|------|------|
| fd | 最多 30 条 | fd -e ts \| head -30 |
| sg | 最多 20 条 | sg -p 'xxx' \| head -20 |
| git log | 最多 10 条 | git log -10 |
| git diff | 超 100 行先用 --stat | git diff --stat 预览 |
| 任意长输出 | 必须限制 | cmd \| head -N |

**结构化输出**（便于解析，禁止人类可读格式）：

| 场景 | 必须用 | 禁止用 |
|------|--------|--------|
| 文件列表 | fd --json \| jq -r '.[].path' | 纯文本列表 |
| git log | git log --format='%H\|%s' -10 | 默认格式 |
| git status | git status --porcelain | 默认格式 |
| 进程/端口 | lsof -i :PORT -t | lsof 默认 |

**批量合并**（减少工具调用）：
- 多个独立查询合并为一次调用
- 用 && 串联依赖命令
- 用绝对路径，避免 cd

**项目缓存**（避免重复扫描）：

首次探索项目时生成缓存：
- mkdir -p .claude-cache
- tokei --output json > .claude-cache/tokei.json
- fd --type f > .claude-cache/files.txt
- fd --type d > .claude-cache/dirs.txt

后续直接读取缓存：
- cat .claude-cache/files.txt | head -50
- jq '.[] | {lang: .name, code: .code}' .claude-cache/tokei.json

缓存存在时优先读取，不重复执行 tokei/fd 全量扫描。

${GIT_COMMIT_AND_PR_CREATION_INSTRUCTION()}
