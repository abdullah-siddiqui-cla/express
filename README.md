# Express.js MVC Architecture with JWT Authentication

This is an incremental guide to building a complete Express.js application with MVC architecture, JWT authentication, and RESTful APIs. Follow the steps below to understand how each component fits together.

## 📋 Prerequisites

- Node.js installed
- Basic understanding of JavaScript and Express.js
- Postman or similar tool for API testing

## 🚀 Project Setup

### Step 1: Environment Configuration

Create a `.env` file in the root directory:

```bash
# JWT Secret Key - Change this to a secure random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-123456789
```

### Step 2: Create Project Structure

Start with a basic Express app and create the MVC folder structure:

```bash
mkdir routes controllers services middlewares
```

Your final project structure should look like this:

```
6-express/
├── controllers/
│   ├── productController.js
│   └── userController.js
├── middlewares/
│   └── authMiddleware.js
├── routes/
│   ├── productRoutes.js
│   └── userRoutes.js
├── services/
│   ├── productService.js
│   ├── userService.js
│   └── jwtService.js
├── public/
├── views/
├── index.js
├── package.json
└── README.md
```

## 🔧 Step 2: Install Dependencies

```bash
npm install jsonwebtoken
```

> **Note**: If you encounter npm cache issues, run `npm cache clean --force` first.

## 📦 Step 3: Create Product Service Layer

The **Service Layer** handles business logic and data management. Let's start with the Product Service:

**`services/productService.js`**

```javascript
// Product Service - handles all product-related business logic

// Module-level state
let products = [
  { id: 1, name: "Product 1", price: 100 },
  { id: 2, name: "Product 2", price: 200 },
  { id: 3, name: "Product 3", price: 300 },
];
let nextId = 4;

// Get all products
export const getAllProducts = () => {
  return products;
};

// Get product by ID
export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id));
};

// Create new product
export const createProduct = (productData) => {
  const newProduct = {
    id: nextId++,
    ...productData,
  };
  products.push(newProduct);
  return newProduct;
};

// Update product by ID
export const updateProduct = (id, updateData) => {
  const productIndex = products.findIndex(
    (product) => product.id === parseInt(id)
  );
  if (productIndex === -1) {
    return null;
  }

  products[productIndex] = {
    ...products[productIndex],
    ...updateData,
  };
  return products[productIndex];
};

// Delete product by ID
export const deleteProduct = (id) => {
  const productIndex = products.findIndex(
    (product) => product.id === parseInt(id)
  );
  if (productIndex === -1) {
    return null;
  }

  const deletedProduct = products[productIndex];
  products.splice(productIndex, 1);
  return deletedProduct;
};
```

**Key Concepts:**

- Service layer encapsulates business logic
- Manages data storage (in-memory array for demo)
- Provides CRUD operations
- Returns data without HTTP concerns

## 🎯 Step 4: Create Product Controller

The **Controller Layer** handles HTTP requests and responses, delegating business logic to services:

**`controllers/productController.js`**

```javascript
// Product Controller - handles HTTP requests and responses for products
import {
  getAllProducts as getAllProductsService,
  getProductById as getProductByIdService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
} from "../services/productService.js";

// Get all products
export const getAllProducts = (req, res) => {
  try {
    const products = getAllProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product by ID
export const getProductById = (req, res) => {
  try {
    const { id } = req.params;
    const product = getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new product
export const createProduct = (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const newProduct = createProductService({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product
export const updateProduct = (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const updatedProduct = updateProductService(id, { name, price });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product
export const deleteProduct = (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = deleteProductService(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
```

**Key Concepts:**

- Controllers handle HTTP layer concerns (status codes, request/response)
- Import and use services for business logic
- Validate request data
- Return appropriate HTTP responses
- Export functions for routing

## 🛣️ Step 5: Create Product Routes

The **Routes Layer** defines API endpoints and maps them to controllers:

**`routes/productRoutes.js`**

```javascript
// Product Routes - defines RESTful API endpoints for products
import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// GET /products - Get all products
router.get("/", getAllProducts);

// GET /products/:id - Get product by ID
router.get("/:id", getProductById);

// POST /products - Create new product
router.post("/", createProduct);

// PUT /products/:id - Update product by ID
router.put("/:id", updateProduct);

// DELETE /products/:id - Delete product by ID
router.delete("/:id", deleteProduct);

export default router;
```

**Key Concepts:**

- Routes define URL patterns and HTTP methods
- Import controller functions
- Use Express Router for modular routing
- Follow RESTful conventions

## 🔐 Step 6: Create JWT Service

The JWT Service handles token creation and verification:

**`services/jwtService.js`**

```javascript
// JWT Service - handles JWT token signing and verification
// Note: This requires 'jsonwebtoken' and 'dotenv' packages
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// Sign a JWT token
export const sign = (payload, expiresIn = "24h") => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });
  return token;
};

// Verify a JWT token
export const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
```

