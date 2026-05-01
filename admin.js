const adminPassword = 'Basmah123';
const authKey = 'baccessoriesAdminAuth';

const loginSection = document.getElementById('admin-login');
const dashboardSection = document.getElementById('admin-dashboard');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const resetBtn = document.getElementById('reset-btn');
const loginMessage = document.getElementById('login-message');
const passwordInput = document.getElementById('admin-password');
const productCategory = document.getElementById('product-category');
const productForm = document.getElementById('add-product-form');
const productList = document.getElementById('product-list');
const productImageFile = document.getElementById('product-image-file');
const productImageUrl = document.getElementById('product-image-url');

function isAdminAuthorized() {
  return sessionStorage.getItem(authKey) === 'true';
}

function showLogin() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  loginMessage.textContent = '';
  passwordInput.value = '';
}

function showDashboard() {
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  loginMessage.textContent = '';
  renderCategoryOptions();
  renderProductList();
}

function renderCategoryOptions() {
  const data = loadSiteData();
  if (!productCategory) return;
  productCategory.innerHTML = data.categories
    .map(cat => `<option value="${cat.id}">${cat.title}</option>`)
    .join('');
}

function renderProductList() {
  const data = loadSiteData();
  if (!productList) return;
  if (!data.products.length) {
    productList.innerHTML = '<p>لا يوجد منتجات حتى الآن.</p>';
    return;
  }
  productList.innerHTML = data.products
    .map(product => {
      const category = data.categories.find(cat => cat.id === product.category);
      const categoryName = category ? category.title : product.category;
      return `
        <div class="product-row">
          <span>${product.title}</span>
          <span>${categoryName}</span>
          <span>${product.price}</span>
          <span>${product.image}</span>
          <button type="button" data-product-id="${product.id}">حذف</button>
        </div>
      `;
    })
    .join('');

  const deleteButtons = productList.querySelectorAll('button[data-product-id]');
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-product-id');
      deleteProduct(productId);
    });
  });
}

function deleteProduct(productId) {
  const data = loadSiteData();
  data.products = data.products.filter(product => product.id !== productId);
  saveSiteData(data);
  renderProductList();
}

function handleLogin() {
  const value = passwordInput.value.trim();
  if (value === adminPassword) {
    sessionStorage.setItem(authKey, 'true');
    showDashboard();
  } else {
    loginMessage.textContent = 'كلمة المرور غير صحيحة، حاول مرة أخرى.';
  }
}

function handleLogout() {
  sessionStorage.removeItem(authKey);
  showLogin();
}

function handleReset() {
  if (!confirm('هل تريد إعادة ضبط البيانات الافتراضية؟ سيؤدي هذا إلى حذف جميع التغييرات الحالية.')) {
    return;
  }
  resetSiteData();
  renderCategoryOptions();
  renderProductList();
}

function handleProductSubmit(event) {
  event.preventDefault();
  const data = loadSiteData();
  const title = document.getElementById('product-title').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const category = productCategory.value;
  const file = productImageFile?.files?.[0] ?? null;
  const imageUrl = productImageUrl?.value.trim();

  if (!title || !description || !price || !category || (!file && !imageUrl)) {
    loginMessage.textContent = 'يرجى ملء كل الحقول وإضافة صورة المنتج.';
    return;
  }

  const addProductWithImage = imageValue => {
    const newProduct = {
      id: `${category}-${Date.now()}`,
      category,
      title,
      description,
      price,
      image: imageValue
    };

    data.products.push(newProduct);
    saveSiteData(data);
    productForm.reset();
    renderProductList();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      addProductWithImage(reader.result);
    };
    reader.onerror = () => {
      loginMessage.textContent = 'حدث خطأ أثناء قراءة الصورة. حاول مرة أخرى.';
    };
    reader.readAsDataURL(file);
    return;
  }

  addProductWithImage(imageUrl);
}

function initAdminPage() {
  if (!loginSection || !dashboardSection) return;
  if (isAdminAuthorized()) {
    showDashboard();
  } else {
    showLogin();
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', handleReset);
  }
  if (productForm) {
    productForm.addEventListener('submit', handleProductSubmit);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
  initAdminPage();
}
