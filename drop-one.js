(() => {
  'use strict';
  const garments = {
    baby: {name: 'Baby Bodysuit', price: 22, sizes: ['Newborn', '0–3M', '3–6M', '6–12M', '12–18M', '18–24M']},
    toddler: {name: 'Toddler Tee', price: 24, sizes: ['2T', '3T', '4T', '5T']},
    youth: {name: 'Youth Tee', price: 26, sizes: ['Youth XS', 'Youth S', 'Youth M', 'Youth L', 'Youth XL']}
  };
  const designs = [...document.querySelectorAll('.shop-card')].map(card => card.dataset.design);
  const colors = ['Black', 'Natural / Cream'];
  const key = 'harvie-drop-one-v1';
  const money = value => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value);
  let items = [];
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) items = saved.filter(item => item && designs.includes(item.design) && garments[item.garment] && garments[item.garment].sizes.includes(item.size) && colors.includes(item.color) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20);
  } catch (_) { /* Shopping remains usable with storage disabled. */ }
  const form = document.getElementById('preorder-form');
  const button = document.getElementById('send-preorder');
  const status = document.getElementById('preorder-status');
  function render() {
    const list = document.getElementById('preorder-items');
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-bag';
      empty.textContent = 'Your preorder is waiting for a little personality. Add a design above to get started.';
      list.append(empty);
    }
    let total = 0;
    items.forEach((item, index) => {
      const garment = garments[item.garment];
      total += garment.price * item.quantity;
      const row = document.createElement('div'); row.className = 'bag-item';
      const info = document.createElement('div');
      const name = document.createElement('strong'); name.textContent = item.design;
      const detail = document.createElement('p'); detail.textContent = `${garment.name} · ${item.size} · ${item.color} · Qty ${item.quantity}`;
      const price = document.createElement('span'); price.textContent = money(garment.price * item.quantity);
      info.append(name, detail, price);
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-item'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${item.design}, ${item.size}, ${item.color}`);
      remove.addEventListener('click', () => { items.splice(index, 1); render(); });
      row.append(info, remove); list.append(row);
    });
    document.getElementById('bag-count').textContent = `(${items.reduce((sum, item) => sum + item.quantity, 0)})`;
    document.getElementById('preorder-total').textContent = money(total);
    document.getElementById('order-subtotal').value = money(total);
    document.getElementById('order-items').value = items.map(item => `${item.quantity} x ${item.design} | ${garments[item.garment].name} | ${item.size} | ${item.color} | ${money(garments[item.garment].price * item.quantity)}`).join('\n');
    button.disabled = !items.length;
    try { localStorage.setItem(key, JSON.stringify(items)); } catch (_) {}
  }
  document.querySelectorAll('.shop-card').forEach(card => {
    const options = card.querySelector('form');
    const garment = card.querySelector('.garment');
    const size = card.querySelector('.size');
    garment.addEventListener('change', () => {
      const selected = garments[garment.value];
      size.replaceChildren(new Option('Choose size', ''), ...selected.sizes.map(value => new Option(value, value)));
      card.querySelector('.product-price').textContent = money(selected.price);
      card.querySelector('button').textContent = `Add to preorder · ${money(selected.price)}`;
      card.querySelector('.card-feedback').textContent = '';
    });
    options.addEventListener('submit', event => {
      event.preventDefault();
      if (!options.reportValidity()) return;
      const item = {design: card.dataset.design, garment: garment.value, size: size.value, color: card.querySelector('.color').value, quantity: Number(card.querySelector('.quantity').value)};
      const same = items.find(existing => ['design', 'garment', 'size', 'color'].every(key => existing[key] === item[key]));
      if (same && same.quantity + item.quantity > 20) {
        card.querySelector('.card-feedback').textContent = 'For more than 20 of this option, include the quantity in your preorder notes.'; return;
      }
      if (same) same.quantity += item.quantity; else items.push(item);
      render();
      const feedback = card.querySelector('.card-feedback'); feedback.replaceChildren(document.createTextNode('Added! '));
      const link = document.createElement('a'); link.href = '#preorder'; link.textContent = 'Review your preorder →'; feedback.append(link);
    });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!items.length || !form.reportValidity()) return;
    button.disabled = true; button.textContent = 'Sending your request…'; status.textContent = '';
    try {
      const response = await fetch('/', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(new FormData(form)).toString()});
      if (!response.ok) throw new Error('Request failed');
      try { localStorage.removeItem(key); } catch (_) {}
      window.location.assign('/preorder-thanks.html');
    } catch (_) {
      status.textContent = 'Your request could not be sent. Your selections are saved in this browser. Please try again, or contact Harvie Wilder Co. on Facebook.';
      button.disabled = false; button.textContent = 'Send preorder request';
    }
  });
  render();
})();
