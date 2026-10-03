// Content-based URLs make long browser caching safe after every deployment.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
for (const asset of ['styles.css', 'drop-one.js', 'site-init.js']) {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, asset))).digest('hex').slice(0, 12);
  const pattern = new RegExp('/' + asset.replace('.', '\\.') + '(?:\\?v=[a-zA-Z0-9-]+)?(?=["\\\'])', 'g');
  for (const file of fs.readdirSync(root).filter(f => f.endsWith('.html'))) {
    const p = path.join(root, file);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(pattern, '/' + asset + '?v=' + hash));
  }
}
console.log('Updated CSS and JavaScript URLs with content hashes.');
