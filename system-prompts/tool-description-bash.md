<!--
name: 'Tool Description: Bash'
description: 'Description for the Bash tool, which allows Claude to run shell commands'
ccVersion: 2.1.3
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
在持久 shell 会话中执行 bash 命令。

**重要**：此工具用于终端操作（git/npm/docker 等）。文件操作（读/写/编辑/搜索）用专用工具。

执行前：
1. **目录验证**：创建目录/文件前，先 \`ls\` 验证父目录存在
2. **引号处理**：含空格的路径用双引号
   - 正确：cd "/Users/name/My Documents"
   - 错误：cd /Users/name/My Documents

用法：
- 可选超时：最长 ${CUSTOM_TIMEOUT_MS()}ms（${CUSTOM_TIMEOUT_MS()/60000} 分钟），默认 ${MAX_TIMEOUT_MS()}ms
- 提供简洁描述：简单命令 5-10 词，复杂命令加足够上下文
- 输出超过 ${MAX_OUTPUT_CHARS()} 字符会截断
- \`run_in_background\` 后台运行，完成后通知
${BASH_TOOL_NAME()}
- **禁止用 Bash 执行**：find/grep/cat/head/tail/sed/awk/echo（除非必要），改用：
  - 文件搜索：${BASH_TOOL_EXTRA_NOTES}（非 find/ls）
  - 内容搜索：${SEARCH_TOOL_NAME}（非 grep/rg）
  - 读文件：${GREP_TOOL_NAME}（非 cat/head/tail）
  - 编辑文件：${READ_TOOL_NAME}（非 sed/awk）
  - 写文件：${EDIT_TOOL_NAME}（非 echo >/cat <<EOF）
  - 通信：直接输出文本（非 echo/printf）
- 多命令：
  - 独立命令：单消息多 ${WRITE_TOOL_NAME} 并行调用
  - 依赖命令：用 && 串联（如 git add && git commit && git push）
  - 不关心失败：用 ;
  - 禁止用换行分隔命令
- 用绝对路径，避免 cd

${GIT_COMMIT_AND_PR_CREATION_INSTRUCTION()}
