require('@babel/register');

const express = require('express');
const app = express();
const path = require('path');
const chokidar = require('chokidar');

// Enable JSON body parsing
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Mock data
let stockPriceData = require('./public/stock-price');

// Watch for changes in stock-price.js file
const watcher = chokidar.watch('./public/stock-price.js', { ignoreInitial: true });

watcher.on('change', () => {
  console.log('stock-price.js file changed. Reloading data...');
  try {
    delete require.cache[require.resolve('./public/stock-price')];
    stockPriceData = require('./public/stock-price');
    console.log('Data reloaded successfully.');
  } catch (error) {
    console.error('Failed to reload data:', error);
  }
});

// Mock API endpoint to get stock and price information by code
app.get('/api/stockprice/:code', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  const code = req.params.code;
  const stockPrice = stockPriceData.default[code];

  if (stockPrice) {
    res.json(stockPrice);
  } else {
    res.status(404).json({ error: 'Stock and price data not found.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Route to handle PDP URLs
app.get('/:productId-:productBrand', (req, res) => {
  res.sendFile(path.join(__dirname + '/productDetail.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});