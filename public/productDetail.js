// Import the product data from product.js
import products from './products.js';
import stockPriceData from './stock-price.js';

// Get the container element for the Product Detail Page (PDP)
const container = document.querySelector('#product-detail');

// Extract the productId from the URL query parameters
// const params = new URLSearchParams(window.location.search);
// const productId = params.get('id');
const urlParts = window.location.pathname.split('-');
const productId = urlParts[0].substring(1); // Ignore the leading slash
const brand = urlParts.slice(1).join(' ').replace(/%20/g, ' ');

// Find the product with the matching productId from the product.js data
const product = products.find((p) => p.id === parseInt(productId));

// Function to fetch stock and price information from the API endpoint
function fetchStockPriceInformation() {
  // Mock AJAX request to the API endpoint (/api/stockprice/code)
  // Replace this code with your own implementation to fetch the data from the server
  const apiUrl = `http://localhost:3000/api/stockprice/${product.skus[0].code}`;
  console.log("_____update______")
  const xhr = new XMLHttpRequest();
  xhr.open('GET', apiUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      updateStockPrice(response);
    }
  };
  xhr.send();
}

// Function to update the stock and price information in the PDP
function updateStockPrice(stockPrice) {
  const stockElement = container.querySelector('.stock');
  const priceElement = container.querySelector('.price');

  stockElement.textContent = stockPrice.stock;
  priceElement.textContent = `${(stockPrice.price / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
}

// Function to render the product details in the PDP
function renderProductDetails() {
  if (product) {
    container.innerHTML = `
      <div class="product-image">
       <img src="${product.image}" alt="${product.brand}">
      </div>
       <h2>${product.brand}</h2>
      <p>${product.information}</p>
      <ul>
        <li>Style: ${product.style}</li>
        <li>Substyle: ${product.substyle}</li>
        <li>ABV: ${product.abv}</li>
        <li>Origin: ${product.origin}</li>
      </ul>
      <div>
        <h3>Stock: <span class="stock">Loading...</span></h3>
        <h3>Price: <span class="price">Loading...</span></h3>
      </div>
    `;
    fetchStockPriceInformation();
    setInterval(fetchStockPriceInformation, 5000); // Update the stock and price every 5 seconds
  }
}

// Call the renderProductDetails function to display the product details in the PDP
renderProductDetails();