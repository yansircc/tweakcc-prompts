#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface Replacement {
  old: string;
  new: string;
}

interface BatchEditArgs {
  pattern: string;
  replacements: Replacement[];
  cwd?: string;
  dry_run?: boolean;
  backup?: boolean;
}

interface FileChange {
  file: string;
  line: number;
  old: string;
  new: string;
}

interface BatchEditResult {
  success: boolean;
  files_matched: number;
  files_changed: number;
  total_replacements: number;
  changes: FileChange[];
  errors: string[];
  dry_run: boolean;
}

// 使用 fd 查找匹配的文件
function findFiles(pattern: string, cwd: string): string[] {
  try {
    // 不含通配符，直接返回
    if (!pattern.includes("*")) {
      return [pattern];
    }

    // 分离目录和文件名模式
    const lastSlash = pattern.lastIndexOf("/");
    const dir = lastSlash >= 0 ? pattern.slice(0, lastSlash) : ".";
    const filePattern = lastSlash >= 0 ? pattern.slice(lastSlash + 1) : pattern;

    // 构建 fd 命令
    let fdArgs: string[] = ["--type", "f"];

    // 提取扩展名
    const extMatch = filePattern.match(/\.(\w+)$/);
    if (extMatch) {
      fdArgs.push("-e", extMatch[1]);
    }

    // 构建正则模式: tool-*.md -> ^tool-.*\.md$
    if (filePattern.includes("*") && filePattern !== "*.") {
      const regexPattern = filePattern
        .replace(/\./g, "\\.")
        .replace(/\*\*/g, ".*")
        .replace(/\*/g, "[^/]*");
      fdArgs.push(`^${regexPattern}$`);
    }

    // 指定搜索目录
    const searchDir = dir.replace(/\*\*\/?/g, "").replace(/\/$/, "") || ".";
    if (searchDir !== ".") {
      fdArgs.push(".", searchDir);
    }

    const cmd = `fd ${fdArgs.join(" ")}`;
    const result = execSync(cmd, {
      cwd,
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });

    // 去重并统一路径格式（去掉 ./ 前缀）
    const files = result.trim().split("\n").filter(Boolean);
    const normalized = files.map(f => f.replace(/^\.\//, ""));
    return [...new Set(normalized)];
  } catch (error) {
    return [];
  }
}

// 执行批量替换
function batchEdit(args: BatchEditArgs): BatchEditResult {
  const cwd = args.cwd || process.cwd();
  const dryRun = args.dry_run ?? false;
  const backup = args.backup ?? false;

  const result: BatchEditResult = {
    success: true,
    files_matched: 0,
    files_changed: 0,
    total_replacements: 0,
    changes: [],
    errors: [],
    dry_run: dryRun,
  };

  try {
    const files = findFiles(args.pattern, cwd);
    result.files_matched = files.length;

    for (const file of files) {
      const filePath = path.isAbsolute(file) ? file : path.join(cwd, file);

      if (!fs.existsSync(filePath)) {
        result.errors.push(`File not found: ${file}`);
        continue;
      }

      let content = fs.readFileSync(filePath, "utf-8");
      const originalContent = content;
      const lines = content.split("\n");
      let fileChanged = false;

      for (const replacement of args.replacements) {
        // 查找所有匹配
        let lineNum = 0;
        for (const line of lines) {
          lineNum++;
          if (line.includes(replacement.old)) {
            result.changes.push({
              file,
              line: lineNum,
              old: line.trim(),
              new: line.replace(replacement.old, replacement.new).trim(),
            });
          }
        }

        // 执行替换
        if (content.includes(replacement.old)) {
          content = content.split(replacement.old).join(replacement.new);
          result.total_replacements++;
          fileChanged = true;
        }
      }

      if (fileChanged) {
        result.files_changed++;

        if (!dryRun) {
          if (backup) {
            fs.writeFileSync(`${filePath}.bak`, originalContent);
          }
          fs.writeFileSync(filePath, content);
        }
      }
    }
  } catch (error) {
    result.success = false;
    result.errors.push(String(error));
  }

  return result;
}

// 项目扫描
interface ProjectScanResult {
  cwd: string;
  file_count: number;
  dir_count: number;
  languages: Record<string, { files: number; lines: number }>;
  recent_files: string[];
  git_status?: string;
}

function projectScan(cwd: string): ProjectScanResult {
  const result: ProjectScanResult = {
    cwd,
    file_count: 0,
    dir_count: 0,
    languages: {},
    recent_files: [],
  };

  try {
    // 文件数
    const files = execSync("fd --type f | wc -l", { cwd, encoding: "utf-8" });
    result.file_count = parseInt(files.trim()) || 0;

    // 目录数
    const dirs = execSync("fd --type d | wc -l", { cwd, encoding: "utf-8" });
    result.dir_count = parseInt(dirs.trim()) || 0;

    // 语言统计 (使用 tokei)
    try {
      const tokei = execSync("tokei --output json 2>/dev/null", { cwd, encoding: "utf-8" });
      const tokeiData = JSON.parse(tokei);
      for (const [lang, data] of Object.entries(tokeiData)) {
        if (lang !== "Total" && typeof data === "object" && data !== null) {
          const langData = data as { code?: number; reports?: unknown[] };
          result.languages[lang] = {
            files: Array.isArray(langData.reports) ? langData.reports.length : 0,
            lines: langData.code || 0,
          };
        }
      }
    } catch {
      // tokei 不可用，跳过
    }

    // 最近修改的文件
    try {
      const recent = execSync("fd --type f --changed-within 1d | head -10", {
        cwd,
        encoding: "utf-8"
      });
      result.recent_files = recent.trim().split("\n").filter(Boolean);
    } catch {
      // 跳过
    }

    // Git 状态
    try {
      const gitStatus = execSync("git status --porcelain 2>/dev/null | head -20", {
        cwd,
        encoding: "utf-8"
      });
      result.git_status = gitStatus.trim();
    } catch {
      // 不是 git 仓库
    }
  } catch (error) {
    // 忽略错误
  }

  return result;
}

// 批量读取
interface BatchReadResult {
  files: Record<string, { content: string; lines: number } | { error: string }>;
  total_files: number;
  total_lines: number;
}

function batchRead(pattern: string, cwd: string, maxLines?: number): BatchReadResult {
  const result: BatchReadResult = {
    files: {},
    total_files: 0,
    total_lines: 0,
  };

  const files = findFiles(pattern, cwd);

  for (const file of files) {
    const filePath = path.isAbsolute(file) ? file : path.join(cwd, file);

    try {
      let content = fs.readFileSync(filePath, "utf-8");
      const lines = content.split("\n");
      const lineCount = lines.length;

      if (maxLines && lineCount > maxLines) {
        content = lines.slice(0, maxLines).join("\n") + `\n... (${lineCount - maxLines} more lines)`;
      }

      result.files[file] = { content, lines: lineCount };
      result.total_files++;
      result.total_lines += lineCount;
    } catch (error) {
      result.files[file] = { error: String(error) };
    }
  }

  return result;
}

// 创建 MCP 服务器
const server = new Server(
  {
    name: "batch-tools",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 注册工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "batch_edit",
        description: `Batch edit multiple files with pattern matching.
Supports glob patterns like "src/**/*.ts".
Use dry_run=true to preview changes before applying.
Returns structured results with all changes made.`,
        inputSchema: {
          type: "object",
          properties: {
            pattern: {
              type: "string",
              description: 'File pattern to match, e.g. "src/**/*.ts" or "**/*.js"',
            },
            replacements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  old: { type: "string", description: "Text to find" },
                  new: { type: "string", description: "Text to replace with" },
                },
                required: ["old", "new"],
              },
              description: "List of replacements to make",
            },
            cwd: {
              type: "string",
              description: "Working directory (defaults to current)",
            },
            dry_run: {
              type: "boolean",
              description: "Preview changes without applying (default: false)",
            },
            backup: {
              type: "boolean",
              description: "Create .bak backup files (default: false)",
            },
          },
          required: ["pattern", "replacements"],
        },
      },
      {
        name: "batch_read",
        description: `Read multiple files matching a pattern.
Returns structured content for all matched files.
Use max_lines to limit content per file.`,
        inputSchema: {
          type: "object",
          properties: {
            pattern: {
              type: "string",
              description: 'File pattern to match, e.g. "src/**/*.ts"',
            },
            cwd: {
              type: "string",
              description: "Working directory (defaults to current)",
            },
            max_lines: {
              type: "number",
              description: "Max lines to read per file (default: unlimited)",
            },
          },
          required: ["pattern"],
        },
      },
      {
        name: "project_scan",
        description: `Scan project for quick overview.
Returns file counts, language stats, recent changes, and git status.`,
        inputSchema: {
          type: "object",
          properties: {
            cwd: {
              type: "string",
              description: "Project directory to scan (defaults to current)",
            },
          },
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "batch_edit": {
        const editArgs = args as unknown as BatchEditArgs;
        const result = batchEdit(editArgs);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "batch_read": {
        const { pattern, cwd, max_lines } = args as {
          pattern: string;
          cwd?: string;
          max_lines?: number;
        };
        const result = batchRead(pattern, cwd || process.cwd(), max_lines);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case "project_scan": {
        const { cwd } = args as { cwd?: string };
        const result = projectScan(cwd || process.cwd());
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: String(error) }),
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Batch Tools MCP server running on stdio");
}

main().catch(console.error);
