module.exports = {
  testDir: 'tests',
  timeout: 30000,
  use: {
    headless: true,
    actionTimeout: 0,
    ignoreHTTPSErrors: true,
  },
  reporter: [['list'], ['html', { output: 'test-results/report.html' }]],
};