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

# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/your-database-name
```

### Step 2: Create Project Structure

Start with a basic Express app and create the MVC folder structure:

```bash
mkdir routes controllers services middlewares models config seeds
```

Your final project structure should look like this:

```
6-express/
├── config/
│   └── database.js
├── controllers/
│   ├── productController.js
│   └── userController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── Product.js
│   └── User.js
├── routes/
│   ├── productRoutes.js
│   └── userRoutes.js
├── seeds/
│   ├── index.js
│   ├── productSeeds.js
│   └── userSeeds.js
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
npm install express mongoose jsonwebtoken dotenv ejs cors
npm install --save-dev nodemon
```

> **Note**: If you encounter npm cache issues, run `npm cache clean --force` first.

## 📦 Step 3: Create Database Connection

The **Database Configuration** handles MongoDB connection using Mongoose:

**`config/database.js`**

```javascript
import mongoose from "mongoose";

/**
 * Database Configuration
 *
 * This module handles the MongoDB connection using Mongoose.
 * Make sure to set MONGODB_URI in your .env file before running the app.
 */

// MongoDB connection function
export const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variable
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
```

## 📦 Step 4: Create Models

The **Model Layer** defines the database schemas using Mongoose:

**`models/Product.js`**

```javascript
import mongoose from "mongoose";

// Define the Product schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Product model
const Product = mongoose.model("Product", productSchema);

export default Product;
```

**`models/User.js`**

```javascript
import mongoose from "mongoose";

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);

export default User;
```

## 📦 Step 5: Create Product Service Layer

The **Service Layer** handles business logic and data management using models:

**`services/productService.js`**

```javascript
// Product Service - handles all product-related business logic
import Product from "../models/Product.js";

// Get all products from database
export const getAllProducts = async () => {
  return await Product.find();
};

// Get product by ID from database
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// Create new product in database
export const createProduct = async (productData) => {
  const newProduct = new Product(productData);
  return await newProduct.save();
};

// Update product by ID in database
export const updateProduct = async (id, updateData) => {
  // findByIdAndUpdate returns the updated document
  // { new: true } option returns the modified document rather than the original
  return await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

// Delete product by ID from database
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
```

**Key Concepts:**

- Service layer encapsulates business logic
- Uses Mongoose models to interact with MongoDB
- Provides async CRUD operations
- Returns data without HTTP concerns

## 🎯 Step 6: Create Product Controller

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
export const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const newProduct = await createProductService({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const updatedProduct = await updateProductService(id, { name, price });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProductService(id);

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

## 🛣️ Step 7: Create Product Routes

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

## 🔐 Step 8: Create JWT Service

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

## 👤 Step 9: Create User Service

The User Service handles authentication logic using the User model:

**`services/userService.js`**

```javascript
// User Service - handles user authentication and management
import { sign } from "./jwtService.js";
import User from "../models/User.js";

// Authenticate user with username and password from database
export const authenticateUser = async (username, password) => {
  // Find user by username
  const user = await User.findOne({ username });

  if (!user) {
    return null; // User not found
  }

  // Note: In production, you should use bcrypt to hash and compare passwords
  if (user.password !== password) {
    return null; // Password doesn't match
  }

  // Return user without password
  const userObject = user.toObject();
  const { password: _, ...userWithoutPassword } = userObject;
  return userWithoutPassword;
};

// Generate JWT token for authenticated user
export const generateToken = (user) => {
  return sign({
    userId: user._id, // MongoDB uses _id instead of id
    username: user.username,
    email: user.email,
  });
};

// Get user by ID (without password)
export const getUserById = async (id) => {
  // Use select('-password') to exclude password from the result
  const user = await User.findById(id).select("-password");
  return user;
};
```

## 🎮 Step 10: Create User Controller

**`controllers/userController.js`**

```javascript
// User Controller - handles user authentication requests
import { authenticateUser, generateToken } from "../services/userService.js";

// Sign in user
export const signIn = async (req, res) => {
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
    const user = await authenticateUser(username, password);

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

## 🛤️ Step 11: Create User Routes

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

## 🛡️ Step 12: Create Authentication Middleware

The **Middleware Layer** handles cross-cutting concerns like authentication:

**`middlewares/authMiddleware.js`**

```javascript
// Authentication Middleware - protects routes by verifying JWT tokens
import { verify } from "../services/jwtService.js";
import { getUserById } from "../services/userService.js";

// Middleware function to authenticate requests
export const authenticateToken = async (req, res, next) => {
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
    const user = await getUserById(decoded.userId);

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

## 🚀 Step 13: Update Main Application File

**`index.js`** - Add imports, database connection, and route configuration:

```javascript
import "dotenv/config"; // Load environment variables from .env file
import express from "express";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import { connectDB } from "./config/database.js";

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", authenticateToken, productRoutes);

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
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.listen(3011, () => {
  console.log("Server is running on port 3011");
});
```

## 🌱 Step 14: Create Database Seeds

The **Seeds** populate the database with initial data for development and testing:

**`seeds/userSeeds.js`**

```javascript
import User from "../models/User.js";

// Sample user data
// Note: In production, passwords should be hashed using bcrypt
const users = [
  {
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
  },
  {
    username: "john_doe",
    password: "password123",
    email: "john.doe@example.com",
  },
  // ... more users
];

// Function to seed users into the database
export const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Insert new users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users seeded successfully`);

    return createdUsers;
  } catch (error) {
    console.error("Error seeding users:", error.message);
    throw error;
  }
};
```

**`seeds/productSeeds.js`**

```javascript
import Product from "../models/Product.js";

// Sample product data
const products = [
  { name: "Laptop", price: 999.99 },
  { name: "Smartphone", price: 699.99 },
  // ... more products
];

// Function to seed products into the database
export const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products seeded successfully`);

    return createdProducts;
  } catch (error) {
    console.error("Error seeding products:", error.message);
    throw error;
  }
};
```

**`seeds/index.js`**

```javascript
import "dotenv/config"; // Load environment variables from .env file
import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import { seedProducts } from "./productSeeds.js";
import { seedUsers } from "./userSeeds.js";

// Main function to run all seeds
const runSeeds = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("\nStarting database seeding...\n");

    // Run all seed functions
    await seedUsers();
    await seedProducts();

    console.log("\nAll seeds completed successfully!\n");

    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seeds
runSeeds();
```

**Run seeds:**

```bash
npm run seed
```

## 🧪 Step 15: Test the APIs

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

- **Model**: Mongoose schemas define data structure and validation
- **View**: Not applicable (API returns JSON)
- **Controller**: Handle HTTP requests/responses
- **Service**: Business logic and database operations using models

### Layer Separation

- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Process requests, call services, format responses
- **Services**: Contain business logic and interact with models
- **Models**: Define database schemas and provide data access
- **Middleware**: Handle cross-cutting concerns (auth, logging, etc.)
- **Config**: Database connection and configuration

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

1. Implement password hashing with bcrypt
2. Add input validation with Joi or express-validator
3. Implement refresh tokens
4. Add role-based authorization
5. Add comprehensive logging
6. Write unit and integration tests
7. Add environment-specific configurations

This guide provides a solid foundation for building scalable Express.js applications with proper separation of concerns!
