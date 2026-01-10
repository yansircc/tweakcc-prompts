# Claude Code 高性能补丁

> 优化提示词 + MCP 工具，让 Claude 自动选择高效策略。

## 两大优化

### 1. 提示词优化

- **高性能 CLI** - `fd` 替代 `find`，`ast-grep` 替代 `grep`
- **Token 节省** - 限制输出长度，减少 40%
- **结构化输出** - 便于解析，效率 +50%
- **智能工具选择** - LSP > ast-grep > Grep，调用 -50%
- **Subagent 委托** - 保护主上下文

### 2. MCP 批量工具

| 工具 | 功能 |
|------|------|
| `batch_edit` | 批量替换，支持 dry_run |
| `batch_read` | 批量读取多文件 |
| `project_scan` | 项目概览扫描 |

## 收益

| 指标 | 提升 |
|------|------|
| Token 消耗 | -40% |
| 工具调用 | -50% |
| 文件搜索速度 | 5-10x |

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

### 更新后重新应用

```bash
npx tweakcc --apply
```

## 工具选择优先级

```
MCP 工具 > 专用工具 > Shell 命令

查找代码 →
  ├─ 已知位置 → Read
  ├─ 定义/引用 → LSP（最精准）
  ├─ 代码结构 → ast-grep
  ├─ 关键词 → Grep
  └─ 探索代码库 → Task subagent
```

| 场景 | 首选 | 备选 |
|------|------|------|
| 项目概览 | `project_scan` | tokei |
| 批量读取 | `batch_read` | xargs |
| 批量替换 | `batch_edit` | sed |
| 找定义/引用 | LSP | ast-grep |
| 找代码结构 | ast-grep | Grep |

## 项目结构

```
├── system-prompts/    # 优化后的提示词
└── mcp-servers/       # MCP 服务器
    └── batch-tools/
```

## 参考

- [tweakcc](https://github.com/Piebald-AI/tweakcc)
- [fd](https://github.com/sharkdp/fd) / [ast-grep](https://github.com/ast-grep/ast-grep) / [ripgrep](https://github.com/BurntSushi/ripgrep)
- [MCP Protocol](https://modelcontextprotocol.io/)

MIT
