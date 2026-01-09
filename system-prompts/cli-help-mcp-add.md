<!--
name: 'CLI Help: MCP Add'
description: Help text for claude mcp add command
ccVersion: 2.1.2
-->
Add an MCP server to Claude Code.

Note: All options (--transport, --env, --scope, --header) must come before the server name.

Examples:
  # Add HTTP server:
  claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

  # Add SSE server:
  claude mcp add --transport sse asana https://mcp.asana.com/sse

  # Add stdio server with environment variables:
  claude mcp add --transport stdio -e API_KEY=xxx -e OTHER=yyy my-server -- npx my-mcp-server

  # Add stdio server with subprocess flags:
  claude mcp add --transport stdio my-server -- my-command --some-flag arg1
