'use strict';

// Menu responsive dùng chung cho các trang.
document.querySelectorAll('.menu-toggle').forEach((button) => {
  button.addEventListener('click', () => {
    const nav = button.parentElement.querySelector('.main-nav');
    if (!nav) return;
    const isOpen = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

// BÀI 01: dữ liệu mẫu được lưu trong mảng JavaScript.
const products = [
  { id: 1, name: 'Tai nghe Bluetooth', price: 450000, description: 'Tai nghe không dây, pin lâu.', icon: '🎧' },
  { id: 2, name: 'Chuột máy tính', price: 180000, description: 'Chuột quang dùng cho học tập và văn phòng.', icon: '🖱️' },
  { id: 3, name: 'Bàn phím cơ', price: 790000, description: 'Bàn phím gõ êm, thiết kế chắc chắn.', icon: '⌨️' },
  { id: 4, name: 'Màn hình máy tính', price: 3200000, description: 'Màn hình hiển thị rõ nét.', icon: '🖥️' },
  { id: 5, name: 'Webcam HD', price: 520000, description: 'Phù hợp học trực tuyến và họp video.', icon: '📷' },
  { id: 6, name: 'Loa Bluetooth', price: 650000, description: 'Loa nhỏ gọn, dễ mang theo.', icon: '🔊' }
];

const productList = document.querySelector('#product-list');
if (productList) {
  const searchInput = document.querySelector('#product-search');
  const countText = document.querySelector('#product-count');
  const clearButton = document.querySelector('#clear-search');
  const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

  function renderProducts(items) {
    productList.replaceChildren();
    if (items.length === 0) {
      const message = document.createElement('p');
      message.className = 'empty-state';
      message.textContent = 'Không tìm thấy sản phẩm phù hợp. Vui lòng thử từ khóa khác.';
      productList.appendChild(message);
      countText.textContent = 'Có 0 sản phẩm phù hợp.';
      return;
    }

    items.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const icon = document.createElement('div');
      icon.className = 'product-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = product.icon;
      const name = document.createElement('h3');
      name.textContent = product.name;
      const description = document.createElement('p');
      description.textContent = product.description;
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = money.format(product.price);
      card.append(icon, name, description, price);
      productList.appendChild(card);
    });
    countText.textContent = `Hiển thị ${items.length} sản phẩm.`;
  }

  function searchProducts() {
    const keyword = searchInput.value.trim().toLocaleLowerCase('vi');
    const results = products.filter((product) =>
      product.name.toLocaleLowerCase('vi').includes(keyword)
    );
    renderProducts(results);
  }

  searchInput.addEventListener('input', searchProducts);
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    searchProducts();
    searchInput.focus();
  });
  renderProducts(products);
}

// BÀI 02: xác thực form và lưu tối thiểu dữ liệu cần thiết.
const registerForm = document.querySelector('#register-form');
if (registerForm) {
  const nameInput = document.querySelector('#full-name');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const termsInput = document.querySelector('#terms');
  const message = document.querySelector('#register-message');

  function showError(id, text) {
    document.querySelector(`#${id}`).textContent = text;
  }

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    ['name-error', 'email-error', 'password-error', 'terms-error'].forEach((id) => showError(id, ''));
    message.textContent = '';
    message.className = 'form-message';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (!name) {
      showError('name-error', 'Vui lòng nhập họ và tên.');
      valid = false;
    }
    // Đây là kiểm tra định dạng cơ bản phía client; server vẫn phải xác thực lại.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError('email-error', 'Vui lòng nhập địa chỉ email hợp lệ.');
      valid = false;
    }
    const strongEnough = password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password);
    if (!strongEnough) {
      showError('password-error', 'Mật khẩu cần ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số.');
      valid = false;
    }
    if (!termsInput.checked) {
      showError('terms-error', 'Bạn cần đồng ý điều khoản để tiếp tục.');
      valid = false;
    }
    if (!valid) {
      message.textContent = 'Vui lòng kiểm tra các thông tin được đánh dấu.';
      message.classList.add('error');
      return;
    }

    // Không lưu mật khẩu. LocalStorage chỉ dùng minh họa với dữ liệu không nhạy cảm.
    const userRecord = { fullName: name, email, registeredAt: new Date().toISOString() };
    try {
      const existing = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const users = Array.isArray(existing) ? existing : [];
      users.push(userRecord);
      localStorage.setItem('demoUsers', JSON.stringify(users));
      message.textContent = 'Đăng ký mẫu thành công! Tên và email đã được lưu trên trình duyệt.';
      message.classList.add('success');
      registerForm.reset();
    } catch (error) {
      message.textContent = 'Không thể lưu dữ liệu trên trình duyệt. Hãy kiểm tra cài đặt lưu trữ.';
      message.classList.add('error');
    }
  });
}

// BÀI 03: countdown timer 10 phút.
const timerDisplay = document.querySelector('#timer-display');
if (timerDisplay) {
  const startButton = document.querySelector('#timer-start');
  const pauseButton = document.querySelector('#timer-pause');
  const resetButton = document.querySelector('#timer-reset');
  const statusText = document.querySelector('#timer-status');
  const initialSeconds = 10 * 60;
  let remainingSeconds = initialSeconds;
  let intervalId = null;
  let deadline = null;

  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function renderTimer() {
    timerDisplay.textContent = formatTime(remainingSeconds);
    timerDisplay.classList.toggle('warning', remainingSeconds > 0 && remainingSeconds < 60);
  }

  function stopInterval() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function tick() {
    // Dùng mốc thời gian tuyệt đối để giảm sai lệch khi tab bị trình duyệt giới hạn.
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    renderTimer();
    if (remainingSeconds <= 0) {
      stopInterval();
      startButton.disabled = false;
      pauseButton.disabled = true;
      statusText.textContent = 'Đã hết thời gian.';
      window.alert('Đã hết 10 phút!');
    }
  }

  startButton.addEventListener('click', () => {
    if (intervalId !== null || remainingSeconds <= 0) return;
    deadline = Date.now() + remainingSeconds * 1000;
    statusText.textContent = 'Đang đếm ngược...';
    startButton.disabled = true;
    pauseButton.disabled = false;
    intervalId = window.setInterval(tick, 250);
    tick();
  });

  pauseButton.addEventListener('click', () => {
    if (intervalId === null) return;
    tick();
    stopInterval();
    if (remainingSeconds > 0) {
      statusText.textContent = 'Đã tạm dừng.';
      startButton.disabled = false;
      pauseButton.disabled = true;
    }
  });

  resetButton.addEventListener('click', () => {
    stopInterval();
    remainingSeconds = initialSeconds;
    deadline = null;
    renderTimer();
    statusText.textContent = 'Đã đặt lại về 10 phút.';
    startButton.disabled = false;
    pauseButton.disabled = true;
  });

  window.addEventListener('pagehide', stopInterval);
  renderTimer();
}
