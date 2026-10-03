(() => {
  'use strict';

  const garmentCatalog = {
    bodysuit: {
      name: 'Baby Bodysuit',
      style: 'RS4400',
      price: 22,
      sizes: ['NB', '06M', '12M', '18M', '24M'],
      colors: ['Banana', 'Black', 'Charcoal', 'Granite Heather', 'Heather', 'Hot Pink', 'Kelly', 'Key Lime', 'Light Blue', 'Navy', 'Orange', 'Pink', 'Purple', 'Red', 'Royal', 'Turquoise', 'White', 'Yellow'],
      note: 'Rabbit Skins Infant Short Sleeve Baby Rib Bodysuit'
    },
    infant: {
      name: 'Infant Tee',
      style: 'CAR54I',
      price: 22,
      sizes: ['06M', '12M', '18M'],
      colors: ['Aquatic Blue', 'Athletic Heather', 'Candy Pink', 'Jet Black', 'Navy', 'Red', 'Royal', 'White', 'Yellow'],
      note: 'Port & Co Infant Core Cotton Tee '
    },
    toddler: {
      name: 'Toddler Tee',
      style: 'CAR54T',
      price: 24,
      sizes: ['2T', '3T', '4T'],
      colors: ['Aquatic Blue', 'Athletic Heather', 'Candy Pink', 'Clover Green', 'Jet Black', 'Lime', 'Navy', 'Purple', 'Red', 'Royal', 'Sangria', 'White', 'Yellow'],
      note: 'Port & Co Toddler Core Cotton Tee'
    },
    youth: {
      name: 'Youth Tee',
      style: 'PC54Y',
      price: 26,
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Aquatic Blue', 'Ash', 'Athletic Heather', 'Athletic Maroon', 'Black Heather', 'Bright Aqua', 'Candy Pink', 'Cardinal', 'Carolina Blue', 'Charcoal', 'Cherry Blossom', 'Clover Green', 'Coral', 'Coyote Brown', 'Dark Chocolate Brown', 'Dark Green'],
      note: 'Port & Co Youth Core Cotton Tee'
    }
  };

  const designs = [
    {
      name: 'Wild Little Soul',
      slug: 'wild-little-soul',
      image: '/assets/drop-one/wild-little-soul.webp',
      description: 'For the barefoot explorers and beautifully untamed little hearts.'
    },
    {
      name: 'Snack Goblin',
      slug: 'snack-goblin',
      image: '/assets/drop-one/snack-goblin.webp',
      description: 'Big snack energy. Tiny crumbs everywhere. You know the one.'
    },
    {
      name: 'Moon Baby',
      slug: 'moon-baby',
      image: '/assets/drop-one/moon-baby.webp',
      description: 'A little stardust for the dreamers, night owls, and moonlight mischief makers.'
    },
    {
      name: 'Tiny Rocker',
      slug: 'tiny-rocker',
      image: '/assets/drop-one/tiny-rocker.webp',
      description: 'For the next generation of loud little legends. Turn the lullabies up.'
    }
  ];

  // Curated launch colors use each supplier's exact names.
  function launchColors(designName, garmentKey) {
    const bodysuit = garmentKey === 'bodysuit';
    const black = bodysuit ? 'Black' : 'Jet Black';
    if (designName === 'Wild Little Soul') return [black, 'White'];
    if (designName === 'Snack Goblin') return [bodysuit ? 'Heather' : 'Athletic Heather', 'White'];
    if (designName === 'Moon Baby') return [black, bodysuit ? 'Light Blue' : 'Candy Pink'];
    return [black, bodysuit ? 'Pink' : 'Candy Pink'];
  }
  const photoColorCodes = {'Black':'black','Jet Black':'jetblack','White':'white','Heather':'heather','Athletic Heather':'athheather','Light Blue':'lightblue','Pink':'pink','Candy Pink':'candypink'};
  const photoUrl = (garment, color) => `/assets/garments/${garment.style.toLowerCase()}-${photoColorCodes[color]}.webp`;

  const money = value => new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value);
  const storageKey = 'harvie-drop-one-v2';
  const legacyKey = 'harvie-drop-one-v1';
  let items = [];
  let removedSavedOptions = 0;

  const styles = document.createElement('style');
  styles.id = 'drop-one-card-styles';
  styles.textContent = `
    .drop-shop-intro{max-width:50rem;margin-bottom:2.5rem}
    .design-product-block{display:grid;gap:1.25rem;margin:0 0 4rem;padding:clamp(1rem,3vw,1.5rem);border:1px solid var(--line);border-radius:calc(var(--radius)*1.15);background:rgb(255 244 223 / 2.5%)}
    .design-card{display:grid;grid-template-columns:minmax(120px,220px) 1fr;gap:clamp(1rem,3vw,2rem);align-items:center;padding:1rem;border:1px solid rgb(255 143 199 / 28%);border-radius:var(--radius);background:var(--panel)}
    .design-card img{width:100%;height:auto;aspect-ratio:1;object-fit:contain;border-radius:1rem;background:#000}
    .design-card h3{font-size:clamp(1.6rem,4vw,2.5rem);margin-bottom:.5rem}
    .design-card p{margin:0;color:var(--taupe)}
    .garment-card-grid{display:grid;gap:1rem}
    .garment-card{display:grid;gap:1rem;padding:1.25rem;border:1px solid var(--line);border-radius:var(--radius);background:var(--panel);box-shadow:inset 0 1px rgb(255 255 255 / 4%)}
    .garment-card-header{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between}
    .garment-card-header h4{margin:0;color:var(--cream);font-size:1.15rem;line-height:1.2}
    .style-number{display:block;margin-top:.3rem;color:var(--blue);font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    .garment-price{color:var(--pink);font-size:1.25rem;font-weight:950;white-space:nowrap}
    .garment-note{margin:0;color:var(--taupe);font-size:.78rem;line-height:1.45}
    .garment-art{display:grid;grid-template-columns:72px 1fr;gap:.85rem;align-items:center;padding:.7rem;border:1px solid var(--line);border-radius:1rem;background:#050505}
    .garment-art img{width:72px;height:72px;object-fit:contain;border-radius:.65rem}
    .garment-art p{margin:0;color:var(--taupe);font-size:.78rem}
    .garment-options{display:grid;gap:.85rem}
    .garment-options .option-pair{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
    .garment-options select,.garment-options input{width:100%}
    .garment-options .button{width:100%}
    .availability-note{margin:.25rem 0 0;color:var(--gold);font-size:.74rem;line-height:1.45}
    .design-divider{height:1px;margin:1rem 0;background:var(--line)}
    @media(min-width:42rem){.garment-card-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(min-width:70rem){.garment-card-grid{grid-template-columns:repeat(4,minmax(0,1fr))}.design-card{grid-template-columns:180px 1fr}}
    @media(max-width:41.99rem){.design-card{grid-template-columns:1fr}.design-card img{max-width:240px;margin-inline:auto}.garment-options .option-pair{grid-template-columns:1fr}}
  `;
  document.head.append(styles);

  function makeOptions(values, placeholder) {
    return `<option value="">${placeholder}</option>${values.map(value => `<option value="${value}">${value}</option>`).join('')}`;
  }

  function garmentCard(design, garmentKey) {
    const garment = garmentCatalog[garmentKey];
    const id = `${design.slug}-${garmentKey}`;
    const colors = launchColors(design.name, garmentKey);
    const photoColor = colors[0];
    return `
      <article id="${id}-card" class="garment-card shop-card" data-design="${design.name}" data-garment="${garmentKey}">
        <div class="garment-card-header">
          <div><h4>${garment.name}</h4><span class="style-number">${garment.style}</span></div>
          <span class="garment-price">${money(garment.price)}</span>
        </div>
        <figure class="garment-photo printed-preview ${garmentKey}">
          <div class="garment-mockup">
            <img class="mockup-blank" src="${photoUrl(garment, photoColor)}" alt="${garment.style} ${garment.name} in ${photoColor}, with ${design.name} print preview" width="493" height="740" loading="lazy" decoding="async">
            <img class="mockup-print" src="${design.image}" alt="" width="1254" height="1254" loading="lazy" decoding="async">
          </div>
          <figcaption>${photoColor} · ${design.name}<span>Print placement preview; final scale varies by size.</span></figcaption>
        </figure>
        <p class="garment-note">${garment.note}</p>
        <form class="garment-options">
          <div class="option-pair">
            <div class="form-field"><label for="${id}-size">Size</label><select id="${id}-size" class="size" required>${makeOptions(garment.sizes, 'Choose size')}</select></div>
            <div class="form-field"><label for="${id}-color">Color</label><select id="${id}-color" class="color" required>${colors.map((color, index) => `<option value="${color}"${index === 0 ? ' selected' : ''}>${color}</option>`).join('')}</select></div>
          </div>
          <div class="form-field"><label for="${id}-quantity">Quantity</label><input id="${id}-quantity" class="quantity" type="number" min="1" max="20" step="1" value="1" required></div>
          <p class="selected-variant" aria-live="polite">Choose a size and color for your ${garment.name.toLowerCase()}.</p>
          <button class="button button-primary" type="submit">Add ${garment.name} · ${money(garment.price)}</button>
          <p class="card-feedback" aria-live="polite"></p>
        </form>
      </article>`;
  }

  function designBlock(design) {
    return `
      <section class="design-product-block" aria-labelledby="${design.slug}-title">
        <article class="design-card">
          <img src="${design.image}" alt="${design.name} Drop One artwork" width="600" height="600" loading="lazy" decoding="async">
          <div>
            <p class="section-kicker">Drop One Design</p>
            <h3 id="${design.slug}-title">${design.name}</h3>
            <p>${design.description}</p>
            <nav class="garment-jump-links" aria-label="Shop ${design.name} by garment">
              ${Object.entries(garmentCatalog).map(([key, garment]) => `<a href="#${design.slug}-${key}-card">${garment.name}</a>`).join('')}
            </nav>
          </div>
        </article>
        <div class="garment-card-grid">
          ${garmentCard(design, 'bodysuit')}
          ${garmentCard(design, 'infant')}
          ${garmentCard(design, 'toddler')}
          ${garmentCard(design, 'youth')}
        </div>
      </section>`;
  }

  const shopContainer = document.querySelector('#drop-preview .container');
  if (shopContainer) {
    shopContainer.innerHTML = `
      <div class="drop-shop-intro">
        <p class="section-kicker">The first four</p>
        <h2>Pick the design. Then pick the garment.</h2>
        <p class="lead">Each Drop One design is followed by separate cards for the Rabbit Skins bodysuit, Port & Co infant tee, toddler tee, and youth tee. Two colors chosen for each design, on the right garment for your little one.</p>
        <p class="shop-note">No payment is taken here. We confirm blank availability, final sizing, shipping, and production timing before invoicing.</p>
      </div>
      ${designs.map(designBlock).join('')}
      <noscript><p>To build a preorder, enable JavaScript. You can also contact us through <a href="https://www.facebook.com/harviewilderco">Facebook</a>.</p></noscript>`;
  }

  const facts = document.querySelector('.launch-facts');
  if (facts) {
    facts.innerHTML = '<p><strong>$22</strong> Baby Bodysuit</p><p><strong>$22</strong> Infant Tee</p><p><strong>$24</strong> Toddler Tee</p><p><strong>$26</strong> Youth Tee</p>';
  }

  const sizeGrid = document.querySelector('#size-guide .product-grid');
  if (sizeGrid) {
    sizeGrid.innerHTML = `
      <article class="product-card"><h3>Baby Bodysuit · RS4400 · $22</h3><p>Sizes: NB, 06M, 12M, 18M, 24M. Rabbit Skins Infant Short Sleeve Baby Rib Bodysuit.</p></article>
      <article class="product-card"><h3>Infant Tee · CAR54I · $22</h3><p>Sizes: 06M, 12M, 18M. Port & Co Infant Core Cotton Tee.</p></article>
      <article class="product-card"><h3>Toddler Tee · CAR54T · $24</h3><p>Sizes: 2T, 3T, 4T. Port & Co Toddler Core Cotton Tee.</p></article>
      <article class="product-card"><h3>Youth Tee · PC54Y · $26</h3><p>Sizes: XS, S, M, L, XL. Port & Co Youth Core Cotton Tee with two curated Drop One colors per design.</p></article>`;
  }

  try {
    localStorage.removeItem(legacyKey);
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) {
      items = saved.filter(item => {
        if (!item || typeof item !== 'object') return false;
        const garment = garmentCatalog[item.garment];
        return designs.some(d => d.name === item.design) && garment && garment.sizes.includes(item.size) && launchColors(item.design, item.garment).includes(item.color) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20;
      });
      removedSavedOptions = saved.length - items.length;
    }
  } catch (_) { /* Shopping remains usable with storage disabled. */ }

  const preorderForm = document.getElementById('preorder-form');
  const sendButton = document.getElementById('send-preorder');
  const status = document.getElementById('preorder-status');
  if (status && removedSavedOptions) status.textContent = 'Some saved options are no longer part of Drop One. Please review your bag and choose from the two launch colors.';

  function renderBag() {
    const list = document.getElementById('preorder-items');
    if (!list) return;
    list.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-bag';
      empty.textContent = 'Your preorder is waiting for a little personality. Add a garment card above to get started.';
      list.append(empty);
    }
    let total = 0;
    items.forEach((item, index) => {
      const garment = garmentCatalog[item.garment];
      total += garment.price * item.quantity;
      const row = document.createElement('div');
      row.className = 'bag-item';
      const info = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = item.design;
      const detail = document.createElement('p');
      detail.textContent = `${garment.name} (${garment.style}) · ${item.size} · ${item.color} · Qty ${item.quantity}`;
      const price = document.createElement('span');
      price.textContent = money(garment.price * item.quantity);
      info.append(name, detail, price);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-item';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${item.design} ${garment.name}, ${item.size}, ${item.color}`);
      remove.addEventListener('click', () => { items.splice(index, 1); renderBag(); });
      row.append(info, remove);
      list.append(row);
    });
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const bagCount = document.getElementById('bag-count');
    const totalNode = document.getElementById('preorder-total');
    const subtotalInput = document.getElementById('order-subtotal');
    const itemsInput = document.getElementById('order-items');
    if (bagCount) bagCount.textContent = `(${count})`;
    if (totalNode) totalNode.textContent = money(total);
    if (subtotalInput) subtotalInput.value = money(total);
    if (itemsInput) itemsInput.value = items.map(item => {
      const garment = garmentCatalog[item.garment];
      return `${item.quantity} x ${item.design} | ${garment.name} (${garment.style}) | ${item.size} | ${item.color} | ${money(garment.price * item.quantity)}`;
    }).join('\n');
    if (sendButton) sendButton.disabled = !items.length;
    try { localStorage.setItem(storageKey, JSON.stringify(items)); } catch (_) {}
  }

  document.querySelectorAll('.garment-card').forEach(card => {
    const form = card.querySelector('form');
    const garment = garmentCatalog[card.dataset.garment];
    const selection = card.querySelector('.selected-variant');
    form.addEventListener('change', () => {
      const size = card.querySelector('.size').value;
      const color = card.querySelector('.color').value;
      const blank = card.querySelector('.mockup-blank');
      blank.src = photoUrl(garment, color);
      blank.alt = `${garment.style} ${garment.name} in ${color}, with ${card.dataset.design} print preview`;
      const caption = card.querySelector('figcaption');
      caption.firstChild.textContent = `${color} · ${card.dataset.design}`;
      selection.textContent = size && color
        ? `Your selection: ${garment.style} · ${size} · ${color}`
        : `Choose a size and color for your ${garment.name.toLowerCase()}.`;
      card.querySelector('.card-feedback').textContent = '';
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const item = {
        design: card.dataset.design,
        garment: card.dataset.garment,
        size: card.querySelector('.size').value,
        color: card.querySelector('.color').value,
        quantity: Number(card.querySelector('.quantity').value)
      };
      const same = items.find(existing => ['design', 'garment', 'size', 'color'].every(key => existing[key] === item[key]));
      if (same && same.quantity + item.quantity > 20) {
        card.querySelector('.card-feedback').textContent = 'For more than 20 of this exact option, include the quantity in your preorder notes.';
        return;
      }
      if (same) same.quantity += item.quantity; else items.push(item);
      renderBag();
      const feedback = card.querySelector('.card-feedback');
      feedback.replaceChildren(document.createTextNode('Added! '));
      const link = document.createElement('a');
      link.href = '#preorder';
      link.textContent = 'Review your preorder →';
      feedback.append(link);
    });
  });

  if (preorderForm) {
    preorderForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (!items.length || !preorderForm.reportValidity()) return;
      sendButton.disabled = true;
      sendButton.textContent = 'Sending your request…';
      status.textContent = '';
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: new URLSearchParams(new FormData(preorderForm)).toString()
        });
        if (!response.ok) throw new Error('Request failed');
        try { localStorage.removeItem(storageKey); } catch (_) {}
        window.location.assign('/preorder-thanks.html');
      } catch (_) {
        status.textContent = 'Your request could not be sent. Your selections are saved in this browser. Please try again, or contact Harvie Wilder Co. on Facebook.';
        sendButton.disabled = false;
        sendButton.textContent = 'Send preorder request';
      }
    });
  }

  renderBag();
})();
