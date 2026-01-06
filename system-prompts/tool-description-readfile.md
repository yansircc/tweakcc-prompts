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
读取本地文件。假设用户提供的路径有效。

规则：
- 必须用绝对路径
- 默认读 ${DEFAULT_READ_LINES} 行，超长行（>${MAX_LINE_LENGTH} 字符）截断
- 可指定 offset/limit 读取部分内容
- 支持格式：代码、图片（PNG/JPG）${CAN_READ_PDF_FILES()?`、PDF`:""}、Jupyter notebook
- 读目录用 ${BASH_TOOL_NAME} ls
- 可并行读取多个文件

**智能读取策略**（减少 Token 消耗）：

| 文件大小 | 策略 |
|----------|------|
| <200 行 | 直接读取全部 |
| 200-500 行 | 先读 1-100 行了解结构，再精准读取目标区域 |
| >500 行 | **禁止全量读取**，必须用 offset/limit 分段读 |

```
# 大文件读取流程
1. 先 limit=100 了解文件结构
2. 用 LSP/Grep 定位目标行号
3. 用 offset/limit 精准读取目标区域（前后各 20 行上下文）
```
