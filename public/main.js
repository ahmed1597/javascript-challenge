// Import the product data from product.js
import products from './products.js';

// Get the container element for the Product Listing Page (PLP)
const container = document.querySelector('#product-list');

// Generate the HTML for each product and append it to the container
function renderProductList() {
  let html = '';
  for (const product of products) {
    html += `
      <div class="product" data-product-id="${product.id}">
        <div class="image-container">
          <img src="${product.image}" alt="${product.brand}">
        </div>
        <h3>${product.brand}</h3>
      </div>
    `;
  }
  container.innerHTML = html;
}

// Call the renderProductList function to generate and display the product list
renderProductList();

// Add event listener for product clicks to navigate to Product Detail Page (PDP)
container.addEventListener('click', (event) => {
  const productElement = event.target.closest('.product');
  if (productElement) {
    const productId = productElement.dataset.productId;
    const brand = event.target.alt;
    const url = `/${productId}-${brand.toLowerCase().replace(' ', '')}`;
    // Navigate to PDP using the productId
    // window.location.href = `productDetail.html?id=${productId}`;
    window.location.href = url;
  }
});