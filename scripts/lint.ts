#!/usr/bin/env bun
/**
 * 检查提示词文件的语法问题
 * 检测可能破坏 JavaScript 模板字符串的模式
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";

const PROMPTS_DIR = join(import.meta.dir, "../system-prompts");

interface LintError {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
  severity: "error" | "warning";
}

interface LintRule {
  id: string;
  message: string;
  severity: "error" | "warning";
  check: (line: string, lineNum: number, fullContent: string) => LintError | null;
}

const rules: LintRule[] = [
  {
    id: "unescaped-codeblock",
    message: "未转义的代码块，应改为 \\`\\`\\`",
    severity: "error",
    check: (line, lineNum, fullContent) => {
      if (line.trim() === "```" || line.trim().startsWith("```")) {
        // 检查是否在 frontmatter 外
        const beforeLine = fullContent.split("\n").slice(0, lineNum).join("\n");
        if (!beforeLine.includes("-->")) return null; // 还在 frontmatter 中

        return {
          file: "",
          line: lineNum,
          column: line.indexOf("```") + 1,
          rule: "unescaped-codeblock",
          message: "未转义的代码块，应改为 \\`\\`\\`",
          severity: "error",
        };
      }
      return null;
    },
  },
  {
    id: "nested-template-literal",
    message: "含嵌套模板字符串，不可随意修改",
    severity: "warning",
    check: (line, lineNum) => {
      // 检测 ${...?`...`:`...`} 模式
      const match = line.match(/\$\{[^}]*\?\s*`/);
      if (match) {
        return {
          file: "",
          line: lineNum,
          column: match.index! + 1,
          rule: "nested-template-literal",
          message: "含嵌套模板字符串，修改可能破坏 JS 语法",
          severity: "warning",
        };
      }
      return null;
    },
  },
  {
    id: "template-join",
    message: ".join() 含模板字符串，需注意语法",
    severity: "warning",
    check: (line, lineNum) => {
      const match = line.match(/\.join\s*\(\s*`/);
      if (match) {
        return {
          file: "",
          line: lineNum,
          column: match.index! + 1,
          rule: "template-join",
          message: ".join() 含模板字符串，修改时用双引号如 .join(\"\\n\")",
          severity: "warning",
        };
      }
      return null;
    },
  },
];

async function lintFile(filePath: string): Promise<LintError[]> {
  const content = await readFile(filePath, "utf-8");
  const lines = content.split("\n");
  const errors: LintError[] = [];
  const fileName = filePath.split("/").pop()!;

  for (let i = 0; i < lines.length; i++) {
    for (const rule of rules) {
      const error = rule.check(lines[i], i + 1, content);
      if (error) {
        error.file = fileName;
        errors.push(error);
      }
    }
  }

  return errors;
}

async function main() {
  const files = await readdir(PROMPTS_DIR);
  const mdFiles = files.filter(f => f.endsWith(".md") && !f.includes(".diff."));

  let totalErrors = 0;
  let totalWarnings = 0;
  const allErrors: LintError[] = [];

  for (const file of mdFiles) {
    const errors = await lintFile(join(PROMPTS_DIR, file));
    allErrors.push(...errors);
    totalErrors += errors.filter(e => e.severity === "error").length;
    totalWarnings += errors.filter(e => e.severity === "warning").length;
  }

  console.log("\n🔍 提示词语法检查\n");

  if (allErrors.length === 0) {
    console.log("\x1b[32m✅ 没有发现问题\x1b[0m\n");
    process.exit(0);
  }

  // 按文件分组
  const byFile = new Map<string, LintError[]>();
  for (const error of allErrors) {
    const list = byFile.get(error.file) ?? [];
    list.push(error);
    byFile.set(error.file, list);
  }

  for (const [file, errors] of byFile) {
    console.log(`\x1b[1m${file}\x1b[0m`);
    for (const e of errors) {
      const color = e.severity === "error" ? "\x1b[31m" : "\x1b[33m";
      const icon = e.severity === "error" ? "✖" : "⚠";
      console.log(`  ${color}${icon}\x1b[0m ${e.line}:${e.column} ${e.message} \x1b[90m(${e.rule})\x1b[0m`);
    }
    console.log();
  }

  console.log(`\x1b[31m${totalErrors} error(s)\x1b[0m, \x1b[33m${totalWarnings} warning(s)\x1b[0m\n`);

  if (totalErrors > 0) {
    process.exit(1);
  }
}

main().catch(console.error);
