# Backend API Documentation - Recycle Marketplace App

## Overview
This document outlines all the API endpoints required for the Recycle/Waste Marketplace mobile application built with Node.js, Express, and MongoDB. The app enables users to buy and sell recyclable/waste items, manage their profiles, and track purchase history.

---

## Base URL
```
http://localhost:5000/api
```

---

## Authentication
Simple session-based authentication. After login, the user session is maintained via cookies.

**Note:** No JWT tokens required. Session is managed automatically by the server.

---

## 1. User Authentication & Management

### 1.1 User Registration
**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-11-20T10:30:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

**Validation Rules:**
- `username`: Required, 3-30 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters

---

### 1.2 User Login
**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and create session

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://i.pravatar.cc/200"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 1.3 Get User Profile
**Endpoint:** `GET /users/profile`

**Description:** Get authenticated user's profile information

**Headers:** Requires user to be logged in (session-based)

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "avatar": "https://i.pravatar.cc/200",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 1.4 Update User Profile
**Endpoint:** `PUT /users/profile`

**Description:** Update user profile information

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "username": "john_doe_updated",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe_updated",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### 1.5 Change Password
**Endpoint:** `PUT /users/change-password`

**Description:** Change user password

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 1.6 Logout
**Endpoint:** `POST /auth/logout`

**Description:** Destroy user session

**Headers:** Requires user to be logged in (session-based)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. Product/Item Management

### 2.1 Get All Products (Marketplace Listing)
**Endpoint:** `GET /products`

**Description:** Retrieve all available products with filtering and search

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category (Furniture, Electronics, Clothing, Books, Home Decor, Toys, Appliances)
- `search` (optional): Search by product name
- `status` (optional): Filter by status (available, pending, sold)
- `location` (optional): Filter by location
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price

**Example Request:**
```
GET /products?category=Furniture&search=chair&page=1&limit=20
```

**Response (Success - 200):**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Vintage Wooden Chair",
      "title": "Vintage Wooden Chair",
      "description": "A beautifully crafted vintage wooden chair, perfect for your living room or office space.",
      "price": 15.00,
      "status": "available",
      "location": "2 mi away",
      "category": "Furniture",
      "imageUri": "https://images.unsplash.com/photo-1649003366476-2d968f76d37a",
      "sellerId": "507f191e810c19729de860ea",
      "sellerName": "Jane Smith",
      "createdAt": "2024-11-18T08:30:00Z",
      "updatedAt": "2024-11-18T08:30:00Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Classic Floor Lamp",
      "title": "Classic Floor Lamp",
      "description": "A stylish floor lamp with adjustable brightness.",
      "price": 0,
      "status": "available",
      "location": "Brooklyn, NY",
      "category": "Electronics",
      "imageUri": "https://images.unsplash.com/photo-1571406487954-dc11b0c0767d",
      "sellerId": "507f191e810c19729de860eb",
      "sellerName": "Mike Johnson",
      "createdAt": "2024-11-19T14:20:00Z",
      "updatedAt": "2024-11-19T14:20:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

---

### 2.2 Get Single Product Details
**Endpoint:** `GET /products/:id`

**Description:** Get detailed information about a specific product

**Example Request:**
```
GET /products/prod_001
```

**Response (Success - 200):**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Vintage Wooden Chair",
    "title": "Vintage Wooden Chair",
    "description": "A beautifully crafted vintage wooden chair, perfect for your living room or office space. Sturdy, comfortable, and adds a rustic charm.",
    "price": 15.00,
    "status": "available",
    "location": "2 mi away",
    "category": "Furniture",
    "imageUri": "https://images.unsplash.com/photo-1649003366476-2d968f76d37a",
    "sellerId": "507f191e810c19729de860ea",
    "sellerName": "Jane Smith",
    "sellerEmail": "jane@example.com",
    "createdAt": "2024-11-18T08:30:00Z",
    "updatedAt": "2024-11-18T08:30:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

### 2.3 Create New Product (Post Item)
**Endpoint:** `POST /products`

**Description:** Create a new product listing

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "name": "John Doe",
  "title": "Used Cardboard Boxes (10kg)",
  "description": "10kg of flattened cardboard boxes in good condition, perfect for recycling or moving.",
  "price": 5.00,
  "location": "Manhattan, NY",
  "status": "available",
  "category": "Electronics",
  "imageUri": "https://example.com/image.jpg"
}
```

**Field Descriptions:**
- `name`: Seller's name (from the current user or manual input)
- `title`: Product title/headline
- `description`: Detailed product description
- `price`: Price in USD (use 0 for free items)
- `location`: Pickup location
- `status`: Listing status (available, pending, sold)
- `category`: Product category
- `imageUri`: Product image URL

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Product posted successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "John Doe",
    "title": "Used Cardboard Boxes (10kg)",
    "description": "10kg of flattened cardboard boxes in good condition.",
    "price": 5.00,
    "location": "Manhattan, NY",
    "status": "available",
    "category": "Electronics",
    "imageUri": "https://example.com/image.jpg",
    "sellerId": "507f191e810c19729de860ea",
    "createdAt": "2024-11-20T10:45:00Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    },
    {
      "field": "imageUri",
      "message": "Image URL is required"
    }
  ]
}
```

