import fs from 'fs';
import path from 'path';

export default class ArabicReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'playwright-report/تقرير-الفحص.html';
    this.results = [];
    this.startTime = Date.now();
  }

  onBegin(config, suite) {
    this.totalTests = suite.allTests().length;
    this.startTime = Date.now();
  }

  onTestEnd(test, result) {
    const titlePath = test.titlePath();
    const suiteName = titlePath[1] || 'عام';
    const testTitle = test.title;
    const projectName = test.parent?.project()?.name || 'عام';
    const status = result.status; // 'passed' | 'failed' | 'timedOut' | 'skipped'
    const duration = (result.duration / 1000).toFixed(2);
    const error = result.error ? result.error.message : null;

    this.results.push({
      suiteName,
      testTitle,
      projectName,
      status,
      duration,
      error
    });
  }

  onEnd(result) {
    const totalDuration = ((Date.now() - this.startTime) / 1000).toFixed(1);
    const passed = this.results.filter((r) => r.status === 'passed').length;
    const failed = this.results.filter((r) => r.status === 'failed' || r.status === 'timedOut').length;
    const skipped = this.results.filter((r) => r.status === 'skipped').length;
    const total = this.results.length;
    const passPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تقرير فحص جودة واجهة المستخدم - عالم الأطفال</title>
  <style>
    :root {
      --brand-green: #0d9488;
      --brand-green-dark: #0f766e;
      --brand-dark: #1e293b;
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --success: #16a34a;
      --success-bg: #dcfce7;
      --danger: #dc2626;
      --danger-bg: #fee2e2;
      --skipped: #d97706;
      --skipped-bg: #fef3c7;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 24px;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    header {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px 32px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-title h1 {
      font-size: 24px;
      font-weight: 800;
      color: var(--brand-green-dark);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-title p {
      color: var(--text-muted);
      font-size: 14px;
      margin-top: 4px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
    }
    .badge-success { background: var(--success-bg); color: var(--success); }
    .badge-danger { background: var(--danger-bg); color: var(--danger); }
    .badge-skipped { background: var(--skipped-bg); color: var(--skipped); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }
    .stat-number {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 6px;
    }
    .stat-label {
      color: var(--text-muted);
      font-size: 13px;
      font-weight: 600;
    }

    .table-container {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
    }
    .table-header {
      padding: 20px 24px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .table-header h2 {
      font-size: 18px;
      font-weight: 700;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: right;
    }
    th {
      background: #f1f5f9;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 12px 24px;
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 14px 24px;
      border-bottom: 1px solid var(--border);
      font-size: 14px;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: #f8fafc;
    }
    .suite-tag {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: var(--text-muted);
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
    }
    .project-tag {
      font-size: 12px;
      color: var(--brand-green-dark);
      font-weight: 600;
    }
    .error-box {
      margin-top: 8px;
      padding: 8px 12px;
      background: var(--danger-bg);
      color: var(--danger);
      border-radius: 6px;
      font-size: 12px;
      font-family: monospace;
      direction: ltr;
      text-align: left;
    }
    footer {
      text-align: center;
      color: var(--text-muted);
      font-size: 13px;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="header-title">
        <h1>تقرير فحص جودة واجهة المستخدم (E2E Test Report)</h1>
        <p>مشروع عالم الأطفال • تم الفحص آلياً عبر Playwright بتاريخ ${new Date().toLocaleDateString('ar-EG')} - ${new Date().toLocaleTimeString('ar-EG')}</p>
      </div>
      <div>
        <span class="badge ${failed === 0 ? 'badge-success' : 'badge-danger'}">
          ${failed === 0 ? '✓ اجتازت جميع الاختبارات بنجاح' : `✕ يوجد ${failed} اختبار غير ناجح`}
        </span>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number" style="color: var(--brand-dark);">${total}</div>
        <div class="stat-label">إجمالي الفحوصات</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--success);">${passed}</div>
        <div class="stat-label">الفحوصات الناجحة</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--danger);">${failed}</div>
        <div class="stat-label">الفحوصات الفاشلة</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--brand-green);">${passPercentage}%</div>
        <div class="stat-label">نسبة النجاح</div>
      </div>
      <div class="stat-card">
        <div class="stat-number" style="color: var(--text-muted);">${totalDuration} ث</div>
        <div class="stat-label">زمن الفحص الإجمالي</div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-header">
        <h2>تفاصيل نتائج الاختبارات الفردية</h2>
        <span class="badge badge-success">${passed} / ${total} ناجح</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>حالة الفحص</th>
            <th>عنوان الاختبار والوحدة</th>
            <th>بيئة التشغيل</th>
            <th>المدة المستغرقة</th>
          </tr>
        </thead>
        <tbody>
          ${this.results
            .map(
              (r) => `
          <tr>
            <td>
              <span class="badge ${r.status === 'passed' ? 'badge-success' : r.status === 'skipped' ? 'badge-skipped' : 'badge-danger'}">
                ${r.status === 'passed' ? 'ناجح' : r.status === 'skipped' ? 'مستثنى' : 'فاشل'}
              </span>
            </td>
            <td>
              <div><span class="suite-tag">${r.suiteName}</span></div>
              <div style="font-weight: 600;">${r.testTitle}</div>
              ${r.error ? `<div class="error-box">${r.error}</div>` : ''}
            </td>
            <td>
              <span class="project-tag">${r.projectName}</span>
            </td>
            <td style="color: var(--text-muted); font-size: 13px;">${r.duration} ثانية</td>
          </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>

    <footer>
      نظام الفحص الآلي المستمر E2E • عالم الأطفال Kids World
    </footer>
  </div>
</body>
</html>`;

    try {
      const outPath = path.resolve(process.cwd(), this.outputFile);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, html, 'utf8');

      // Also copy to root for quick access
      const rootPath = path.resolve(process.cwd(), 'تقرير-الفحص.html');
      fs.writeFileSync(rootPath, html, 'utf8');
    } catch (e) {
      console.error('Failed to write Arabic report:', e);
    }
  }
}
