(() => {
  'use strict';
  // Keep the embedded book shop off the initial hero's network/CPU path.
  const shops = [...document.querySelectorAll('.book-buy-card')];
  let loadingBook = false;
  function loadBook() {
    if (!shops.length || loadingBook) return;
    loadingBook = true;
    const script = document.createElement('script');
    script.src = 'https://js.lulu.com/lulu-buy.js';
    script.async = true;
    script.addEventListener('load', () => {
      shops.forEach(shop => {
        const status = shop.querySelector('.book-load-status');
        if (status) status.remove();
      });
    });
    script.addEventListener('error', () => {
      loadingBook = false;
      shops.forEach(shop => {
      const status = shop.querySelector('.book-load-status');
      if (!status) return;
      status.replaceChildren(document.createTextNode('The book shop could not load. '));
      const retry = document.createElement('button');
      retry.className = 'button button-secondary';
      retry.type = 'button';
      retry.textContent = 'Try again';
      retry.addEventListener('click', loadBook);
      status.append(retry);
      });
      script.remove();
    });
    document.head.append(script);
  }
  if (shops.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        observer.disconnect();
        loadBook();
      }
    }, {rootMargin: '600px'});
    shops.forEach(shop => observer.observe(shop));
  } else if (shops.length) loadBook();

  // The existing analytics queue is initialized in the head. Load its library
  // after page assets, while preserving the same measurement ID and pageview.
  const analytics = () => {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-0PB50EY0SQ';
    script.async = true;
    document.head.append(script);
  };
  const scheduleAnalytics = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(analytics, {timeout: 2000});
    else setTimeout(analytics, 1000);
  };
  if (document.readyState === 'complete') scheduleAnalytics();
  else window.addEventListener('load', scheduleAnalytics, {once: true});
})();
