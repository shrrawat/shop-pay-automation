const fs = require('fs');
const path = require('path');
const reporter = require('multiple-cucumber-html-reporter');

const reportsDir = path.join(__dirname, 'reports');
const htmlReportsDir = path.join(__dirname, 'htmlreports');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getLatestJsonReport() {
  if (!fs.existsSync(reportsDir)) {
    throw new Error('Reports folder not found. Run tests first.');
  }

  const files = fs
    .readdirSync(reportsDir)
    .filter((name) => /^cucumber-report_\d{4}-\d{2}-\d{2}_\d{6}\.json$/.test(name))
    .map((name) => ({
      name,
      fullPath: path.join(reportsDir, name),
      mtimeMs: fs.statSync(path.join(reportsDir, name)).mtimeMs,
    }))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (files.length === 0) {
    throw new Error('No timestamped cucumber JSON report found in reports folder.');
  }

  return files[0];
}

function generate() {
  const testCaseId = (process.env.TEST_CASE_ID || '').trim();
  const safeTestCaseId = testCaseId.replace(/[^a-zA-Z0-9-_]/g, '');
  const explicitJsonPath = (process.env.CUCUMBER_JSON_PATH || '').trim();
  const explicitHtmlPath = (process.env.REPORT_OUTPUT_PATH || '').trim();
  const explicitScreenshotsDir = (process.env.SCREENSHOTS_DIR || '').trim();

  let jsonFile;
  let htmlOutput;
  let screenshotsDirectory;

  if (explicitJsonPath && explicitHtmlPath) {
    jsonFile = path.resolve(path.normalize(explicitJsonPath));
    htmlOutput = path.resolve(path.normalize(explicitHtmlPath));
    screenshotsDirectory = explicitScreenshotsDir
      ? path.resolve(path.normalize(explicitScreenshotsDir))
      : path.join(path.dirname(path.dirname(htmlOutput)), 'screenshots');
  } else {
    ensureDir(htmlReportsDir);
    const latestJson = getLatestJsonReport();
    const baseName = path.basename(latestJson.name, '.json');
    const reportFileName = safeTestCaseId ? `${safeTestCaseId}_${baseName}.html` : `${baseName}.html`;
    jsonFile = latestJson.fullPath;
    htmlOutput = path.join(htmlReportsDir, reportFileName);
    screenshotsDirectory = path.join('reports', 'screenshots');
  }

  const reportDir = path.dirname(htmlOutput);

  ensureDir(reportDir);
  ensureDir(screenshotsDirectory);

  const pageTitle = safeTestCaseId
    ? `Shop Pay E2E Report - ${safeTestCaseId}`
    : 'Shop Pay E2E Report';

  reporter.generate({
    jsonDir: path.dirname(jsonFile),
    reportPath: reportDir,
    pageTitle,
    reportName: pageTitle,
    openReportInBrowser: false,
    disableLog: true,
    displayDuration: true,
    metadata: {
      browser: {
        name: 'chromium',
        version: 'local',
      },
      device: 'Local Machine',
      platform: {
        name: process.platform,
        version: process.version,
      },
      customData: {
        title: 'Run info',
        data: [
          ...(safeTestCaseId ? [{ label: 'TestCase', value: safeTestCaseId }] : []),
          { label: 'Screenshots', value: screenshotsDirectory },
        ],
      },
    },
  });

  // Keep compatibility with existing path conventions by redirecting cucumber-report.html to index.html.
  const legacyHtmlPath = htmlOutput;
  const indexHtmlPath = path.join(reportDir, 'index.html');
  const redirectHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=./index.html" />
    <title>Redirecting report...</title>
  </head>
  <body>
    <p>Redirecting to <a href="./index.html">report</a>...</p>
  </body>
</html>`;

  if (fs.existsSync(indexHtmlPath)) {
    fs.writeFileSync(legacyHtmlPath, redirectHtml, 'utf8');
  }

  console.log(`HTML report generated: ${path.join(reportDir, 'index.html')}`);
  console.log(`Compatibility report path: ${legacyHtmlPath}`);
}

generate();
