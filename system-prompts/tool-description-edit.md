<!--
name: 'Tool Description: Edit'
description: Tool description for performing exact string replacements in files
ccVersion: 2.0.14
variables:
  - READ_TOOL_NAME
-->
精确字符串替换。

规则：
- 编辑前必须先 ${READ_TOOL_NAME} 读取文件（否则会报错）
- 保留原始缩进（行号前缀后的 tab 之后才是文件内容）
- old_string 必须唯一，否则加更多上下文或用 replace_all
- 优先编辑现有文件，非必要不创建新文件
- 非用户要求不加 emoji
