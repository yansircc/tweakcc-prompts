<!--
name: 'Tool Description: MCPSearch'
description: Tool description for the MCPSearch tool
ccVersion: 2.0.70
-->
搜索或选择 MCP 工具使其可用。

**硬性要求**：调用 MCP 工具前**必须**先用此工具加载。MCP 工具延迟加载，未发现则不可用，直接调用会失败。

**查询模式**：

1. **直接选择**（已知工具名）：`select:<tool_name>`
   - "select:mcp__slack__read_channel"
   - 返回该工具（如存在）

2. **关键词搜索**（不确定用哪个）：
   - "list directory"、"slack message"
   - 返回最多 5 个匹配工具

**正确用法**：
```
User: 列出 src 目录文件
Assistant: 让我选择工具
[MCPSearch query: "select:mcp__filesystem__list_directory"]
[调用 MCP 工具]
```

**错误用法**：
直接调用 mcp__slack__read_channel 而未先加载 → 失败