**Production Note:** Replace the mock implementation with actual `jsonwebtoken` library calls.

## 👤 Step 7: Create User Service

The User Service handles authentication logic:

**`services/userService.js`**

```javascript
// User Service - handles user authentication and management
import { sign } from "./jwtService.js";

// Module-level state
const users = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
  },
  { id: 2, username: "user", password: "user123", email: "user@example.com" },
];

// Authenticate user with username and password
export const authenticateUser = (username, password) => {
  const user = users.find((u) => u.username === username);

  if (!user) {
    return null; // User not found
  }

  if (user.password !== password) {
    return null; // Password doesn't match
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Generate JWT token for authenticated user
export const generateToken = (user) => {
  return sign({
    userId: user.id,
    username: user.username,
    email: user.email,
  });
};

// Get user by ID (without password)
export const getUserById = (id) => {
  const user = users.find((u) => u.id === parseInt(id));
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
```

## 🎮 Step 8: Create User Controller

**`controllers/userController.js`**

```javascript
// User Controller - handles user authentication requests
import { authenticateUser, generateToken } from "../services/userService.js";

// Sign in user
export const signIn = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password are required",
      });
    }

    // Authenticate user
    const user = authenticateUser(username, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid username or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response with token
    res.json({
      success: true,
      message: "Sign in successful",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
```

## 🛤️ Step 9: Create User Routes

**`routes/userRoutes.js`**

```javascript
// User Routes - defines API endpoints for user operations
import express from "express";
import { signIn } from "../controllers/userController.js";

const router = express.Router();

// POST /users/signin - Sign in user
router.post("/signin", signIn);

export default router;
```

## 🛡️ Step 10: Create Authentication Middleware

The **Middleware Layer** handles cross-cutting concerns like authentication:

**`middlewares/authMiddleware.js`**

```javascript
// Authentication Middleware - protects routes by verifying JWT tokens
import { verify } from "../services/jwtService.js";
import { getUserById } from "../services/userService.js";

// Middleware function to authenticate requests
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access token required",
      });
    }

    // Verify the token
    const decoded = verify(token);

    // Get user details and attach to request
    const user = getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid token - user not found",
      });
    }

    // Attach user to request object for use in subsequent middleware/controllers
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token",
    });
  }
};
```

**Key Concepts:**

- Middleware runs before route handlers
- Extracts and verifies JWT tokens
- Attaches user data to request object
- Protects routes by rejecting unauthorized requests

## 🚀 Step 11: Update Main Application File

**`index.js`** - Add imports and route configuration:

```javascript
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";

const app = express();

// ... existing middleware ...

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", authenticateToken, productRoutes);

// ... existing routes ...

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// ... existing app.listen ...
```

## 🧪 Step 12: Test the APIs

### 1. Sign In to Get Token

```bash
POST /api/users/signin
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Sign in successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Access Protected Product Routes

Use the token from sign-in in the Authorization header:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Get all products:**

```bash
GET /api/products
Authorization: Bearer YOUR_TOKEN_HERE
```

**Create product:**

```bash
POST /api/products
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "New Product",
  "price": 150
}
```

**Get product by ID:**

```bash
GET /api/products/1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Update product:**

```bash
PUT /api/products/1
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Product",
  "price": 200
}
```

**Delete product:**

```bash
DELETE /api/products/1
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📚 Key Concepts Learned

### MVC Architecture

- **Model**: Services handle data and business logic
- **View**: Not applicable (API returns JSON)
- **Controller**: Handle HTTP requests/responses

### Layer Separation

- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Process requests, call services, format responses
- **Services**: Contain business logic and data management
- **Middleware**: Handle cross-cutting concerns (auth, logging, etc.)

### RESTful API Design

- `GET /resource` - List all resources
- `GET /resource/:id` - Get specific resource
- `POST /resource` - Create new resource
- `PUT /resource/:id` - Update resource
- `DELETE /resource/:id` - Delete resource

### Authentication Flow

1. User signs in with credentials
2. Server validates credentials
3. Server returns JWT token
4. Client includes token in subsequent requests
5. Server verifies token before allowing access

### Error Handling

- Use middleware for consistent error responses
- Include appropriate HTTP status codes
- Provide meaningful error messages

## 🔒 Security Considerations

1. **Never store plain passwords in production** - use bcrypt for hashing
2. **Use strong JWT secrets** - store in environment variables
3. **Implement token refresh** - for better security
4. **Add rate limiting** - to prevent brute force attacks
5. **Validate all inputs** - prevent injection attacks

## 🚀 Next Steps

1. Add a real database (MongoDB, PostgreSQL)
2. Implement password hashing with bcrypt
3. Add input validation with Joi or express-validator
4. Implement refresh tokens
5. Add role-based authorization
6. Add comprehensive logging
7. Write unit and integration tests

This guide provides a solid foundation for building scalable Express.js applications with proper separation of concerns!
