const API_BASE_URL = 'https://fakestoreapi.com';
let allProducts = [];
let filteredProducts = [];
let currentSlideIndex = 0;
let sliderInterval = null;

//burger menu
const navToggle = document.querySelector(".nav__toggle, .icon-btn--hamburger");
const navList = document.querySelector(".nav__list, .nav");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("nav__list--open");
  });

 //es menu ixureba garet ro daawr ra
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove("nav__list--open");
    }
  });
}

//wina proeqti
const musicTimer = document.querySelector(".music-banner__timer");

if (musicTimer) {
  const badges = musicTimer.querySelectorAll(".music-badge");
  const units = {};
  badges.forEach((badge) => {
    const unit = badge.dataset.unit;
    const valueEl = badge.querySelector("span");
    units[unit] = {
      el: valueEl,
      value: parseInt(valueEl.textContent, 10) || 0,
    };
  });

  let remaining =
    (units.days?.value || 0) * 24 * 60 * 60 +
    (units.hours?.value || 0) * 60 * 60 +
    (units.minutes?.value || 0) * 60 +
    (units.seconds?.value || 0);

  function updateMusicTimer() {
    if (remaining < 0) remaining = 0;

    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (units.days) units.days.el.textContent = String(days).padStart(2, "0");
    if (units.hours) units.hours.el.textContent = String(hours).padStart(2, "0");
    if (units.minutes) units.minutes.el.textContent = String(minutes).padStart(2, "0");
    if (units.seconds) units.seconds.el.textContent = String(seconds).padStart(2, "0");

    remaining--;
  }

  updateMusicTimer();
  setInterval(updateMusicTimer, 1000);
}

//es wina proeqtisaa da aqac cota daxmareba gamoviyene
const countdownEl = document.querySelector(".countdown[data-timer='flash']");

const daysEl = countdownEl ? countdownEl.querySelector("[data-unit='days']") : document.getElementById('fs-days');
const hoursEl = countdownEl ? countdownEl.querySelector("[data-unit='hours']") : document.getElementById('fs-hours');
const minutesEl = countdownEl ? countdownEl.querySelector("[data-unit='minutes']") : document.getElementById('fs-mins');
const secondsEl = countdownEl ? countdownEl.querySelector("[data-unit='seconds']") : document.getElementById('fs-secs');