---

### 2.4 Update Product
**Endpoint:** `PUT /products/:id`

**Description:** Update an existing product listing (only by owner)

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "title": "Updated Product Title",
  "description": "Updated description",
  "price": 12.00,
  "status": "pending",
  "location": "Brooklyn, NY",
  "imageUri": "https://example.com/new-image.jpg"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Updated Product Title",
    "description": "Updated description",
    "price": 12.00,
    "status": "pending",
    "location": "Brooklyn, NY",
    "imageUri": "https://example.com/new-image.jpg",
    "updatedAt": "2024-11-20T11:00:00Z"
  }
}
```

---

### 2.5 Delete Product
**Endpoint:** `DELETE /products/:id`

**Description:** Delete a product listing (only by owner)

**Headers:** Requires user to be logged in (session-based)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

### 2.6 Get User's Posted Items
**Endpoint:** `GET /users/my-listings`

**Description:** Get all products posted by the authenticated user

**Headers:** Requires user to be logged in (session-based)

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status

**Response (Success - 200):**
```json
{
  "success": true,
  "listings": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Used Cardboard Boxes (10kg)",
      "price": 5.00,
      "status": "available",
      "imageUri": "https://example.com/image.jpg",
      "createdAt": "2024-11-20T10:45:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 12
  }
}
```

---

## 3. Order/Purchase Management

### 3.1 Create Order (Purchase Item)
**Endpoint:** `POST /orders`

**Description:** Create a new order/purchase

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 1,
  "buyerMessage": "Interested in this item. Can I pick it up tomorrow?",
  "paymentMethod": "cash_on_pickup"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-8943",
    "productId": "507f1f77bcf86cd799439011",
    "productName": "Vintage Wooden Chair",
    "sellerId": "507f191e810c19729de860ea",
    "buyerId": "507f191e810c19729de860eb",
    "quantity": 1,
    "totalAmount": 15.00,
    "status": "pending",
    "paymentMethod": "cash_on_pickup",
    "createdAt": "2024-11-20T12:00:00Z"
  }
}
```

---

### 3.2 Get Order History (Purchase History)
**Endpoint:** `GET /orders/history`

**Description:** Get authenticated user's order history

**Headers:** Requires user to be logged in (session-based)

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Orders per page
- `status` (optional): Filter by status (pending, shipped, delivered, cancelled)

**Response (Success - 200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "orderNumber": "ORD-8942",
      "date": "2024-10-25T08:30:00Z",
      "total": 49.99,
      "status": "delivered",
      "items": 3,
      "productName": "Ceramic Plant Pot",
      "productImage": "https://example.com/pot.jpg"
    },
    {
      "_id": "507f1f77bcf86cd799439021",
      "orderNumber": "ORD-1205",
      "date": "2024-10-18T14:20:00Z",
      "total": 125.50,
      "status": "shipped",
      "items": 1,
      "productName": "Comfortable Sofa",
      "productImage": "https://example.com/sofa.jpg"
    },
    {
      "_id": "507f1f77bcf86cd799439022",
      "orderNumber": "ORD-5481",
      "date": "2024-10-01T09:15:00Z",
      "total": 7.99,
      "status": "cancelled",
      "items": 1,
      "productName": "Kids Toy Set",
      "productImage": "https://example.com/toy.jpg"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 5
  }
}
```

---

### 3.3 Get Order Details
**Endpoint:** `GET /orders/:orderId`

**Description:** Get detailed information about a specific order

**Headers:** Requires user to be logged in (session-based)

**Response (Success - 200):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-8942",
    "date": "2024-10-25T08:30:00Z",
    "status": "delivered",
    "totalAmount": 49.99,
    "buyer": {
      "buyerId": "507f191e810c19729de860ea",
      "buyerName": "John Doe",
      "buyerEmail": "john@example.com"
    },
    "seller": {
      "sellerId": "507f191e810c19729de860eb",
      "sellerName": "Jane Smith",
      "sellerEmail": "jane@example.com"
    },
    "productId": "507f1f77bcf86cd799439011",
    "productName": "Ceramic Plant Pot",
    "productImage": "https://example.com/pot.jpg",
    "quantity": 2,
    "paymentMethod": "cash_on_pickup",
    "notes": "Interested in this item",
    "createdAt": "2024-10-25T08:30:00Z",
    "updatedAt": "2024-10-26T10:15:00Z"
  }
}
```

---

### 3.4 Update Order Status
**Endpoint:** `PUT /orders/:orderId/status`

**Description:** Update order status (seller only)

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "status": "shipped",
  "notes": "Item shipped via FedEx, tracking #12345"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-8942",
    "status": "shipped",
    "updatedAt": "2024-11-20T13:00:00Z"
  }
}
```

---

### 3.5 Cancel Order
**Endpoint:** `PUT /orders/:orderId/cancel`

**Description:** Cancel an order (buyer only, before shipped)

**Headers:** Requires user to be logged in (session-based)

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "ORD-8942",
    "status": "cancelled",
    "cancelledAt": "2024-11-20T13:30:00Z"
  }
}
```

