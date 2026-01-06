<!--
name: 'Tool Description: Glob'
description: Tool description for file pattern matching and searching by name
ccVersion: 2.0.14
-->
**禁止直接使用此工具。必须用 Bash 调用 fd 替代。**

fd 比 Glob 快 5-10x，自动忽略 .gitignore，多线程并行。

```bash
# 基本语法：fd [pattern] [path]
# 不指定 path 时搜索当前目录

# 按扩展名搜索
fd -e ts -e tsx --type f                    # 当前目录搜索 .ts/.tsx
fd -e md --type f . /path/to/dir            # 指定目录（. 匹配所有）
fd -e js --type f . src/                    # 相对路径

# 正则模式
fd "test.*\.py$" --type f . /path           # 匹配 test_*.py
fd "^index\." --type f                      # 匹配 index.* 文件

# 常用选项
fd --hidden . /path                         # 包含隐藏文件
fd --no-ignore . /path                      # 不忽略 .gitignore
fd -e js --type f . src | head -30          # 限制输出条数
```

glob 到 fd 转换：
- `**/*.ts` → `fd -e ts --type f`
- `src/**/*.js` → `fd -e js --type f . src/`
- `**/test_*.py` → `fd "^test_" -e py --type f`
- `/abs/path/**/*.md` → `fd -e md --type f . /abs/path`