if (daysEl || hoursEl || minutesEl || secondsEl) {
  let remaining = 3 * 24 * 60 * 60;

  function updateTimer() {
    if (remaining < 0) remaining = 0;

    const days = Math.floor(remaining / (24 * 60 * 60));
    const hours = Math.floor((remaining / (60 * 60)) % 24);
    const minutes = Math.floor((remaining / 60) % 60);
    const seconds = Math.floor(remaining % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");

    remaining -= 1;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

//anu ideashi es aris auto slideri sadac next da prev aris ra
function initHeroSlider() {
  const banner = document.querySelector('.hero-banner__inner');
  if (!banner) return;

  // slideris yvelanairi data
  const slides = [
    {
      eyebrow: 'iPhone 14 Series',
      title: 'Up to 10%<br/>off Voucher'
    },
    {
      eyebrow: 'Summer Collection 2024',
      title: 'New Arrivals<br/>This Week'
    },
    {
      eyebrow: 'Special Offer',
      title: 'Limited Time<br/>Deals'
    }
  ];

  //navigaciis buttonebi
  const sliderControls = document.createElement('div');
  sliderControls.className = 'slider-controls';
  sliderControls.innerHTML = `
    <button class="slider-btn slider-btn--prev" aria-label="Previous slide">‹</button>
    <button class="slider-btn slider-btn--next" aria-label="Next slide">›</button>
  `;
  banner.parentElement.style.position = 'relative';
  banner.parentElement.appendChild(sliderControls);

  function updateSlide(index) {
    currentSlideIndex = index;
    const slide = slides[currentSlideIndex];
    
    banner.style.opacity = '0';
    setTimeout(() => {
      const eyebrowText = banner.querySelector('.hero-banner__eyebrow span');
      const titleText = banner.querySelector('.hero-banner__title');
      
      if (eyebrowText) eyebrowText.textContent = slide.eyebrow;
      if (titleText) titleText.innerHTML = slide.title;
      
      banner.style.opacity = '1';
    }, 300);
  }

  function nextSlide() {
    const nextIndex = (currentSlideIndex + 1) % slides.length;
    updateSlide(nextIndex);
  }

  function prevSlide() {
    const prevIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
    updateSlide(prevIndex);
  }
//buttonis event listenerevi
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');
  
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
//yovel sam wamshi advance
  sliderInterval = setInterval(nextSlide, 3000);

  //hverze dapauzeba
  banner.parentElement.addEventListener('mouseenter', () => {
    clearInterval(sliderInterval);
  });

  banner.parentElement.addEventListener('mouseleave', () => {
    sliderInterval = setInterval(nextSlide, 3000);
  });
}

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    return allProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
async function addProduct(productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to add product');
    const newProduct = await response.json();
    console.log('Product added:', newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
}
//apis gamodzaxeba
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to update product');
    const updatedProduct = await response.json();
    console.log('Product updated:', updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete product');
    console.log('Product deleted:', id);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}
//gafiltvrebi
function applyFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-range');
  const searchInput = document.getElementById('search-filter');

  let result = [...allProducts];
  if (categoryFilter && categoryFilter.value !== 'all') {
    result = result.filter(product => product.category === categoryFilter.value);
  }
  if (priceRange) {
    const maxPrice = parseFloat(priceRange.value);
    result = result.filter(product => product.price <= maxPrice);
  }
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase();
    result = result.filter(product => 
      product.title.toLowerCase().includes(searchTerm)
    );
  }

  filteredProducts = result;
  displayProducts(filteredProducts);
  updateResultsCount(filteredProducts.length);
}
function displayProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="no-products">No products found matching your filters.</p>';
    return;
  }

  container.innerHTML = products.map(product => `
    <article class="product-card" data-id="${product.id}">
      <button class="product-card__wishlist" aria-label="Add to wishlist">♡</button>
      <div class="product-card__image">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__title">${product.title}</h3>
        <div class="product-card__prices">
          <span class="product-card__price--current">$${product.price.toFixed(2)}</span>
        </div>
        <div class="product-card__rating">
          <span>${'★'.repeat(Math.floor(product.rating?.rate || 4))}${'☆'.repeat(5 - Math.floor(product.rating?.rate || 4))}</span>
          <span class="product-card__rating-count">(${product.rating?.count || 0})</span>
        </div>
        <button class="btn btn--black product-card__add" onclick="addToCart(${product.id})">Add To Cart</button>
      </div>
    </article>
  `).join('');
}
function updateResultsCount(count) {
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = count;
  }
}
async function initFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const searchInput = document.getElementById('search-filter');

  await fetchProducts();
  if (categoryFilter) {
    const categories = ['all', ...new Set(allProducts.map(p => p.category))];
    categoryFilter.innerHTML = categories.map(cat => 
      `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
    ).join('');

    categoryFilter.addEventListener('change', applyFilters);
  }

//prince range 
  if (priceRange && priceValue) {
    const maxPrice = Math.max(...allProducts.map(p => p.price));
    priceRange.max = Math.ceil(maxPrice);
    priceRange.value = Math.ceil(maxPrice);
    priceValue.textContent = `$${Math.ceil(maxPrice)}`;

    priceRange.addEventListener('input', (e) => {
      priceValue.textContent = `$${e.target.value}`;
      applyFilters();
    });
  }
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
//tavidan rom yvela produqtebi gamochndes
  displayProducts(allProducts);
  updateResultsCount(allProducts.length);
}
function addToCart(productId) {
  console.log('Adding product to cart:', productId);
  alert('Product added to cart!');
}

//cart
document.addEventListener("DOMContentLoaded", () => {
  const cartItems = document.querySelectorAll(".cart-item");
  if (!cartItems.length) return;

  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");

  function formatMoney(value) {
    return "$" + value.toLocaleString();
  }

  function updateRow(row) {
    const price = Number(row.dataset.price);
    const qtyInput = row.querySelector(".qty-input");
    let qty = Number(qtyInput.value) || 1;
    if (qty < 1) qty = 1;
    qtyInput.value = qty;

    const subtotal = price * qty;
    const cell = row.querySelector(".cart-item__subtotal");
    if (cell) cell.textContent = formatMoney(subtotal);
  }

  function updateTotals() {
    let total = 0;
    cartItems.forEach((row) => {
      const price = Number(row.dataset.price);
      const qty = Number(row.querySelector(".qty-input").value) || 1;
      total += price * qty;
    });

    if (subtotalEl) subtotalEl.textContent = formatMoney(total);
    if (totalEl) totalEl.textContent = formatMoney(total);
  }

  cartItems.forEach((row) => {
    const minus = row.querySelector(".qty-btn--minus");
    const plus = row.querySelector(".qty-btn--plus");
    const input = row.querySelector(".qty-input");

    minus.addEventListener("click", () => {
      input.value = Math.max(1, Number(input.value) - 1);
      updateRow(row);
      updateTotals();
    });

    plus.addEventListener("click", () => {
      input.value = Number(input.value) + 1;
      updateRow(row);
      updateTotals();
    });

    input.addEventListener("change", () => {
      updateRow(row);
      updateTotals();
    });
    updateRow(row);
  });

  updateTotals();
  const updateBtn = document.getElementById('update-cart');
  if (updateBtn) {
    updateBtn.addEventListener('click', () => {
      alert('Cart updated successfully!');
    });
  }
});
const contactForm = document.querySelector("#contact-form, .contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = contactForm.querySelector('input[name="name"]');
    const email = contactForm.querySelector('input[name="email"]');
    const phone = contactForm.querySelector('input[name="phone"]');
    const message = contactForm.querySelector('textarea[name="message"]');

    let isValid = true;
    let errors = [];

    // es mtlianad chemit ar damiweria 
    if (name && !name.value.trim()) {
      isValid = false;
      errors.push('Name is required');
      name.style.borderColor = '#db4444';
    } else if (name) {
      name.style.borderColor = '#e0e0e0';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (email && !email.value.trim()) {
      isValid = false;
      errors.push('Email is required');
      email.style.borderColor = '#db4444';
    } else if (email && !emailRegex.test(email.value)) {
      isValid = false;
      errors.push('Please enter a valid email address');
      email.style.borderColor = '#db4444';
    } else if (email) {
      email.style.borderColor = '#e0e0e0';
    }
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (phone && !phone.value.trim()) {
      isValid = false;
      errors.push('Phone is required');
      phone.style.borderColor = '#db4444';
    } else if (phone && !phoneRegex.test(phone.value)) {
      isValid = false;
      errors.push('Please enter a valid phone number');
      phone.style.borderColor = '#db4444';
    } else if (phone) {
      phone.style.borderColor = '#e0e0e0';
    }
    if (message && !message.value.trim()) {
      isValid = false;
      errors.push('Message is required');
      message.style.borderColor = '#db4444';
    } else if (message) {
      message.style.borderColor = '#e0e0e0';
    }

    if (isValid) {
      alert('Thank you! Your message has been sent successfully.');
      contactForm.reset();
    } else {
      alert('Please fix the following errors:\n\n' + errors.join('\n'));
    }
  });
}

const footerForms = document.querySelectorAll('.footer__form');
footerForms.forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailInput.value.trim()) {
      alert('Please enter your email address');
    } else if (!emailRegex.test(emailInput.value)) {
      alert('Please enter a valid email address');
    } else {
      alert('Thank you for subscribing!');
      emailInput.value = '';
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  if (document.getElementById('products-container')) {
    initFilters();
  }

});