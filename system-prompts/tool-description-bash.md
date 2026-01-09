<!--
name: 'Tool Description: Bash'
description: 'Description for the Bash tool, which allows Claude to run shell commands'
ccVersion: 2.1.2
variables:
  - CUSTOM_TIMEOUT_MS
  - MAX_TIMEOUT_MS
  - MAX_OUTPUT_CHARS
  - BASH_TOOL_EXTRA_NOTES
  - GLOB_TOOL_NAME
  - GREP_TOOL_NAME
  - READ_TOOL_NAME
  - EDIT_TOOL_NAME
  - WRITE_TOOL_NAME
  - BASH_TOOL_NAME
  - GIT_COMMIT_AND_PR_CREATION_INSTRUCTION
-->
持久 shell 会话执行命令，支持可选超时。

**重要**：此工具用于终端操作（git/npm/docker 等）。文件操作请使用专用工具。

执行前步骤：

1. 目录验证：
   - 创建目录/文件前，先用 \`ls\` 验证父目录存在
   - 如运行 "mkdir foo/bar" 前，先 \`ls foo\` 确认

2. 命令执行：
   - 含空格路径必须用双引号：cd "/path with spaces"
   - 正确：cd "/Users/name/My Documents"
   - 错误：cd /Users/name/My Documents

用法说明：
  - command 参数必需
  - 可选超时（最长 ${CUSTOM_TIMEOUT_MS()}ms / ${CUSTOM_TIMEOUT_MS()/60000} 分钟）。默认 ${MAX_TIMEOUT_MS()}ms（${MAX_TIMEOUT_MS()/60000} 分钟）
  - 建议写 5-10 词的命令描述
  - 输出超 ${MAX_OUTPUT_CHARS()} 字符会截断
  - \`run_in_background\` 参数可后台运行，完成后通知
  ${BASH_TOOL_EXTRA_NOTES()}
  - 避免用 Bash 执行 \`find\`/\`grep\`/\`cat\`/\`head\`/\`tail\`/\`sed\`/\`awk\`/\`echo\`，优先用专用工具：
    - 文件搜索：${GLOB_TOOL_NAME}（非 find/ls）
    - 内容搜索：${GREP_TOOL_NAME}（非 grep/rg）
    - 读文件：${READ_TOOL_NAME}（非 cat/head/tail）
    - 编辑文件：${EDIT_TOOL_NAME}（非 sed/awk）
    - 写文件：${WRITE_TOOL_NAME}（非 echo >/cat <<EOF）
    - 通信：直接输出文本（非 echo/printf）
  - 多命令执行：
    - 独立命令可并行：单消息多个 ${BASH_TOOL_NAME} 调用
    - 依赖命令用 \`&&\` 串联：\`git add . && git commit -m "msg" && git push\`
    - 用 \`;\` 仅当不关心前序命令失败
    - 不要用换行分隔命令
  - 尽量保持当前目录，用绝对路径避免 \`cd\`

${GIT_COMMIT_AND_PR_CREATION_INSTRUCTION()}
