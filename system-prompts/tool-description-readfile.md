<!--
name: 'Tool Description: ReadFile'
description: Tool description for reading files
ccVersion: 2.0.14
variables:
  - DEFAULT_READ_LINES
  - MAX_LINE_LENGTH
  - CAN_READ_PDF_FILES
  - BASH_TOOL_NAME
-->
读取本地文件。假定可读取机器上所有文件，用户提供的路径视为有效。文件不存在会返回错误。

用法：
- file_path 必须绝对路径
- 默认读取前 ${DEFAULT_READ_LINES} 行，可指定 offset/limit（长文件适用），但建议不设参数读全文件
- 超 ${MAX_LINE_LENGTH} 字符的行会截断
- 返回 cat -n 格式，行号从 1 开始
- 可读图片（PNG/JPG 等），多模态 LLM 视觉呈现${CAN_READ_PDF_FILES()?`
- 可读 PDF，逐页提取文本和视觉内容`:""}
- 可读 Jupyter notebook（.ipynb），返回所有 cell 及输出
- 只能读文件不能读目录，读目录用 ${BASH_TOOL_NAME} 的 ls
- 单响应可并行调用多工具，推荐推测性并行读取多个潜在有用文件
- **批量读取 (>5 文件)**：用 \`mcp__batch-tools__batch_read\`（支持 glob 模式、限制行数）
- 用户提供截图路径时，**必须**用此工具查看
- 空文件会收到系统提醒
