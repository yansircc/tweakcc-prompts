# Tweakcc 中文优化补丁

> Claude Code 提示词汉化 + 性能优化

## 状态

```bash
bun run check          # 查看汉化状态
bun run check --json   # JSON 输出
bun run validate       # 验证是否正常
```

## 安装

### 1. 依赖

```bash
brew install fd ripgrep ast-grep jq tokei
```

### 2. tweakcc

```bash
npx tweakcc              # 首次运行
```

### 3. 应用补丁

```bash
git clone https://github.com/yansircc/tweakcc-prompts.git ~/.tweakcc-prompts
cp ~/.tweakcc-prompts/system-prompts/*.md ~/.tweakcc/system-prompts/
npx tweakcc --apply
```

### 4. MCP 工具（可选）

```bash
mkdir -p ~/.claude/mcp-servers/batch-tools
cp -r ~/.tweakcc-prompts/mcp-servers/batch-tools/* ~/.claude/mcp-servers/batch-tools/
cd ~/.claude/mcp-servers/batch-tools && npm install && npm run build
```

`~/.claude.json` 添加：

```json
{
  "mcpServers": {
    "batch-tools": {
      "command": "node",
      "args": ["~/.claude/mcp-servers/batch-tools/dist/index.js"]
    }
  }
}
```

## 优化内容

### 提示词优化

- **汉化** - 59/66 文件已翻译，核心提示词全覆盖
- **精简** - 不损失信息，节省 token
- **高性能 CLI** - `fd` 替代 `find`，`ast-grep` 替代 `grep`
- **智能工具选择** - LSP > ast-grep > Grep

### MCP 批量工具

| 工具 | 功能 |
|------|------|
| `batch_edit` | 批量替换，支持 dry_run |
| `batch_read` | 批量读取多文件 |
| `project_scan` | 项目概览扫描 |

## 辅助命令

| 命令 | 用途 |
|------|------|
| `bun run check` | 查看文件状态 |
| `bun run check --json` | JSON 输出 |
| `bun run validate` | 验证修改 |
| `bun run restore` | 恢复 Claude Code |

## 汉化指南

### 文件分类

| 分类 | 含义 | 操作 |
|------|------|------|
| ✅ translated | 已翻译 | 无需处理 |
| 📝 translatable | 可直接翻译 | 安全翻译 |
| ⚠️ careful | 含嵌套模板 | 保持语法结构 |
| 🔀 keep | GitHub/混合/低价值 | 不翻译 |

### 翻译规则

1. **保留 frontmatter** - `<!--` 到 `-->` 不改
2. **保留变量** - 所有 `${...}` 保持原样
3. **保留转义** - `\`\`\`` 保持原样
4. **嵌套模板** - 保持 `${condition ? \`text\` : \`text\`}` 结构

### 验证流程

```bash
# 修改前备份
cp system-prompts/xxx.md system-prompts/xxx.md.bak

# 编辑后验证
bun run validate

# 失败时恢复
cp system-prompts/xxx.md.bak system-prompts/xxx.md
```

## 项目结构

```
├── system-prompts/    # 优化后的提示词
├── scripts/
│   └── check.ts       # 状态检查工具
└── mcp-servers/       # MCP 服务器
    └── batch-tools/
```

## 参考

- [tweakcc](https://github.com/Piebald-AI/tweakcc)
- [fd](https://github.com/sharkdp/fd) / [ast-grep](https://github.com/ast-grep/ast-grep) / [ripgrep](https://github.com/BurntSushi/ripgrep)

MIT
