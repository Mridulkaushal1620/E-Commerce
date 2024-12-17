# E-Commerce Backend Application

This project serves as the backend for an e-commerce platform, offering features like user authentication, product management, and order management. It is built using Node.js, Express, MongoDB, and JSON Web Tokens (JWT).

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
  - [Postman Collection](#postman-collection)
  - [Example cURL Commands](#example-curl-commands)
- [Application Structure](#application-structure)

## Features
- User authentication and authorization using JWT.
- CRUD operations for products.
- Order management, including status updates.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Postman or cURL

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start a MongoDB server locally or use a cloud database (e.g., MongoDB Atlas).

4. Configure environment variables (see [Environment Variables](#environment-variables)).

5. Start the server:
   ```bash
   node index.js
   ```
   The server will run at `http://localhost:4000` by default.

## Environment Variables
Create a `.env` file in the root directory and set the following:
```env
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your secret key for JWT>
PORT=4000 # Optional, default is 4000
```

## API Endpoints

### Authentication Endpoints (`/api/auth`)
1. **Register User**
   - **POST** `/api/auth/createuser`
   - Body:
     ```json
     {
       "name": "John Doe",
       "email": "john@example.com",
       "password": "securepassword"
     }
     ```

2. **Login**
   - **POST** `/api/auth/login`
   - Body:
     ```json
     {
       "email": "john@example.com",
       "password": "securepassword"
     }
     ```

3. **Get User Details**
   - **POST** `/api/auth/getuser`
   - Header:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     ```

### Product Management Endpoints (`/api/products`)
1. **Fetch All Products**
   - **GET** `/api/products/fetchallproducts`
   - Header:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     ```

2. **Add Product**
   - **POST** `/api/products/addproduct`
   - Header and Body:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     {
       "name": "Sample Product",
       "price": 100,
       "stock": 50
     }
     ```

3. **Update Product**
   - **PUT** `/api/products/updateproduct/:id`
   - Path Parameter: `id` (Product ID)
   - Header and Optional Body:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     {
       "name": "Updated Product",
       "price": 150
     }
     ```

4. **Delete Product**
   - **DELETE** `/api/products/deleteproduct/:id`
   - Path Parameter: `id` (Product ID)
   - Header:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     ```

### Order Management Endpoints (`/api/orders`)
1. **Fetch Orders**
   - **GET** `/api/orders/getorders`
   - Header:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     ```

2. **Update Order Status**
   - **PUT** `/api/orders/addorder/:id`
   - Path Parameter: `id` (Order ID)
   - Header:
     ```json
     {
       "auth-token": "<JWT_TOKEN>"
     }
     ```

## Testing the API

### Postman Collection
A Postman collection is available to test all the endpoints. Import the provided JSON file into Postman and follow the examples to interact with the API.

### Example cURL Commands
1. **Create User**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/createuser \
   -H "Content-Type: application/json" \
   -d '{"name":"John Doe","email":"john@example.com","password":"securepassword"}'
   ```

2. **Login**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"john@example.com","password":"securepassword"}'
   ```

3. **Get Products**:
   ```bash
   curl -X GET http://localhost:4000/api/products/fetchallproducts \
   -H "auth-token: <JWT_TOKEN>"
   ```

## Application Structure
- **`index.js`**: Entry point for the application.
- **Routes**:
  - `auth.js`: Handles user authentication.
  - `products.js`: Manages product-related operations.
  - `orders.js`: Handles order-related operations.
- **Models**:
  - `User.js`: Defines the user schema.
  - `Product.js`: Defines the product schema.
  - `Order.js`: Defines the order schema.
- **Middleware**:
  - `fetchuser.js`: Middleware to verify JWTs.
- **Database Configuration**:
  - `db.js`: Sets up MongoDB connection.

---

This README provides a comprehensive guide to setting up, running, and testing the backend for this e-commerce platform.

