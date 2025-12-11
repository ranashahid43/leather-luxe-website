const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve all files from /public

// Sample Products (same as frontend)
let products = [
  { id: 1, name: 'Black Leather Jacket', price: 199.99, category: 'jackets', img: 'https://placehold.co/300x400?text=Black+Jacket', description: 'Premium black leather jacket' },
  { id: 2, name: 'Brown Leather Shoes', price: 89.99, category: 'shoes', img: 'https://placehold.co/300x400?text=Brown+Shoes', description: 'Comfortable leather shoes' },
  { id: 3, name: 'Red Leather Purse', price: 59.99, category: 'purses', img: 'https://placehold.co/300x400?text=Red+Purse', description: 'Stylish red purse' },
  { id: 4, name: 'Leather Wallet', price: 29.99, category: 'ladies', img: 'https://placehold.co/300x400?text=Wallet', description: 'Genuine leather wallet' }
];

// Fake user database (in memory)
let users = [];
let cart = []; // Shared cart for demo (in real app: per user)

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  res.json({ success: true, cart: cart, total: cart.reduce((sum, item) => sum + item.price, 0) });
});

app.get('/api/cart', (req, res) => {
  res.json({ cart: cart, total: cart.reduce((sum, item) => sum + item.price, 0) });
});

app.post('/api/clear-cart', (req, res) => {
  cart = [];
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    res.json({ success: false, message: "User already exists" });
  } else {
    users.push({ email, password });
    res.json({ success: true, message: "Account created! Please login." });
  }
});

// Serve the website
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Leather Luxe Shop is LIVE at http://localhost:${port}`);
  console.log(`Open this link in browser to see your shop!`);
});