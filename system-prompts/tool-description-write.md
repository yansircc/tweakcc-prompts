<!--
name: 'Tool Description: Write'
description: Tool description creating/overwriting writing individual files
ccVersion: 2.0.14
variables:
  - READ_TOOL_NAME
-->
写文件到本地（会覆盖）。

规则：
- 现有文件必须先 ${READ_TOOL_NAME} 读取（否则会失败）
- 优先编辑现有文件，非必要不创建新文件
- 非用户要求不创建文档文件（*.md/README）
- 非用户要求不加 emoji
