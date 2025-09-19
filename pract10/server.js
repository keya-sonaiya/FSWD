const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const logFilePath = path.join(__dirname, 'logs', 'error.txt');

app.get('/', (req, res) => {
  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      let message = 'An error occurred while reading the log file.';

      if (err.code === 'ENOENT') {
        message = 'Log file not found.';
      } else if (err.code === 'EACCES') {
        message = 'Permission denied to read the log file.';
      }

      return res.status(500).send(`<h2>${message}</h2><pre>${err.message}</pre>`);
    }

    res.send(`
      <h1>Server Log</h1>
      <pre style="background:#f4f4f4;padding:10px;border:1px solid #ccc;">${escapeHtml(data)}</pre>
    `);
  });
});

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[char]));
}

app.listen(PORT, () => {
  console.log(`Log viewer running at http://localhost:${PORT}`);
});
