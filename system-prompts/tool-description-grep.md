<!--
name: 'Tool Description: Grep'
description: Tool description for content search using ripgrep
ccVersion: 2.0.14
variables:
  - GREP_TOOL_NAME
  - BASH_TOOL_NAME
  - TASK_TOOL_NAME
-->
基于 ripgrep 的搜索工具。禁止用 ${BASH_TOOL_NAME} 调用 grep/rg。

规则：
- 支持正则：如 "log.*Error", "function\\s+\\w+"
- 过滤：glob 参数（"*.js"）或 type 参数（"js", "py"）
- 输出模式：content（匹配行）、files_with_matches（默认，仅路径）、count
- 花括号需转义：\`interface\\{\\}\`
- 跨行匹配用 multiline: true
- 多轮搜索用 ${TASK_TOOL_NAME}

**输出限制**（必须设置 head_limit）：
- files_with_matches：head_limit=30
- content：head_limit=50
- 需要更多结果时，用 ${TASK_TOOL_NAME} 委托 subagent

# 语义搜索：ast-grep（必须优先使用）

搜索代码时，**必须首选** ${BASH_TOOL_NAME} 调用 ast-grep（基于 AST，理解代码结构）：

```bash
# 搜索函数调用
sg -p 'console.log($$$)' --lang ts           # 找所有 console.log
sg -p '$FUNC($$$)' --lang py                 # 找所有函数调用

# 搜索定义
sg -p 'function $NAME($$$) { $$$ }' --lang js    # 找函数定义
sg -p 'const $NAME = ($$$) => $$$' --lang ts     # 找箭头函数

# 搜索模式
sg -p 'import $_ from "$MOD"' --lang ts      # 找所有 import
sg -p 'if ($COND) { $$$ }' --lang js         # 找所有 if 块
```

ripgrep vs ast-grep：
- ripgrep：文本匹配，快，适合关键词搜索
- ast-grep：语义匹配，理解代码结构，适合找函数/类/调用关系

# 代码查找决策树（必须遵循）

```
查找代码 →
  ├─ 知道文件和行号 → Read（直接读取）
  ├─ 找定义/引用/实现 → LSP（最精准，1次调用）
  ├─ 找代码结构（函数/类/import）→ ast-grep
  ├─ 找关键词/字符串 → Grep（本工具）
  └─ 探索未知代码库 → Task subagent（保护上下文）
```

**选择原则**：精准度优先，LSP > ast-grep > Grep > 全文搜索
