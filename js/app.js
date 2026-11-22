// MiniShop application logic (vanilla JavaScript, ES6+).
// Depends on the global `products` array from products.js.

const STORAGE_KEY = "minishop_cart_v1";
const FREE_DELIVERY_MIN = 999; // orders at or above this get free delivery
const DELIVERY_FEE = 50;
const MAX_QTY = 99;

// Cart object keyed by product ID: { "1": 2, "4": 1 }  (id -> quantity)
let cart = {};
// Current catalogue view settings
const view = { search: "", category: "All", sort: "default" };

const $ = (selector) => document.querySelector(selector);
const el = {
  grid: $("#productGrid"), search: $("#searchInput"), category: $("#categoryFilter"),
  sort: $("#sortSelect"), resultCount: $("#resultCount"), cartCount: $("#cartCount"),
  cartItems: $("#cartItems"), subtotal: $("#subtotal"), delivery: $("#delivery"),
  grandTotal: $("#grandTotal"), hint: $("#deliveryHint"), checkoutBtn: $("#checkoutBtn"),
  dialog: $("#checkoutDialog"), checkoutView: $("#checkoutView"), successView: $("#successView"),
  orderLines: $("#orderLines"), toast: $("#toast")
};

/* ---------- Helpers ---------- */

// Prices stay numbers; format only for display.
const formatPrice = (price) =>
  price.toLocaleString("en-IN", { style: "currency", currency: "INR" });

const getProduct = (id) => products.find((p) => p.id === Number(id));

let toastTimer;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove("show"), 1800);
}

/* ---------- Product catalogue ---------- */

function getVisibleProducts() {
  const term = view.search.trim().toLowerCase();
  let list = products.filter((p) =>
    (view.category === "All" || p.category === view.category) &&
    p.name.toLowerCase().includes(term));
  if (view.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (view.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

// Shows an <img> for file paths/URLs, otherwise treats the value as an emoji placeholder.
function productVisual(p) {
  const isFile = /[./]/.test(p.image) && p.image.length > 2;
  return isFile
    ? `<img src="${p.image}" alt="${p.name}" loading="lazy">`
    : `<span class="emoji" role="img" aria-label="${p.name}">${p.image}</span>`;
}

function renderProducts() {
  const list = getVisibleProducts();
  el.resultCount.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;

  if (list.length === 0) {
    el.grid.innerHTML = `<div class="empty wide"><strong>No products found.</strong>
      <span>Try a different name or choose "All" categories.</span></div>`;
    return;
  }
  el.grid.innerHTML = list.map((p) => `
    <article class="card" data-category="${p.category}">
      <div class="card-visual">${productVisual(p)}</div>
      <div class="card-body">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
        <p class="rating" aria-label="Rated ${p.rating} out of 5">★ ${p.rating.toFixed(1)}</p>
        <div class="card-foot">
          <span class="price">${formatPrice(p.price)}</span>
          <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
        </div>
      </div>
    </article>`).join("");
}

function populateCategories() {
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  el.category.innerHTML = categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

/* ---------- Cart operations ---------- */

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return; // ignore unknown IDs
  cart[product.id] = Math.min((cart[product.id] || 0) + 1, MAX_QTY);
  commitCart();
  showToast(`${product.name} added to cart`);
}

// delta is +1 or -1. Quantity never drops below 1 (use removeItem to delete).
function changeQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id] = Math.min(Math.max(cart[id] + delta, 1), MAX_QTY);
  commitCart();
}

function removeItem(id) {
  delete cart[id];
  commitCart();
}

function calculateSubtotal() {
  // Sum of (price x quantity) using reduce()
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = getProduct(id);
    return product ? sum + product.price * qty : sum;
  }, 0);
}

function calculateDelivery(subtotal = calculateSubtotal()) {
  if (subtotal === 0) return 0;
  return subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
}

function calculateTotal() {
  const subtotal = calculateSubtotal();
  return subtotal + calculateDelivery(subtotal);
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  el.cartCount.textContent = count;
  el.cartCount.classList.remove("bump");
  void el.cartCount.offsetWidth; // restart the animation
  el.cartCount.classList.add("bump");
}

