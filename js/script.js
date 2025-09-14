
document.addEventListener('DOMContentLoaded', () => {
  const options = Array.from(document.querySelectorAll('.option'));
  const totalPriceEl = document.getElementById('totalPrice');
  const addToCartBtn = document.getElementById('addToCart');

  const formatPrice = (val) => '$' + Number(val).toFixed(2) + ' USD';

  
  function collapseAll() {
    options.forEach(opt => {
      opt.classList.remove('active');
      const details = opt.querySelector('.details');
      if (details) {
        details.style.maxHeight = '0';
        details.style.paddingTop = '0';
        details.style.paddingBottom = '0';
        details.setAttribute('aria-hidden', 'true');
      }
      const inner = opt.querySelector('.option-inner');
      if (inner) inner.setAttribute('aria-expanded', 'false');
    });
  }

  
  function expandOption(opt) {
    collapseAll();

    opt.classList.add('active');

    const details = opt.querySelector('.details');
    if (details) {
      const h = details.scrollHeight;
      details.style.maxHeight = (h > 0 ? h : 60) + 'px';
      details.setAttribute('aria-hidden', 'false');
    }

    const inner = opt.querySelector('.option-inner');
    if (inner) inner.setAttribute('aria-expanded', 'true');

    updateTotal();
  }

  function selectOption(opt) {
    if (!opt) return;
    expandOption(opt);
  }

  function updateTotal() {
    const active = document.querySelector('.option.active') || null;
    if (!active) {

      const fallback = document.querySelector('.option.most-popular') || document.querySelector('.option');
      if (fallback) {
        totalPriceEl.textContent = formatPrice(fallback.dataset.price || 0);
      }
      return;
    }
    const price = active.dataset.price || active.getAttribute('data-price') || '0';
    totalPriceEl.textContent = formatPrice(price);
  }

  function addToCart() {
    const active = document.querySelector('.option.active');
    if (!active) {
      alert('Please select a package.');
      return;
    }

    const packName = (active.querySelector('.pack-title strong') && active.querySelector('.pack-title strong').textContent) || 'Package';
    const price = active.dataset.price || active.getAttribute('data-price') || '0';

    const selects = Array.from(active.querySelectorAll('select'));
    const selections = selects.map((s) => {
      const label = s.getAttribute('aria-label') || s.name || 'Option';
      return `${label}: ${s.value}`;
    });

    const detailsText = selections.length ? '\n\n' + selections.join('\n') : '';
    alert(`${packName} added to cart — ${formatPrice(price)}${detailsText}`);
  }

  options.forEach(opt => {
    const inner = opt.querySelector('.option-inner');

    if (!inner) return;


    inner.addEventListener('click', (e) => {

      if (e.target.closest('select') || e.target.tagName === 'OPTION') return;

      if (e.target.closest('.details')) return;

      selectOption(opt);
    });

    inner.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectOption(opt);
      }
    });
  });

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart);
  }

  window.addEventListener('resize', () => {
    const active = document.querySelector('.option.active');
    if (active) {
      const d = active.querySelector('.details');
      if (d) d.style.maxHeight = d.scrollHeight + 'px';
    }
  });

  (function init() {
    collapseAll();
    const pref = document.querySelector('.option.most-popular') || document.querySelector('.option');
    if (pref) {
      setTimeout(() => selectOption(pref), 50);
    } else {
      updateTotal();
    }
  })();
});
