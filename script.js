```javascript
const CART_KEY = "jerseyCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((totale, item) => totale + (Number(item.quantity) || 0), 0);

  document.querySelectorAll("#cartCount").forEach(element => {
    element.textContent = count;
  });
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(item =>
    item.name === product.name &&
    item.size === product.size
  );

  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id || Date.now(),
      name: product.name,
      price: Number(product.price),
      size: product.size || "",
      quantity: product.quantity || 1,
      image: product.image || ""
    });
  }

  saveCart(cart);

  alert("✅ " + product.name + " aggiunta al carrello!");
}

function removeFromCart(index) {
  const cart = getCart();

  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
}

function changeQuantity(index, amount) {
  const cart = getCart();

  if (!cart[index]) return;

  cart[index].quantity += amount;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function getCartTotal() {
  return getCart().reduce(
    (totale, item) => totale + Number(item.price) * Number(item.quantity),
    0
  );
}

function formatPrice(price) {
  return Number(price).toFixed(2).replace(".", ",") + " €";
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:60px;">🛒</div>
        <h2>Il carrello è vuoto</h2>
        <p>Aggiungi una maglia per iniziare il tuo ordine.</p>
        <a href="prodotti.html" class="btn btn-primary">
          VAI AI PRODOTTI
        </a>
      </div>
    `;

    if (totalElement) {
      totalElement.textContent = "0,00 €";
    }

    return;
  }

  container.innerHTML = "";

  cart.forEach((item, index) => {
    const subtotal = Number(item.price) * Number(item.quantity);

    const article = document.createElement("article");
    article.className = "cart-item";

    article.innerHTML = `
      <div class="cart-item-image">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name}">`
            : `<span>👕</span>`
        }
      </div>

      <div class="cart-item-info">
        <h3>${escapeHTML(item.name)}</h3>

        ${
          item.size
            ? `<p>Taglia: <strong>${escapeHTML(item.size)}</strong></p>`
            : ""
        }

        <strong class="cart-price">
          ${formatPrice(item.price)}
        </strong>
      </div>

      <div class="quantity-controls">
        <button onclick="changeQuantity(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>

      <strong class="cart-subtotal">
        ${formatPrice(subtotal)}
      </strong>

      <button
        class="remove-item"
        onclick="removeFromCart(${index})"
        aria-label="Rimuovi prodotto">
        ×
      </button>
    `;

    container.appendChild(article);
  });

  if (totalElement) {
    totalElement.textContent = formatPrice(getCartTotal());
  }
}

function createWhatsAppOrder() {
  const cart = getCart();

  if (cart.length === 0) {
  alert("Il carrello è vuoto.");
    return;
  }

  let message = "Ciao Jersey Sport! 👋%0A%0A";
  message += "Vorrei effettuare questo ordine:%0A%0A";

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name}`;

    if (item.size) {
      message += ` - Taglia ${item.size}`;
    }

    message += ` - Quantità ${item.quantity}`;
    message += ` - ${formatPrice(item.price * item.quantity)}`;
    message += "%0A";
  });

  message += `%0ATotale: ${formatPrice(getCartTotal())}`;
  message += "%0A%0AGrazie!";

  const phone = "393513438336";
  const url = `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ================= PRODOTTI ================= */

const prodotti = [
  {
    id: 1,
    name: "Jersey Sport 10",
    category: "calcio",
    price: 39.90,
    image: "",
    description: "Maglia da calcio Jersey Sport."
  },
  {
    id: 2,
    name: "Jersey Basket",
    category: "basket",
    price: 44.90,
    image: "",
    description: "Jersey da basket."
  },
  {
    id: 3,
    name: "Jersey Premium",
    category: "sport",
    price: 49.90,
    image: "",
    description: "Maglia sportiva Premium."
  }
];

function renderProducts(list = prodotti) {
  const container = document.getElementById("productsList");

  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <h3>Nessun prodotto trovato.</h3>
        <p>Prova con un'altra ricerca.</p>
      </div>
    `;
    return;
  }

  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        ${
          product.image
            ? `<img src="${product.image}" alt="${escapeHTML(product.name)}">`
            : `<div class="shirt-placeholder">👕</div>`
        }
      </div>

      <div class="product-info">
        <p class="product-category">
          ${escapeHTML(product.category)}
        </p>

        <h3>${escapeHTML(product.name)}</h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <strong class="product-price">
          ${formatPrice(product.price)}
        </strong>

        <div class="size-select">
          <label for="size-${product.id}">Taglia</label>

          <select id="size-${product.id}">
            <option value="S">S</option>
            <option value="M" selected>M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>

        <button
          class="btn btn-primary add-product"
          data-id="${product.id}">
          AGGIUNGI AL CARRELLO
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  document.querySelectorAll(".add-product").forEach(button => {
    button.addEventListener("click", function () {
      const id = Number(this.dataset.id);
      const product = prodotti.find(item => item.id === id);

      if (!product) return;

      const select = document.getElementById(`size-${product.id}`);

      addToCart({
        ...product,
        size: select ? select.value : "M",
        quantity: 1
      });
    });
  });
}

function filterProducts() {
  const search = document.getElementById("productSearch");
  const category = document.getElementById("categoryFilter");

  if (!search) return;

  const searchText = search.value.toLowerCase().trim();
  const selectedCategory = category ? category.value : "tutte";

  const filtered = prodotti.filter(product => {
    const matchesText =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "tutte" ||
      product.category === selectedCategory;

    return matchesText && matchesCategory;
  });

  renderProducts(filtered);
}


/* ================= MENU ================= */

function setupMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");

  if (!menuBtn || !menu) return;

  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  });
}


/* ================= RICERCA ================= */

function setupSearch() {
  const search = document.getElementById("productSearch");
  const category = document.getElementById("categoryFilter");

  if (search) {
    search.addEventListener("input", filterProducts);
  }

  if (category) {
    category.addEventListener("change", filterProducts);
  }
}


/* ================= AVVIO ================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  renderProducts();
  setupMenu();
  setupSearch();
});
```
