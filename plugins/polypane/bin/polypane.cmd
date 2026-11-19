@echo off
rem Starts Polypane's MCP server from its install folder on Windows. macOS and Linux use the polypane script.
if not exist "%ProgramFiles%\Polypane\Polypane.exe" (
  echo Polypane is not installed: install it from polypane.app. 1>&2
  exit /b 1
)
"%ProgramFiles%\Polypane\Polypane.exe" %*
