// Checks every manifest: valid JSON, the fields each format needs, files that exist, and one version everywhere.
import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const read = file => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
    return {};
  }
};
const need = (file, object, fields) =>
  fields.filter(field => object[field] === undefined).forEach(field => errors.push(`${file}: missing "${field}"`));
const exists = (file, relative) => {
  const resolved = path.resolve(path.dirname(file), relative);
  if (!fs.existsSync(resolved)) {
    errors.push(`${file}: ${relative} doesn't exist`);
  }
};

const plugin = 'plugins/polypane';
const manifests = {
  claude: `${plugin}/.claude-plugin/plugin.json`,
  cursor: `${plugin}/.cursor-plugin/plugin.json`,
  codex: `${plugin}/.codex-plugin/plugin.json`,
};
const versions = new Set();

Object.entries(manifests).forEach(([format, file]) => {
  const manifest = read(file);
  need(file, manifest, ['name', 'version', 'description', 'mcpServers']);
  versions.add(manifest.version);
  // Paths in plugin manifests are relative to the plugin folder.
  if (manifest.mcpServers) {
    exists(`${plugin}/x`, manifest.mcpServers);
    const servers = read(path.join(plugin, manifest.mcpServers)).mcpServers ?? {};
    const polypane = servers.polypane;
    if (!polypane?.args?.includes('--mcp')) {
      errors.push(`${manifest.mcpServers}: the polypane server doesn't pass --mcp`);
    } else if (!polypane.args.includes(`--client=${format === 'claude' ? 'claude-code' : format}`)) {
      errors.push(`${manifest.mcpServers}: the polypane server should pass --client for ${format}`);
    }
  }
  if (manifest.logo) {
    exists(`${plugin}/x`, manifest.logo);
  }
});

['.claude-plugin/marketplace.json', '.cursor-plugin/marketplace.json'].forEach(file => {
  const marketplace = read(file);
  need(file, marketplace, ['name', 'owner', 'plugins']);
  (marketplace.plugins ?? []).forEach(entry => exists(file.replace(/[^/]+\/[^/]+$/, 'x'), entry.source));
  versions.add(marketplace.metadata?.version);
});

const codexMarketplace = read('.agents/plugins/marketplace.json');
(codexMarketplace.plugins ?? []).forEach(entry => exists('x', entry.source?.path));

const bundle = read('claude-desktop/manifest.json');
need('claude-desktop/manifest.json', bundle, ['manifest_version', 'name', 'version', 'description', 'author', 'server']);
exists('claude-desktop/manifest.json', bundle.icon ?? 'icon.png');
versions.add(bundle.version);

const registry = read('server.json');
need('server.json', registry, ['name', 'description', 'version', 'packages']);
versions.add(registry.version);

if (!fs.existsSync(`${plugin}/skills/polypane/SKILL.md`)) {
  errors.push('The skill is missing: run npm run sync-skill.');
}
if (versions.size > 1) {
  errors.push(`Versions differ: ${[...versions].join(', ')}`);
}

if (errors.length) {
  console.error(errors.map(error => `✗ ${error}`).join('\n'));
  process.exit(1);
}
console.log(`✓ All manifests valid (version ${[...versions][0]})`);
