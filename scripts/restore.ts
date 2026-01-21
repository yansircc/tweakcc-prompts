#!/usr/bin/env bun
/**
 * 恢复 Claude Code 到官方版本
 *
 * 动态检测安装位置，只重装 cli.js 所在的包
 */

import { $ } from "bun";
import { existsSync } from "fs";
import { dirname, join } from "path";

// 可能的安装位置
const POSSIBLE_PATHS = [
  join(process.env.HOME || "", ".claude/local"),
  join(process.env.HOME || "", ".claude"),
];

async function findClaudeCodePath(): Promise<string | null> {
  // 方法1: 通过 tweakcc 输出获取
  try {
    const result = await $`npx tweakcc --apply 2>&1 || true`.text();
    const match = result.match(/Found Claude Code at: (.+\/cli\.js)/);
    if (match) {
      // 从 cli.js 路径推导出安装目录
      // cli.js 在 node_modules/@anthropic-ai/claude-code/cli.js
      const cliPath = match[1];
      const localDir = dirname(dirname(dirname(dirname(cliPath))));
      if (existsSync(join(localDir, "package.json"))) {
        return localDir;
      }
    }
  } catch {}

  // 方法2: 检查已知路径
  for (const path of POSSIBLE_PATHS) {
    const pkgPath = join(path, "node_modules/@anthropic-ai/claude-code/package.json");
    if (existsSync(pkgPath)) {
      return path;
    }
  }

  // 方法3: 通过 which claude 查找
  try {
    const claudePath = await $`which claude 2>/dev/null || type claude 2>/dev/null`.text();
    const match = claudePath.match(/([^\s]+)/);
    if (match) {
      // 解析 shell 脚本找到实际路径
      const scriptContent = await Bun.file(match[1].trim()).text();
      const execMatch = scriptContent.match(/exec\s+"([^"]+)"/);
      if (execMatch) {
        // 从 node_modules/.bin/claude 推导
        const binPath = execMatch[1];
        const localDir = dirname(dirname(binPath));
        if (existsSync(join(localDir, "package.json"))) {
          return localDir;
        }
      }
    }
  } catch {}

  return null;
}

async function getInstalledVersion(localDir: string): Promise<string | null> {
  try {
    const pkgPath = join(localDir, "node_modules/@anthropic-ai/claude-code/package.json");
    const pkg = await Bun.file(pkgPath).json();
    return pkg.version;
  } catch {
    return null;
  }
}

async function restore() {
  console.log("🔍 检测 Claude Code 安装位置...");

  const localDir = await findClaudeCodePath();
  if (!localDir) {
    console.error("❌ 未找到 Claude Code 安装位置");
    console.error("   尝试以下命令手动安装:");
    console.error("   npm install -g @anthropic-ai/claude-code");
    process.exit(1);
  }

  console.log(`📍 找到安装目录: ${localDir}`);

  const version = await getInstalledVersion(localDir);
  if (version) {
    console.log(`📦 当前版本: ${version}`);
  }

  console.log("🔄 重新安装所有依赖...");

  try {
    // 完整重装所有依赖
    await $`cd ${localDir} && rm -rf node_modules package-lock.json && npm install`.quiet();

    const newVersion = await getInstalledVersion(localDir);
    console.log(`✅ 恢复完成！版本: ${newVersion}`);

    // 验证
    console.log("🧪 验证安装...");
    const testResult = await $`claude --version 2>/dev/null || ccc --version 2>/dev/null`.text();
    console.log(`   ${testResult.trim()}`);
  } catch (error) {
    console.error("❌ 恢复失败:", error);
    console.error("   尝试手动恢复:");
    console.error(`   cd ${localDir} && npm install`);
    process.exit(1);
  }
}

restore();
