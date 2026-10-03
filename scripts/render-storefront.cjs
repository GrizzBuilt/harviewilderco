// Keep crawlable HTML in sync with the existing storefront renderer.
// Run after changing designs, garment options, pricing, or card markup.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'drop-one.js'), 'utf8');
const marker = '  try {\n    localStorage.removeItem(legacyKey);';
const end = source.indexOf(marker);
if (end < 0) throw new Error('Storefront renderer boundary changed; update this script.');
const slots = Object.fromEntries(['#drop-preview .container', '.launch-facts', '#size-guide .product-grid'].map(key => [key, {}]));
const style = {};
vm.runInNewContext(source.slice(0, end) + '\n})();', {
  document: {querySelector: selector => slots[selector] || null, createElement: () => style, head: {append: () => {}}}
});
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
html = html.replace(/(<section class="section drop-preview-section" id="drop-preview"><div class="container">)[\s\S]*?(<\/div><\/section>\s*<section class="section preorder-section")/, (_, start, finish) => start + slots['#drop-preview .container'].innerHTML.replace(/<button class="button button-primary" type="submit">/g, '<button class="button button-primary" type="submit" disabled>') + finish);
html = html.replace(/(<div class="launch-facts">)[\s\S]*?(<\/div><\/div><\/section>)/, (_, start, finish) => start + slots['.launch-facts'].innerHTML + finish);
html = html.replace(/(<section class="section" id="size-guide">[\s\S]*?<div class="product-grid">)[\s\S]*?(<\/div><div class="drop-faq">)/, (_, start, finish) => start + slots['#size-guide .product-grid'].innerHTML + finish);
if ((html.match(/class="garment-card shop-card"/g) || []).length !== 16) throw new Error('Expected sixteen static garment cards.');
fs.writeFileSync(path.join(root, 'index.html'), html.split('\n').map(line => line.trimEnd()).join('\n'));
// The runtime uses the same styles; expose them before JavaScript runs as well.
let css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
css = css.replace(/\n\/\* Static storefront cards \*\/[\s\S]*?\/\* End static storefront cards \*\/\n/g, '\n');
fs.writeFileSync(path.join(root, 'styles.css'), css.trimEnd() + '\n/* Static storefront cards */\n' + style.textContent.split('\n').map(line => line.trimEnd()).join('\n') + '\n/* End static storefront cards */\n');
console.log('Rendered current storefront cards, prices and sizing into initial HTML.');
