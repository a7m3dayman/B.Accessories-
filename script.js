const storageKey = 'baccessoriesSiteData';
const defaultSiteData = {
  categories: [
    { id: 'rings', title: 'خواتم | Rings', description: 'تصاميم مميزة لكل الأذواق.', image: 'images/rings.jpg' },
    { id: 'earrings', title: 'حلقان | Earrings', description: 'لمسات ناعمة وأنيقة للمناسبات.', image: 'images/earrings.jpg' },
    { id: 'bracelets', title: 'أساور | Bracelet', description: 'قطع أنيقة لإطلالة يومية راقية.', image: 'images/bracelets.jpg' },
    { id: 'chains', title: 'سلاسل | Chains', description: 'سلاسل بتصاميم عصرية وكلاسيك.', image: 'images/chains.jpg' },
    { id: 'watches', title: 'ساعات | Watches', description: 'ساعات أنيقة ومميزة لكل يوم.', image: 'images/watches.jpg' },
    { id: 'hand-chain', title: 'سلسلة يد | Hand Chain', description: 'تفاصيل صغيرة تحوّل إطلالتك.', image: 'images/hand-chain.jpg' }
  ],
  products: [
    { id: 'ring-1', category: 'rings', title: 'خاتم وردي لامع', description: 'خاتم بسيط مع لمسة أنثوية مثالية لكل يوم.', price: '280 جنيه', image: 'images/rings.jpg' },
    { id: 'ring-2', category: 'rings', title: 'خاتم حجر روز', description: 'تصميم ناعم يجمع بين الكلاسيكي والعصري.', price: '320 جنيه', image: 'images/rings.jpg' },
    { id: 'earring-1', category: 'earrings', title: 'حلق بلون الماس', description: 'لمسة براقة تناسب السهرات والمناسبات.', price: '210 جنيه', image: 'images/earrings.jpg' },
    { id: 'earring-2', category: 'earrings', title: 'حلق دائري ناعم', description: 'تصميم بسيط يمنحك مظهرًا أنيقًا يوميًا.', price: '170 جنيه', image: 'images/earrings.jpg' },
    { id: 'bracelet-1', category: 'bracelets', title: 'سوار لؤلؤ', description: 'سوار أنثوي بسيط مع لمسات لؤلؤ جميلة.', price: '240 جنيه', image: 'images/bracelets.jpg' },
    { id: 'bracelet-2', category: 'bracelets', title: 'سوار جلد معدني', description: 'قطعة جريئة تضيف شخصية لإطلالتك.', price: '260 جنيه', image: 'images/bracelets.jpg' },
    { id: 'chain-1', category: 'chains', title: 'سلسلة قلب', description: 'سلسلة رومانسية تناسب الهدايا الخاصة.', price: '290 جنيه', image: 'images/chains.jpg' },
    { id: 'chain-2', category: 'chains', title: 'سلسلة رفيعة', description: 'تصميم بسيط يكمل إطلالتك اليومية.', price: '230 جنيه', image: 'images/chains.jpg' },
    { id: 'watch-1', category: 'watches', title: 'ساعة جلد فاخرة', description: 'ساعة أنيقة تصلح للعمل والمناسبات.', price: '420 جنيه', image: 'images/watches.jpg' },
    { id: 'watch-2', category: 'watches', title: 'ساعة رقمية مودرن', description: 'تصميم شبابي عملي مع لمسة عصرية.', price: '380 جنيه', image: 'images/watches.jpg' },
    { id: 'hand-chain-1', category: 'hand-chain', title: 'سلسلة يد كريستال', description: 'تفاصيل فاخرة تضيف لمسة أنثوية.', price: '270 جنيه', image: 'images/hand-chain.jpg' },
    { id: 'hand-chain-2', category: 'hand-chain', title: 'سلسلة يد ذهبي', description: 'قطعة تجذب الأنظار بجمالها الهادئ.', price: '310 جنيه', image: 'images/hand-chain.jpg' }
  ]
};

async function loadSiteData() {
  try {
    const response = await fetch('/api/site-data');
    if (!response.ok) throw new Error('Server response not ok');
    return await response.json();
  } catch (error) {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : defaultSiteData;
    } catch (innerError) {
      return defaultSiteData;
    }
  }
}

async function saveSiteData(data) {
  try {
    console.log('Sending data to API:', data);
    const response = await fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('API response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error saving to API:', error);
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
}

async function resetSiteData() {
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(defaultSiteData));
  }
}

function renderCategories(data) {
  const categoriesContainer = document.getElementById('categories-grid');
  if (!categoriesContainer) return;
  categoriesContainer.innerHTML = data.categories.map(category => `
    <a class="category-card" href="#${category.id}">
      <div class="category-image" style="background-image: url('${category.image}');"></div>
      <h3>${category.title}</h3>
      <p>${category.description}</p>
    </a>
  `).join('');
}

function renderProducts(data) {
  const productsContainer = document.getElementById('category-products');
  if (!productsContainer) return;

  productsContainer.innerHTML = data.categories.map(category => {
    const categoryProducts = data.products.filter(product => product.category === category.id);
    const productCards = categoryProducts.length
      ? categoryProducts.map(product => `
          <article class="product-card">
            <div class="product-image" style="background-image: url('${product.image}');"></div>
            <h4>${product.title}</h4>
            <p>${product.description}</p>
            <span class="price">${product.price}</span>
          </article>
        `).join('')
      : `<p class="no-products">لا توجد منتجات في هذا القسم بعد.</p>`;

    return `
      <article id="${category.id}" class="category-group">
        <h3>${category.title}</h3>
        <div class="products-grid">
          ${productCards}
        </div>
      </article>
    `;
  }).join('');
}

function initHiddenAdminTrigger() {
  const logo = document.querySelector('.logo');
  if (!logo) return;
  let clicks = 0;
  let timer = null;
  logo.addEventListener('click', () => {
    clicks += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 1500);
    if (clicks >= 5) {
      window.location.href = 'admin.html';
    }
  });
}

function initSmoothScroll() {
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

async function renderSite() {
  const data = await loadSiteData();
  renderCategories(data);
  renderProducts(data);
}

function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    document.addEventListener('click', (event) => {
      if (!menuToggle.contains(event.target) && !mainNav.contains(event.target)) {
        mainNav.classList.remove('open');
      }
    });

    mainNav.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        mainNav.classList.remove('open');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSite();
  initHiddenAdminTrigger();
  initSmoothScroll();
  initMobileMenu();
});
