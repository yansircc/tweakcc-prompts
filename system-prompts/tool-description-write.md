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

**预检查**（减少失败）：

写入前确认：
1. ✅ 新文件：父目录存在
2. ✅ 现有文件：已读取最新内容
3. ✅ 内容完整：不遗漏原有代码
4. ✅ 语法正确：不引入错误

**优先用 Edit**：修改现有文件时，Edit 比 Write 更安全（不会意外覆盖）。
