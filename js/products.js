// Product catalogue. Prices are plain numbers (rupees); they are formatted only when displayed.
// "image" holds an emoji used as a visual placeholder. You can replace it with a file path
// such as "images/headphones.jpg" and app.js will render an <img> instead.
const products = [
  { id: 1,  name: "Wireless Headphones", price: 1499, category: "Electronics", description: "Over-ear Bluetooth headphones with 30-hour battery life.", image: "🎧", rating: 4.5 },
  { id: 2,  name: "Smart Watch",         price: 2999, category: "Electronics", description: "Tracks steps, sleep and heart rate with a bright display.", image: "⌚", rating: 4.3 },
  { id: 3,  name: "Power Bank 10000mAh", price: 899,  category: "Electronics", description: "Slim fast-charging power bank with dual USB ports.", image: "🔋", rating: 4.4 },
  { id: 4,  name: "Leather Wallet",      price: 599,  category: "Accessories", description: "Slim bifold wallet with six card slots.", image: "👛", rating: 4.2 },
  { id: 5,  name: "Sunglasses",          price: 799,  category: "Accessories", description: "UV400 polarised lenses in a lightweight frame.", image: "🕶️", rating: 4.1 },
  { id: 6,  name: "Canvas Backpack",     price: 1199, category: "Accessories", description: "Water-resistant 20L backpack with laptop sleeve.", image: "🎒", rating: 4.6 },
  { id: 7,  name: "Cotton T-Shirt",      price: 399,  category: "Fashion",     description: "Soft, breathable everyday crew-neck tee.", image: "👕", rating: 4.0 },
  { id: 8,  name: "Running Shoes",       price: 2199, category: "Fashion",     description: "Cushioned, lightweight shoes for daily runs.", image: "👟", rating: 4.5 },
  { id: 9,  name: "Denim Jacket",        price: 1799, category: "Fashion",     description: "Classic mid-wash jacket with a relaxed fit.", image: "🧥", rating: 4.3 },
  { id: 10, name: "Ceramic Coffee Mug",  price: 249,  category: "Home",        description: "350ml glazed mug, microwave and dishwasher safe.", image: "☕", rating: 4.7 },
  { id: 11, name: "LED Desk Lamp",       price: 699,  category: "Home",        description: "Dimmable lamp with three colour temperatures.", image: "💡", rating: 4.4 },
  { id: 12, name: "Scented Candle Set",  price: 449,  category: "Home",        description: "Set of three soy-wax candles in calming scents.", image: "🕯️", rating: 4.2 }
];