function renderCart() {
  const entries = Object.keys(cart);
  if (entries.length === 0) {
    el.cartItems.innerHTML = `<div class="empty"><strong>Your cart is empty.</strong>
      <span>Add something from the catalogue to get started.</span></div>`;
  } else {
    el.cartItems.innerHTML = `<ul class="cart-list">` + entries.map((id) => {
      const p = getProduct(id);
      const qty = cart[id];
      return `<li class="cart-row" data-id="${id}">
        <div class="cart-thumb" aria-hidden="true">${p.image.length <= 4 ? p.image : "🛍️"}</div>
        <div class="cart-info">
          <strong>${p.name}</strong>
          <span class="muted">${formatPrice(p.price)} each</span>
          <div class="qty">
            <button class="icon-btn" data-action="dec" aria-label="Decrease quantity of ${p.name}" ${qty <= 1 ? "disabled" : ""}>−</button>
            <span aria-label="Quantity">${qty}</span>
            <button class="icon-btn" data-action="inc" aria-label="Increase quantity of ${p.name}">+</button>
          </div>
        </div>
        <div class="cart-end">
          <strong>${formatPrice(p.price * qty)}</strong>
          <button class="link-btn" data-action="remove" aria-label="Remove ${p.name}">Remove</button>
        </div>
      </li>`;
    }).join("") + `</ul>`;
  }

  const subtotal = calculateSubtotal();
  const delivery = calculateDelivery(subtotal);
  el.subtotal.textContent = formatPrice(subtotal);
  el.delivery.textContent = subtotal === 0 ? formatPrice(0) : delivery === 0 ? "Free" : formatPrice(delivery);
  el.grandTotal.textContent = formatPrice(calculateTotal());
  el.checkoutBtn.disabled = entries.length === 0;

  if (subtotal === 0) el.hint.textContent = "";
  else if (delivery === 0) el.hint.textContent = "You get free delivery on this order.";
  else el.hint.textContent = `Add ${formatPrice(FREE_DELIVERY_MIN - subtotal)} more for free delivery.`;
}

// Single place to refresh everything after the cart changes.
function commitCart() {
  saveCart();
  updateCartCount();
  renderCart();
}

/* ---------- localStorage ---------- */

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.warn("Could not save cart:", err); // e.g. private mode or storage full
  }
}

// Loads the saved cart safely: bad JSON, wrong shapes, unknown products
// and invalid quantities are all discarded.
function loadCart() {
  cart = {};
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return;
    Object.entries(saved).forEach(([id, qty]) => {
      if (getProduct(id) && Number.isInteger(qty) && qty >= 1) {
        cart[Number(id)] = Math.min(qty, MAX_QTY);
      }
    });
  } catch (err) {
    cart = {};
  }
  saveCart(); // write back the cleaned version (keeps cart in sync with catalogue)
}

/* ---------- Checkout dialog ---------- */

function openCheckout() {
  if (Object.keys(cart).length === 0) return;
  el.orderLines.innerHTML = `<ul class="order-list">` + Object.keys(cart).map((id) => {
    const p = getProduct(id);
    return `<li><span>${p.name} × ${cart[id]}</span><strong>${formatPrice(p.price * cart[id])}</strong></li>`;
  }).join("") + `</ul>`;

  const subtotal = calculateSubtotal();
  const delivery = calculateDelivery(subtotal);
  $("#dlgSubtotal").textContent = formatPrice(subtotal);
  $("#dlgDelivery").textContent = delivery === 0 ? "Free" : formatPrice(delivery);
  $("#dlgTotal").textContent = formatPrice(subtotal + delivery);

  el.checkoutView.hidden = false;
  el.successView.hidden = true;
  el.dialog.showModal();
}

function confirmDemoOrder() {
  const total = formatPrice(calculateTotal());
  const items = Object.values(cart).reduce((sum, q) => sum + q, 0);
  $("#successText").textContent = `Your demo order of ${items} item${items === 1 ? "" : "s"} (${total}) has been placed.`;
  cart = {};
  commitCart(); // clears UI, counter, totals and localStorage
  el.checkoutView.hidden = true;
  el.successView.hidden = false;
}

/* ---------- Events ---------- */

// Event delegation: one listener per container instead of one per button.
el.grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add]");
  if (btn) addToCart(btn.dataset.add);
});

el.cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const id = btn.closest("[data-id]").dataset.id;
  if (btn.dataset.action === "inc") changeQuantity(id, 1);
  if (btn.dataset.action === "dec") changeQuantity(id, -1);
  if (btn.dataset.action === "remove") removeItem(id);
});

el.search.addEventListener("input", (e) => { view.search = e.target.value; renderProducts(); });
el.category.addEventListener("change", (e) => { view.category = e.target.value; renderProducts(); });
el.sort.addEventListener("change", (e) => { view.sort = e.target.value; renderProducts(); });

el.checkoutBtn.addEventListener("click", openCheckout);
$("#closeDialogBtn").addEventListener("click", () => el.dialog.close());
$("#continueBtn").addEventListener("click", () => el.dialog.close());
$("#doneBtn").addEventListener("click", () => el.dialog.close());
$("#confirmBtn").addEventListener("click", confirmDemoOrder);
// Clicking the dark backdrop (the dialog element itself) closes it.
el.dialog.addEventListener("click", (e) => { if (e.target === el.dialog) el.dialog.close(); });

/* ---------- Start ---------- */

function init() {
  populateCategories();
  loadCart();
  renderProducts();
  renderCart();
  el.cartCount.textContent = Object.values(cart).reduce((s, q) => s + q, 0);
}
init();
