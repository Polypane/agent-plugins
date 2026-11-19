# Polypane agent plugins

Polypane for AI agents: your agent checks the page it's building in every viewport at once, with Polypane's accessibility, overflow, meta and console checks, and you watch everything it does.

Each plugin connects the agent to Polypane's built-in MCP server and, where the format allows, adds the Polypane agent skill. The [Automation docs](https://polypane.app/docs/automation/) explain what agents can do.

## Install

- **Claude Code**: `/plugin marketplace add Polypane/agent-plugins`, then `/plugin install polypane@polypane`.
- **Claude Desktop**: download `polypane.mcpb` from the [latest release](https://github.com/Polypane/agent-plugins/releases/latest) and open it.
- **Cursor**: add this repo as a plugin marketplace, then install the Polypane plugin.
- **Codex**: add this repo as a plugin marketplace, then install the Polypane plugin.

## Requirements

You need [Polypane](https://polypane.app) 32 or newer, with Settings → Automation turned on. New to Polypane? [Start a free trial](https://polypane.app).

The plugins run Polypane from its default location: `/Applications/Polypane.app` (or `~/Applications`) on macOS, `/opt/Polypane` on Linux and `C:\Program Files\Polypane` on Windows.

The Claude Code plugin and the Claude Desktop bundle work on macOS, Linux and Windows. The Cursor and Codex plugins cover macOS and Linux for now. On Windows with those two, with an AppImage or with Polypane in another location, use "Connect an AI tool" in Polypane's Automation settings, which writes the exact path for every client.

Use a plugin or "Connect an AI tool", not both: with both active, every Polypane tool shows up twice.
