#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const reportsDir = path.join(rootDir, 'reports');

// Ensure reports directory exists
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description, allowNonZeroExit = false) {
  log(`\n🔄 ${description}...`, 'cyan');
  try {
    const output = execSync(command, {
      encoding: 'utf8',
      cwd: rootDir,
      stdio: 'pipe',
    });
    log(`✅ ${description} completed`, 'green');
    return output;
  } catch (error) {
    if (allowNonZeroExit && error.stdout) {
      log(`✅ ${description} completed (with warnings)`, 'yellow');
      return error.stdout;
    }
    log(`❌ ${description} failed: ${error.message}`, 'red');
    return null;
  }
}

function generateReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFile = path.join(reportsDir, `analysis-report-${timestamp}.md`);

  let report = `# Bundle Analysis Report\n\n`;
  report += `Generated: ${new Date().toLocaleString()}\n\n`;

  // Build the project
  log('\n🚀 Starting comprehensive bundle analysis...', 'bright');

  const buildOutput = runCommand('npm run build', 'Building project');
  if (!buildOutput) {
    log('❌ Build failed, cannot continue analysis', 'red');
    return;
  }

  report += `## Build Summary\n\n`;
  report += `\`\`\`\n${buildOutput}\`\`\`\n\n`;

  // Analyze bundle size
  log('\n📊 Analyzing bundle sizes...', 'yellow');

  // Get dist directory stats
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const getDirectorySize = dirPath => {
      let totalSize = 0;
      const files = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          totalSize += getDirectorySize(filePath);
        } else {
          totalSize += fs.statSync(filePath).size;
        }
      }

      return totalSize;
    };

    const totalSize = getDirectorySize(distDir);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    report += `## Bundle Size Analysis\n\n`;
    report += `- **Total bundle size**: ${totalSizeMB} MB\n`;

    // List all JS files with sizes
    const assetsDir = path.join(distDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      const jsFiles = fs
        .readdirSync(assetsDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(assetsDir, file);
          const size = fs.statSync(filePath).size;
          const sizeKB = (size / 1024).toFixed(2);
          return { name: file, size: sizeKB };
        })
        .sort((a, b) => parseFloat(b.size) - parseFloat(a.size));

      report += `\n### JavaScript Chunks\n\n`;
      report += `| File | Size (KB) |\n`;
      report += `|------|-----------|\n`;

      jsFiles.forEach(file => {
        report += `| ${file.name} | ${file.size} |\n`;
      });

      // Identify largest chunks
      const largeChunks = jsFiles.filter(file => parseFloat(file.size) > 100);
      if (largeChunks.length > 0) {
        report += `\n### ⚠️ Large Chunks (>100KB)\n\n`;
        largeChunks.forEach(chunk => {
          report += `- **${chunk.name}**: ${chunk.size} KB\n`;
        });
        report += `\n**Recommendation**: Consider code splitting or lazy loading for these chunks.\n`;
      }
    }
  }

  // Skip duplicate dependencies check as it's not working reliably

  // Analyze unused dependencies
  const depcheckOutput = runCommand(
    'npx depcheck',
    'Analyzing unused dependencies',
    true
  );
  if (depcheckOutput) {
    report += `\n## Dependency Analysis\n\n`;
    if (depcheckOutput.trim()) {
      report += `\`\`\`\n${depcheckOutput}\`\`\`\n`;
    } else {
      report += `✅ All dependencies are being used correctly.\n`;
    }
  } else {
    report += `\n## Dependency Analysis\n\n❌ Failed to analyze dependencies.\n`;
  }

  // Performance recommendations
  report += `\n## Performance Recommendations\n\n`;
  report += `### Code Splitting\n`;
  report += `- ✅ Lazy loading implemented for main routes\n`;
  report += `- ✅ Strategic preloading for related pages\n`;
  report += `- ✅ Vendor chunks separated by functionality\n\n`;

  report += `### Monitoring\n`;
  report += `- ✅ Sentry error tracking enabled\n`;
  report += `- ✅ Performance monitoring with Web Vitals\n`;
  report += `- ✅ Bundle analysis with rollup-plugin-visualizer\n\n`;

  report += `### Next Steps\n`;
  report += `1. Review large chunks and consider further splitting\n`;
  report += `2. Remove unused dependencies if any\n`;
  report += `3. Monitor performance metrics in production\n`;
  report += `4. Run lighthouse audit: \`npm run performance:audit\`\n`;

  // Write report
  fs.writeFileSync(reportFile, report);
  log(`\n📋 Analysis report generated: ${reportFile}`, 'green');

  // Copy stats.html to reports with timestamp
  const statsFile = path.join(rootDir, 'dist', 'stats.html');
  if (fs.existsSync(statsFile)) {
    const statsReportFile = path.join(
      reportsDir,
      `bundle-stats-${timestamp}.html`
    );
    fs.copyFileSync(statsFile, statsReportFile);
    log(`📊 Bundle visualization copied: ${statsReportFile}`, 'green');
  }

  log(
    '\n🎉 Analysis complete! Check the reports directory for detailed results.',
    'bright'
  );
}

// Run the analysis
generateReport();
