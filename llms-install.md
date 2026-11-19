# Installing Polypane's MCP server

Polypane's MCP server is built into the Polypane desktop app (version 32 or newer). There is no package to download: the AI tool starts the installed app with `--mcp`, and that connects to the running Polypane.

## Before you start

1. Polypane must be installed. If it isn't, ask the user to install it from https://polypane.app (it has a free trial). Don't try to install it yourself.
2. In Polypane, the user opens Settings → Automation and turns on **MCP server**.

## The easy way

In Polypane's Automation settings, the user clicks **Connect an AI tool**, picks this tool and follows the steps. Polypane writes the right configuration itself. Prefer this when the user is at their computer.

## By hand

Add a local (stdio) server named `polypane` to the tool's MCP settings, with the command for the user's operating system. Replace `cline` in `--client=` with the name of the tool you're setting up.

macOS:

```json
{
  "mcpServers": {
    "polypane": {
      "command": "/Applications/Polypane.app/Contents/MacOS/Polypane",
      "args": ["--mcp", "--client=cline"]
    }
  }
}
```

Windows:

```json
{
  "mcpServers": {
    "polypane": {
      "command": "C:\\Program Files\\Polypane\\Polypane.exe",
      "args": ["--mcp", "--client=cline"]
    }
  }
}
```

Linux:

```json
{
  "mcpServers": {
    "polypane": {
      "command": "/opt/Polypane/polypane",
      "args": ["--mcp", "--client=cline", "--ozone-platform=headless"]
    }
  }
}
```

If Polypane isn't at that path (an AppImage, or `~/Applications` on macOS), ask the user where it is, or have them use **Connect an AI tool**.

## Check that it works

Call the `get_state` tool. It returns the user's Polypane projects and tabs. If the server fails to start, Polypane isn't running or its MCP server is off: ask the user to check Settings → Automation.

More: https://polypane.app/docs/automation/
