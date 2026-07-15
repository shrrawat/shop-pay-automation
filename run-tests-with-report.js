const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rawTestCaseId = (process.env.TEST_CASE_ID || '').trim();
const testCaseIds = rawTestCaseId
  .split(',')
  .map((id) => id.trim().replace(/^@+/, ''))
  .filter(Boolean);
const tagFilter = testCaseIds.length
  ? testCaseIds.map((id) => `@${id}`).join(' or ')
  : '';
const safeTestCaseId = testCaseIds.join('_').replace(/[^a-zA-Z0-9-_]/g, '');
const now = new Date();
const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
const runFolderName = safeTestCaseId ? `${safeTestCaseId}_${timestamp}` : `run_${timestamp}`;
const runFolderPath = path.join(__dirname, 'htmlreports', runFolderName);
const reportDir = path.join(runFolderPath, 'report');
const screenshotsDir = path.join(runFolderPath, 'screenshots');
const reportDirRelative = path.join('htmlreports', runFolderName, 'report');
const screenshotsDirRelative = path.join('htmlreports', runFolderName, 'screenshots');
const jsonOutputPath = path.join(reportDirRelative, 'cucumber-report.json');
const htmlOutputPath = path.join(reportDirRelative, 'cucumber-report.html');
const jsonOutputPathAbsolute = path.join(reportDir, 'cucumber-report.json');
const htmlReportsRoot = path.join(__dirname, 'htmlreports');
const retentionRaw = (process.env.REPORT_RUNS_TO_KEEP || '500').trim();
const retentionCount = Number.parseInt(retentionRaw, 10);

function cleanupOldRunFolders(rootDir, keepCount) {
  if (!Number.isInteger(keepCount) || keepCount < 1) {
    console.log('Run-folder cleanup skipped: REPORT_RUNS_TO_KEEP must be >= 1');
    return;
  }

  if (!fs.existsSync(rootDir)) {
    return;
  }

  const entries = fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fullPath = path.join(rootDir, entry.name);
      const hasReportDir = fs.existsSync(path.join(fullPath, 'report'));
      const hasScreenshotsDir = fs.existsSync(path.join(fullPath, 'screenshots'));

      if (!hasReportDir || !hasScreenshotsDir) {
        return null;
      }

      return {
        name: entry.name,
        fullPath,
        mtimeMs: fs.statSync(fullPath).mtimeMs,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  const foldersToDelete = entries.slice(keepCount);
  for (const folder of foldersToDelete) {
    fs.rmSync(folder.fullPath, { recursive: true, force: true });
    console.log(`Deleted old run folder: ${folder.name}`);
  }

  if (foldersToDelete.length > 0) {
    console.log(`Retention applied: kept latest ${keepCount} run folders in htmlreports`);
  }
}

fs.mkdirSync(reportDir, { recursive: true });
fs.mkdirSync(screenshotsDir, { recursive: true });

console.log(`Run artifacts will be stored in: ${runFolderPath}`);

const runEnv = {
  ...process.env,
  REPORT_RUN_FOLDER: runFolderName,
  REPORT_OUTPUT_PATH: htmlOutputPath,
  CUCUMBER_JSON_PATH: jsonOutputPath,
  SCREENSHOTS_DIR: screenshotsDirRelative,
};

const cucumberArgs = tagFilter
  ? ['cucumber-js', '--tags', tagFilter]
  : ['cucumber-js'];

const cucumberResult = spawnSync('npx', cucumberArgs, {
  stdio: 'inherit',
  shell: true,
  env: runEnv,
});

let reportResult = { status: 0 };
if (fs.existsSync(jsonOutputPathAbsolute)) {
  reportResult = spawnSync(process.execPath, [path.join(__dirname, 'generate-html-report.js')], {
    stdio: 'inherit',
    env: runEnv,
  });
} else {
  console.log(`Skipping HTML report generation: JSON report not found at ${jsonOutputPathAbsolute}`);
}

const finalStatus = reportResult.status !== 0
  ? (reportResult.status || 1)
  : (cucumberResult.status || 1);

cleanupOldRunFolders(htmlReportsRoot, retentionCount);

process.exit(finalStatus);
