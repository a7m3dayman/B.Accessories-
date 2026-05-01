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

function showStatus(message, isError = false) {
  if (!loginMessage) return;
  loginMessage.textContent = message;
  if (!message) {
    loginMessage.classList.remove('success', 'error');
    return;
  }
  loginMessage.classList.toggle('success', !isError);
  loginMessage.classList.toggle('error', isError);
}

async function checkServer() {
  try {
    const response = await fetch('/api/site-data');
    return response.ok;
  } catch {
    return false;
  }
}

function isAdminAuthorized() {
  return sessionStorage.getItem(authKey) === 'true';
}

function showLogin() {
  loginSection.hidden = false;
  dashboardSection.hidden = true;
  showStatus('');
  passwordInput.value = '';
}

async function showDashboard() {
  const serverAvailable = await checkServer();
  if (!serverAvailable) {
    showStatus('الخادم غير متاح. يرجى تشغيل الخادم أولاً بـ "npm start" لإدارة المنتجات.', true);
    loginSection.hidden = false;
    dashboardSection.hidden = true;
    return;
  }
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  showStatus('');
  await renderCategoryOptions();
  await renderProductList();
}

async function renderCategoryOptions() {
  const data = await loadSiteData();
  if (!productCategory) return;
  productCategory.innerHTML = data.categories
    .map(cat => `<option value="${cat.id}">${cat.title}</option>`)
    .join('');
}

async function renderProductList() {
  const data = await loadSiteData();
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

async function deleteProduct(productId) {
  const data = await loadSiteData();
  data.products = data.products.filter(product => product.id !== productId);
  await saveSiteData(data);
  await renderProductList();
  showStatus('تم حذف المنتج بنجاح.');
}

async function handleLogin() {
  const value = passwordInput.value.trim();
  if (value === adminPassword) {
    sessionStorage.setItem(authKey, 'true');
    await showDashboard();
  } else {
    showStatus('كلمة المرور غير صحيحة، حاول مرة أخرى.', true);
  }
}

function handleLogout() {
  sessionStorage.removeItem(authKey);
  showLogin();
}

async function handleReset() {
  if (!confirm('هل تريد إعادة ضبط البيانات الافتراضية؟ سيؤدي هذا إلى حذف جميع التغييرات الحالية.')) {
    return;
  }
  await resetSiteData();
  await renderCategoryOptions();
  await renderProductList();
  showStatus('تمت إعادة ضبط البيانات إلى الحالة الافتراضية.');
}

async function handleProductSubmit(event) {
  event.preventDefault();
  console.log('Submitting product...');
  const data = await loadSiteData();
  console.log('Loaded data:', data);
  const title = document.getElementById('product-title').value.trim();
  const description = document.getElementById('product-description').value.trim();
  const price = document.getElementById('product-price').value.trim();
  const category = productCategory.value;
  const file = productImageFile?.files?.[0] ?? null;
  const imageUrl = productImageUrl?.value.trim();

  if (!title || !description || !price || !category || (!file && !imageUrl)) {
    showStatus('يرجى ملء كل الحقول وإضافة صورة المنتج.', true);
    return;
  }

  const addProductWithImage = async imageValue => {
    const newProduct = {
      id: `${category}-${Date.now()}`,
      category,
      title,
      description,
      price,
      image: imageValue
    };

    data.products.push(newProduct);
    console.log('Saving data:', data);
    await saveSiteData(data);
    console.log('Data saved successfully');
    productForm.reset();
    productImageFile.value = '';
    showStatus('تم إضافة المنتج بنجاح.');
    await renderProductList();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = async () => {
      await addProductWithImage(reader.result);
    };
    reader.onerror = () => {
      showStatus('حدث خطأ أثناء قراءة الصورة. حاول مرة أخرى.', true);
    };
    reader.readAsDataURL(file);
    return;
  }

  await addProductWithImage(imageUrl);
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
