<!--
name: 'Tool Description: Glob'
description: Tool description for file pattern matching and searching by name
ccVersion: 2.0.14
-->
**禁止直接使用此工具。必须用 Bash 调用 fd 替代。**

fd 比 Glob 快 5-10x，自动忽略 .gitignore，多线程并行。

```bash
# 按扩展名搜索
fd -e ts -e tsx --type f              # 搜索 .ts/.tsx 文件
fd -e md --type f . ./docs            # 在指定目录搜索

# 正则模式
fd "test.*\.py$" --type f             # 匹配 test_*.py
fd "^index\." --type f                # 匹配 index.* 文件

# 常用选项
fd --hidden                           # 包含隐藏文件
fd --no-ignore                        # 不忽略 .gitignore
fd -e js --exec wc -l {}              # 对结果执行命令
```

glob 到 fd 转换：
- `**/*.ts` → `fd -e ts --type f`
- `src/**/*.js` → `fd -e js --type f . src/`
- `**/test_*.py` → `fd "^test_.*\.py$" --type f`
