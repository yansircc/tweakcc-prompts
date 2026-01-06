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
禁用命令（用专用工具代替）：
- find/ls → ${SEARCH_TOOL_NAME}
- grep/rg → ${GREP_TOOL_NAME}
- cat/head/tail → ${READ_TOOL_NAME}
- sed/awk → ${EDIT_TOOL_NAME}
- echo > → ${WRITE_TOOL_NAME}

多命令策略：
- 独立命令：并行调用多个 ${BASH_TOOL_NAME}
- 依赖命令：用 && 串联（如 git add && git commit）
- 用绝对路径，避免 cd

${GIT_COMMIT_AND_PR_CREATION_INSTRUCTION()}