---

## 4. Categories

### 4.1 Get All Categories
**Endpoint:** `GET /categories`

**Description:** Get list of all product categories

**Response (Success - 200):**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "name": "All",
      "icon": "apps-outline",
      "productCount": 100
    },
    {
      "_id": "507f1f77bcf86cd799439031",
      "name": "Furniture",
      "icon": "bed-outline",
      "productCount": 25
    },
    {
      "_id": "507f1f77bcf86cd799439032",
      "name": "Electronics",
      "icon": "tv-outline",
      "productCount": 30
    },
    {
      "_id": "507f1f77bcf86cd799439033",
      "name": "Clothing",
      "icon": "shirt-outline",
      "productCount": 15
    },
    {
      "_id": "507f1f77bcf86cd799439034",
      "name": "Books",
      "icon": "book-outline",
      "productCount": 10
    },
    {
      "_id": "507f1f77bcf86cd799439035",
      "name": "Home Decor",
      "icon": "home-outline",
      "productCount": 8
    },
    {
      "_id": "507f1f77bcf86cd799439036",
      "name": "Toys",
      "icon": "game-controller-outline",
      "productCount": 7
    },
    {
      "_id": "507f1f77bcf86cd799439037",
      "name": "Appliances",
      "icon": "calculator-outline",
      "productCount": 5
    }
  ]
}
```

---

## 5. Image Upload (Optional)

### 5.1 Upload Image
**Endpoint:** `POST /upload/image`

**Description:** Upload product image and get URL (if not using external URLs)

**Headers:**
- Requires user to be logged in (session-based)
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
```
image: [File]
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "imageUrl": "http://localhost:5000/uploads/prod_img_12345.jpg"
}
```

---

## Error Codes & Responses

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error message description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error for this field"
    }
  ],
  "errorCode": "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `422` - Unprocessable Entity
- `500` - Internal Server Error

---

## Data Models

### User Model (MongoDB Schema)
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hashed with bcrypt - Never return in API responses
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model (MongoDB Schema)
```javascript
{
  _id: ObjectId,
  name: String, // Seller name
  title: String,
  description: String,
  price: Number,
  status: String, // 'available', 'pending', 'sold'
  location: String,
  category: String,
  imageUri: String,
  sellerId: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model (MongoDB Schema)
```javascript
{
  _id: ObjectId,
  orderNumber: String, // Auto-generated (e.g., 'ORD-8942')
  productId: ObjectId, // Reference to Product
  sellerId: ObjectId, // Reference to User
  buyerId: ObjectId, // Reference to User
  quantity: Number,
  totalAmount: Number,
  status: String, // 'pending', 'shipped', 'delivered', 'cancelled'
  paymentMethod: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Notes for Backend Team

### Tech Stack
- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Session Management**: express-session with connect-mongo
- **Password Hashing**: bcrypt
- **File Upload**: multer (for image uploads)

### Required NPM Packages
```bash
npm install express mongoose express-session connect-mongo bcrypt cors dotenv multer
```

### Security Considerations
1. **Password Security**: Use bcrypt for password hashing (minimum 10 rounds)
2. **Session Management**:
   - Use express-session with HttpOnly cookies
   - Session expiry: 7 days
   - Store sessions in MongoDB using connect-mongo
3. **Input Validation**: Validate and sanitize all user inputs
4. **CORS**: Configure CORS to allow your React Native app's requests
5. **Environment Variables**: Store sensitive data (DB connection, session secret) in .env file

### MongoDB Connection Example
```javascript
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

### Session Configuration Example
```javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));
```

### Database Indexes
Create these indexes in MongoDB for better performance:
```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });

// Products collection
db.products.createIndex({ sellerId: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ status: 1 });

// Orders collection
db.orders.createIndex({ buyerId: 1 });
db.orders.createIndex({ sellerId: 1 });
db.orders.createIndex({ status: 1 });
```

### Pagination
- Default page size: 20 items
- Maximum page size: 100 items
- Always return pagination metadata

### Image Handling
- Support both external URLs and file uploads using multer
- Store uploaded images in `/uploads` folder
- Image validation: Max 5MB, formats: jpg, png, jpeg, webp
- Serve static files: `app.use('/uploads', express.static('uploads'))`

### Middleware for Authentication
```javascript
// Check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Please login to access this resource'
  });
};
```

### Project Structure Suggestion
```
backend/
├── server.js              # Entry point
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   └── orderController.js
├── middleware/
│   └── auth.js           # Authentication middleware
├── uploads/              # Uploaded images
└── .env                  # Environment variables
```

### Environment Variables (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recycle-marketplace
SESSION_SECRET=your-secret-key-here
NODE_ENV=development
```

---

## API Versioning
Current version: No versioning (simple structure)

All endpoints are prefixed with `/api`

Example: `http://localhost:5000/api/auth/login`

---

## Contact & Support
For API questions or issues, contact the backend development team.

**Last Updated:** November 20, 2024
