<!--
name: 'Tool Description: LSP'
description: Description for the LSP tool.
ccVersion: 2.0.73
-->
**查找代码定义/引用时，必须优先使用 LSP**（比搜索精准，1 次调用解决）。

| 场景 | 必须用 LSP | 禁止用 |
|------|-----------|--------|
| 找函数定义 | goToDefinition | Grep 搜索 |
| 找所有引用 | findReferences | Grep 搜索 |
| 找接口实现 | goToImplementation | ast-grep |
| 找调用关系 | incomingCalls/outgoingCalls | 手动分析 |
| 获取类型信息 | hover | 猜测 |

支持操作：
- goToDefinition: 跳转定义
- findReferences: 查找所有引用
- hover: 获取悬停信息（文档、类型）
- documentSymbol: 获取文档中所有符号
- workspaceSymbol: 跨工作区搜索符号
- goToImplementation: 查找接口/抽象方法的实现
- prepareCallHierarchy: 获取位置的调用层次项
- incomingCalls: 查找调用此函数的所有函数
- outgoingCalls: 查找此函数调用的所有函数

必需参数：
- filePath: 文件路径
- line: 行号（1-based）
- character: 字符偏移（1-based）

注：LSP 服务器需为文件类型配置，否则报错。
