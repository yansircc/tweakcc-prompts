# Claude Code 高性能优化补丁

> 通过修改 Claude Code 的工具描述 + 自定义 MCP 工具，让 AI Agent 自动选择更高效的工具和策略，实现极致性能提升。

## What - 这是什么

这是一套 Claude Code 优化方案，包含两部分：

### 1. 系统提示词优化

修改工具描述来引导 Claude：

- **使用高性能 CLI 工具** - 用 `fd` 替代 `find`，用 `ast-grep` 替代 `grep`
- **限制输出长度** - 减少 40% Token 消耗
- **强制结构化输出** - 便于解析，提升效率 50%
- **智能工具选择** - LSP > ast-grep > Grep，减少 50% 工具调用
- **Subagent 委托策略** - 保护主上下文，避免污染

### 2. MCP 批量操作工具

自定义 MCP 服务器提供高效批量操作：

| 工具 | 功能 | 优势 |
|------|------|------|
| `batch_edit` | 批量替换文件内容 | 支持 dry_run 预览、结构化输出 |
| `batch_read` | 批量读取多个文件 | 一次调用读取 N 个文件 |
| `project_scan` | 项目概览扫描 | 文件统计、语言分布、git 状态 |

## Why - 为什么需要

Claude Code 默认使用通用策略，但存在优化空间：

| 问题 | 影响 | 本补丁解决方案 |
|------|------|----------------|
| 使用 `find` 搜索文件 | 慢 | 强制用 `fd`（快 5-10x） |
| 文本搜索找代码结构 | 不精准 | 用 `ast-grep` 语义搜索 |
| 输出无限制 | Token 浪费 | 强制 `head -N` 限制 |
| 人类可读格式 | 解析困难 | 强制结构化输出 |
| 大文件全量读取 | Token 爆炸 | 智能分段读取 |
| 搜索代替 LSP | 多次调用 | LSP 优先策略 |
| 批量操作多次调用 | 效率低 | MCP 工具一次调用 |

**预期收益**：
- Token 消耗 **-40%**
- 工具调用次数 **-50%**
- 执行速度 **5-10x**（文件搜索场景）

## How - 如何使用

### 1. 安装依赖工具

```bash
# macOS
brew install fd ripgrep ast-grep jq tokei

# 验证安装
fd --version && sg --version && jq --version && tokei --version
```

### 2. 安装 tweakcc

[tweakcc](https://github.com/Piebald-AI/tweakcc) 是一个 Claude Code 补丁工具，可以自定义系统提示词。

```bash
# 首次运行，生成配置目录
npx tweakcc
```

### 3. 应用提示词补丁

```bash
# 克隆本仓库
git clone https://github.com/yansircc/tweakcc-prompts.git ~/.tweakcc-prompts

# 备份原有配置
cp -r ~/.tweakcc/system-prompts ~/.tweakcc/system-prompts.bak

# 复制优化后的工具描述
cp ~/.tweakcc-prompts/system-prompts/*.md ~/.tweakcc/system-prompts/

# 打补丁
npx tweakcc --apply
```

### 4. 安装 MCP 批量工具（可选但推荐）

```bash
# 创建 MCP 服务器目录
mkdir -p ~/.claude/mcp-servers/batch-tools

# 复制 MCP 服务器代码
cp -r ~/.tweakcc-prompts/mcp-servers/batch-tools/* ~/.claude/mcp-servers/batch-tools/

# 安装依赖并编译
cd ~/.claude/mcp-servers/batch-tools
npm install && npm run build

# 配置到 Claude Code（添加到 ~/.claude.json 的 mcpServers）
```

在 `~/.claude.json` 中添加：

```json
{
  "mcpServers": {
    "batch-tools": {
      "type": "stdio",
      "command": "node",
      "args": ["/Users/你的用户名/.claude/mcp-servers/batch-tools/dist/index.js"]
    }
  }
}
```

### 5. 启动 Claude Code

```bash
claude
```

运行 `/mcp` 验证 batch-tools 已连接。

### 更新 Claude Code 后

每次更新 Claude Code，自定义提示词会被覆盖。只需重新运行：

```bash
npx tweakcc --apply
```

## MCP 工具使用示例

### batch_edit - 批量替换

```javascript
// 预览模式（推荐先运行）
batch_edit({
  pattern: "src/**/*.ts",
  replacements: [
    { old: "console.log", new: "logger.info" }
  ],
  dry_run: true
})

// 实际执行
batch_edit({
  pattern: "src/**/*.ts",
  replacements: [
    { old: "console.log", new: "logger.info" }
  ],
  dry_run: false
})
```

### batch_read - 批量读取

```javascript
batch_read({
  pattern: "src/components/*.tsx",
  max_lines: 50  // 每个文件最多读取 50 行
})
```

### project_scan - 项目扫描

```javascript
project_scan({
  cwd: "/path/to/project"
})
// 返回：文件数、目录数、语言统计、最近修改文件、git 状态
```

## 工具选择策略

优先级：**MCP 工具 > 专用工具 > Shell 命令**

| 场景 | 首选 | 备选 |
|------|------|------|
| 项目概览 | `project_scan` | tokei + fd |
| 批量读取 (>3 文件) | `batch_read` | cat/head + xargs |
| 批量替换 | `batch_edit` | sed -i + fd |
| 单文件读取 | Read 工具 | - |
| 单文件编辑 | Edit 工具 | - |
| 找定义/引用 | LSP | ast-grep |
| 找代码结构 | ast-grep | Grep |

## 优化清单

### 已优化的工具

| 工具 | 优化内容 |
|------|----------|
| **Glob** | 推荐用 `fd` 替代 |
| **Bash** | MCP 优先、高性能工具表、输出限制、结构化输出 |
| **Grep** | `ast-grep` 优先、代码查找决策树 |
| **LSP** | 优先策略（比搜索精准，1 次调用解决） |
| **Read** | 智能读取策略、批量读取提示 |
| **Edit** | 预检查、批量编辑提示 |
| **Task** | Subagent 委托策略（保护上下文） |

### 代码查找决策树

```
查找代码 →
  ├─ 知道文件和行号 → Read（直接读取）
  ├─ 找定义/引用/实现 → LSP（最精准，1次调用）
  ├─ 找代码结构（函数/类/import）→ ast-grep
  ├─ 找关键词/字符串 → Grep
  └─ 探索未知代码库 → Task subagent（保护上下文）
```

## 项目结构

```
.
├── README.md
├── config.json                 # tweakcc 配置
├── system-prompts/             # 优化后的工具描述
│   ├── tool-description-bash.md
│   ├── tool-description-edit.md
│   ├── tool-description-glob.md
│   ├── tool-description-grep.md
│   ├── tool-description-readfile.md
│   └── ...
└── mcp-servers/                # MCP 服务器
    └── batch-tools/
        ├── package.json
        ├── tsconfig.json
        └── src/index.ts
```

## 参考资料

- [tweakcc](https://github.com/Piebald-AI/tweakcc) - Claude Code 补丁工具
- [MCP Protocol](https://modelcontextprotocol.io/) - Model Context Protocol
- [fd](https://github.com/sharkdp/fd) - 高性能文件搜索
- [ast-grep](https://github.com/ast-grep/ast-grep) - AST 语义搜索
- [ripgrep](https://github.com/BurntSushi/ripgrep) - 高性能文本搜索
- [jq](https://github.com/jqlang/jq) - JSON 处理器
- [tokei](https://github.com/XAMPPRocky/tokei) - 代码统计

## License

MIT
