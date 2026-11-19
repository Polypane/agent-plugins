// Copies the Polypane agent skill (the SKILL.md at SKILL_SOURCE) into the plugin.
// Polypane fills in the CLI path when it installs the skill itself; the plugin's copy says where to find it.
// With --check it writes nothing and fails when the plugin's copy is out of date.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = process.env.SKILL_SOURCE;
if (!source) {
  console.error('✗ Set SKILL_SOURCE to the SKILL.md that ships with Polypane.');
  process.exit(1);
}
// The plugins read the skill from the plugin folder, the Gemini CLI extension from skills/ at the repo root.
const targets = [
  path.join(root, 'plugins', 'polypane', 'skills', 'polypane', 'SKILL.md'),
  path.join(root, 'skills', 'polypane', 'SKILL.md'),
];

const CLI_LINE = 'The same tools work from a shell, with the command for this install: `polypane --mcp`.';
const PLUGIN_CLI_LINE =
  "The same tools work from a shell, with Polypane's executable and `--mcp`: `/Applications/Polypane.app/Contents/MacOS/Polypane --mcp` on macOS, `/opt/Polypane/polypane --mcp` on Linux, `\"C:\\Program Files\\Polypane\\Polypane.exe\" --mcp` on Windows. Below it's written as `polypane --mcp`.";

const skill = fs.readFileSync(source, 'utf8');
if (!skill.includes(CLI_LINE)) {
  throw new Error(`The skill's CLI line changed; update CLI_LINE in ${path.basename(import.meta.filename)}.`);
}
const pluginSkill = skill.replace(CLI_LINE, PLUGIN_CLI_LINE);

if (process.argv.includes('--check')) {
  if (targets.some(target => !fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== pluginSkill)) {
    console.error("✗ The plugins' skill is out of date.");
    process.exit(1);
  }
  console.log("✓ The plugins' skill is up to date");
} else {
  targets.forEach(target => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, pluginSkill);
  });
  console.log(`Copied the skill from ${source}`);
}
