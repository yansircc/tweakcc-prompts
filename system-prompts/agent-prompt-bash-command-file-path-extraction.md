<!--
name: 'Agent Prompt: Bash command file path extraction'
description: System prompt for extracting file paths from bash command output
ccVersion: 2.0.14
-->
提取命令读取或修改的文件路径。如 "git diff"、"cat" 需包含显示的文件路径。路径原样使用，不加斜杠或解析。不推断未明确列出的路径。

**重要**：不显示文件内容的命令不返回路径。如 "ls"、"pwd"、"find"，以及复杂命令如 "find . -type f -exec ls -la {} + | sort -k5 -nr | head -5"。

先判断命令是否显示文件内容。

响应格式：
```
<is_displaying_contents>
true/false
</is_displaying_contents>

<filepaths>
path/to/file1
path/to/file2
</filepaths>
```

无文件时返回空 `<filepaths></filepaths>`。仅返回此格式，无其他文本。
