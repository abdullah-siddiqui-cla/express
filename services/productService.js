// Product Service - handles all product-related business logic

// Module-level state
let products = [
  { id: 1, name: 'Product 1', price: 100 },
  { id: 2, name: 'Product 2', price: 200 },
  { id: 3, name: 'Product 3', price: 300 },
];
let nextId = 4;

// Get all products
export const getAllProducts = () => {
  return products;
};

// Get product by ID
export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

// Create new product
export const createProduct = (productData) => {
  const newProduct = {
    id: nextId++,
    ...productData
  };
  products.push(newProduct);
  return newProduct;
};

// Update product by ID
export const updateProduct = (id, updateData) => {
  const productIndex = products.findIndex(product => product.id === parseInt(id));
  if (productIndex === -1) {
    return null;
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updateData
  };
  return products[productIndex];
};

// Delete product by ID
export const deleteProduct = (id) => {
  const productIndex = products.findIndex(product => product.id === parseInt(id));
  if (productIndex === -1) {
    return null;
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  return deletedProduct;
};
