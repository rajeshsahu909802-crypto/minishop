# MiniShop – Interactive E-Commerce App

A responsive mini e-commerce site built with **HTML5, CSS3 and vanilla JavaScript (ES6+)**. Products are rendered from a JavaScript array, the cart persists in `localStorage`, and checkout is a clearly labelled **demo** (no real payments, no card or banking details).

## Features
- Product cards generated dynamically from the `products` array (12 items, 4 categories)
- Search by name, category filter, sort by price (low→high / high→low), friendly "no results" message
- Cart stored as an object keyed by product ID: `{ id: quantity }`
- Add, increase, decrease (never below 1) and remove items; live cart counter; empty-cart message
- Subtotal via `reduce()`; delivery ₹50 below ₹999, free from ₹999, ₹0 for an empty cart
- Checkout preview using the native HTML `<dialog>` element, with demo-order confirmation
- Cart saved to `localStorage`; invalid or outdated saved data is cleaned on load
- Responsive (desktop, tablet, Android, iPhone); keyboard accessible; reduced-motion friendly

## Project structure
```
MiniShop/
├── index.html        Page structure, cart panel, checkout <dialog>
├── css/style.css     Design tokens, layout, cards, cart, dialog, media queries
├── js/products.js    The products array (loaded first)
├── js/app.js         All behaviour (loaded second, uses `products`)
└── README.md
```
`index.html` loads `css/style.css`, then `js/products.js`, then `js/app.js`. Order matters because `app.js` reads the global `products`.

## Run in VS Code
1. Open the `MiniShop` folder in VS Code (File → Open Folder).
2. Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.
3. Or simply double-click `index.html` to open it in a browser. No build step or dependencies.

## Key JavaScript functions
| Function | Purpose |
|---|---|
| `renderProducts()` | Filters, sorts and draws product cards; shows the no-results message |
| `addToCart(id)` | Adds 1 to the product's quantity (creates the entry if missing) |
| `changeQuantity(id, delta)` | Applies +1/−1, clamped between 1 and 99 |
| `removeItem(id)` | Deletes the product from the cart |
| `calculateSubtotal()` | `reduce()` over cart entries: price × quantity |
| `calculateTotal()` | Subtotal + delivery fee (0 for an empty cart) |
| `updateCartCount()` | Updates the navbar badge with total items |
| `renderCart()` | Redraws cart rows, totals, delivery hint, Checkout button state |
| `saveCart()` / `loadCart()` | Persist and safely restore the cart (try/catch + validation) |
| `openCheckout()` / `confirmDemoOrder()` | Show the order summary; confirm, clear cart and storage |

Event delegation is used on the product grid and cart list (one listener each).

## Testing checklist
1. Products appear from the array (12 cards). 2. Search "mug" → 1 result; "zzz" → friendly message. 3. Each category filter works. 4. Sorting orders by price. 5. Add to Cart twice on one product → quantity 2. 6. +/− work; − is disabled at 1. 7. Remove deletes the row; removing the last item shows the empty-cart message. 8. Counter, subtotal and total update instantly. 9. Subtotal ₹998 → delivery ₹50; ₹999+ → Free. (Mug ₹249 × 4 = ₹996 → +₹50; add a Mug + T-Shirt etc. to cross ₹999.) 10. Refresh → cart restored. 11. Checkout shows correct lines, subtotal, delivery, total and the demo notice. 12. Confirm Demo Order → success message, cart cleared, counter 0, storage updated. 13. Resize to 360px wide: no horizontal scroll.
Tip: to test bad storage, run `localStorage.setItem("minishop_cart_v1", "oops")` in the console and refresh; the app starts with an empty cart.

## Using real images
In `products.js`, set `image` to a path such as `"images/headphones.jpg"`; the app renders an `<img>`. Any value without `.` or `/` is shown as an emoji placeholder.

## Short description (for GitHub / internship submission)
MiniShop is a responsive mini e-commerce web app built with HTML, CSS and vanilla JavaScript. It renders products dynamically from a JS array, supports search, category filtering and price sorting, and has a full shopping cart (add, change quantity, remove) with `reduce()`-based totals and a free-delivery rule at ₹999. A native `<dialog>` checkout preview demonstrates the order flow without any real payment, and the cart persists across reloads using `localStorage`.
