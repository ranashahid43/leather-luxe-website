const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;  // Render uses this (usually 10000)

// Middleware
app.use(bodyParser.json());

// Serve static files - robust for Render's /src directory
const publicPath = path.join(__dirname, 'public');
const srcPublicPath = path.join(__dirname, 'src', 'public');  // Fallback if needed

console.log('__dirname:', __dirname);
console.log('Trying public path:', publicPath);
console.log('Fallback public path:', srcPublicPath);

app.use(express.static(publicPath));
app.use(express.static(srcPublicPath));  // Extra safety

// Sample Products
let products = [
  { id: 1, name: 'Black Leather Jacket', price: 199.99, category: 'jackets', img: 'https://placehold.co/300x400?text=Black+Jacket', description: 'Premium black leather jacket' },
  { id: 2, name: 'Brown Leather Shoes', price: 89.99, category: 'shoes', img: 'https://placehold.co/300x400?text=Brown+Shoes', description: 'Comfortable leather shoes' },
  { id: 3, name: 'Red Leather Purse', price: 59.99, category: 'purses', img: 'https://placehold.co/300x400?text=Red+Purse', description: 'Stylish red purse' },
  { id: 4, name: 'Leather Wallet', price: 29.99, category: 'ladies', img: 'https://placehold.co/300x400?text=Wallet', description: 'Genuine leather wallet' }
];

// In-memory storage
let users = [];
let cart = [];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/cart', (req, res) => {
  cart.push(req.body);
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.json({ success: true, cart, total });
});

app.get('/api/cart', (req, res) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  res.json({ cart, total });
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

// Catch-all route - serve index.html with logging and fallback
app.get('*', (req, res) => {
  const primaryPath = path.join(__dirname, 'public', 'index.html');
  const fallbackPath = path.join(__dirname, 'src', 'public', 'index.html');

  console.log('Request for:', req.url);
  console.log('Trying to serve:', primaryPath);

  // Try primary path first
  fs.access(primaryPath, fs.constants.F_OK, (err) => {
    if (!err) {
      return res.sendFile(primaryPath);
    }

    console.log('Primary path not found, trying fallback:', fallbackPath);
    fs.access(fallbackPath, fs.constants.F_OK, (err2) => {
      if (!err2) {
        return res.sendFile(fallbackPath);
      }

      console.error('index.html not found in either location');
      res.status(404).send(`
        <h1>Site Loading Issue</h1>
        <p>Server is running, but index.html not found.</p>
        <p>Check Render logs for path details.</p>
        <p>__dirname: ${__dirname}</p>
      `);
    });
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Leather Luxe Shop is LIVE on port ${port}`);
  console.log(`Open your Render URL to see the site!`);
});
