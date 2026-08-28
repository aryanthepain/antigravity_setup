const fs = require('fs');
const path = require('path');

const configDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.gemini', 'config');
const archiveDir = path.join(configDir, '.archive');
const archivePluginsDir = path.join(archiveDir, 'plugins');
const archiveSkillsGcpDir = path.join(archiveDir, 'skills_gcp');

// Ensure directories exist
fs.mkdirSync(archivePluginsDir, { recursive: true });
fs.mkdirSync(archiveSkillsGcpDir, { recursive: true });

// 1. Plugins to archive
const pluginsToArchive = [
  'science',
  'flutter',
  'data-agent-kit-plugin',
  'chrome-devtools-plugin'
];

console.log('=== Archiving Plugins ===');
pluginsToArchive.forEach(pluginName => {
  const src = path.join(configDir, 'plugins', pluginName);
  const dest = path.join(archivePluginsDir, pluginName);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) {
      console.log(`Destination already exists for ${pluginName}, skipping move.`);
    } else {
      fs.renameSync(src, dest);
      console.log(`Moved plugin ${pluginName} -> .archive/plugins/${pluginName}`);
    }
  } else {
    console.log(`Plugin ${pluginName} not found at source.`);
  }
});

// 2. GCP / BigQuery skills to archive
const gcpSkills = [
  'accidental-data-loss-prevention',
  'bigquery-ai-ml',
  'bigquery-bigframes',
  'bigquery-data-transfer-service',
  'bigquery-graph',
  'bigquery-sql',
  'building-data-apps',
  'data-autocleaning',
  'dataform-bigquery',
  'dbt-bigquery',
  'discovering-gcp-data-assets',
  'enforcing-resource-attribution',
  'federate-lakehouse-catalog',
  'gcloud-auth-verification',
  'gcp-composer-troubleshooting',
  'gcp-data-pipelines',
  'gcp-dataflow',
  'gcp-managed-airflow-dag-authoring',
  'gcp-managed-airflow-migrations',
  'gcp-managed-airflow-recommendations',
  'gcp-pipeline-orchestration',
  'gcp-pipeline-resource-provisioning',
  'gcp-spark',
  'gcs-security-assessment',
  'google-cloud-storage-basics',
  'managing-python-dependencies',
  'ml-best-practices',
  'notebook-guidance'
];

console.log('\n=== Archiving GCP / BigQuery Skills ===');
gcpSkills.forEach(skillName => {
  const src = path.join(configDir, 'skills', skillName);
  const dest = path.join(archiveSkillsGcpDir, skillName);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dest)) {
      console.log(`Destination already exists for ${skillName}, skipping move.`);
    } else {
      fs.renameSync(src, dest);
      console.log(`Moved skill ${skillName} -> .archive/skills_gcp/${skillName}`);
    }
  } else {
    console.log(`Skill ${skillName} not found at source.`);
  }
});

// 3. Update config.json to disable archived plugins
console.log('\n=== Updating config.json ===');
const configJsonPath = path.join(configDir, 'config.json');
if (fs.existsSync(configJsonPath)) {
  const config = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
  if (config.plugins) {
    pluginsToArchive.forEach(p => {
      if (config.plugins[p]) {
        config.plugins[p].enabled = false;
      }
    });
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Successfully updated config.json with archived plugins disabled.');
  }
}

// 4. Create a restore script
const restoreScriptContent = `// Restore script to unarchive plugins and skills
const fs = require('fs');
const path = require('path');

const configDir = path.join(process.env.USERPROFILE || process.env.HOME || '', '.gemini', 'config');
const archiveDir = path.join(configDir, '.archive');
const archivePluginsDir = path.join(archiveDir, 'plugins');
const archiveSkillsGcpDir = path.join(archiveDir, 'skills_gcp');

// Restore plugins
if (fs.existsSync(archivePluginsDir)) {
  fs.readdirSync(archivePluginsDir).forEach(item => {
    const src = path.join(archivePluginsDir, item);
    const dest = path.join(configDir, 'plugins', item);
    if (!fs.existsSync(dest)) {
      fs.renameSync(src, dest);
      console.log(\`Restored plugin: \${item}\`);
    }
  });
}

// Restore skills
if (fs.existsSync(archiveSkillsGcpDir)) {
  fs.readdirSync(archiveSkillsGcpDir).forEach(item => {
    const src = path.join(archiveSkillsGcpDir, item);
    const dest = path.join(configDir, 'skills', item);
    if (!fs.existsSync(dest)) {
      fs.renameSync(src, dest);
      console.log(\`Restored skill: \${item}\`);
    }
  });
}

// Re-enable in config.json
const configJsonPath = path.join(configDir, 'config.json');
if (fs.existsSync(configJsonPath)) {
  const config = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
  if (config.plugins) {
    Object.keys(config.plugins).forEach(p => {
      config.plugins[p].enabled = true;
    });
    fs.writeFileSync(configJsonPath, JSON.stringify(config, null, 2), 'utf8');
    console.log('Re-enabled all plugins in config.json.');
  }
}
console.log('All customizations restored successfully.');
`;

fs.writeFileSync(path.join(archiveDir, 'restore.js'), restoreScriptContent, 'utf8');
console.log('\nCreated restore utility at ~/.gemini/config/.archive/restore.js');
