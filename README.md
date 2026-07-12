# Online Store - Express Backend Server

A backend server simulating an online store. The project is built with Node.js and Express, using JSON files as a database to store data about products, customers, and orders.

## Key Features

- **Product Management**: Fetch products with advanced filtering options (by available stock, maximum price, and free text search).
- **Customers & Cart Management**:
    - Automatic creation of new customers upon first request, including an initial balance.
    - Add products to the cart with stock availability validation.
    - Remove products from the cart.
    - View customer balance.
- **Checkout and Orders**:
    - Cart validation (ensure it is not empty).
    - Final stock and balance checks before charging.
    - Generate a new order and update the database (reduce stock and deduct from customer balance).
    - View customer order history.

## Folder Structure

```text
online-store/
├── controllers/
│   ├── customers-controller.js
│   ├── orders-controller.js
│   └── products-controller.js
├── routes/
│   ├── customers.js
│   ├── general.js
│   ├── orders.js
│   └── product.js
├── db/
│   ├── customers.json
│   ├── orders.json
│   └── products.json
├── .env
├── .env.example
├── .gitignore
├── helper.js
├── package.json
├── README.md
└── server.js
```

## Installation and Setup

1. **Clone the repository**:

    ```bash
    git clone [https://github.com/yw4551/online-store.git](https://github.com/yw4551/online-store.git)
    cd online-store
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Environment Variables (.env)**:
   Create a file named `.env` in the root directory of the project and define the following variables:

    ```env
    PORT=3000
    DB_BASE_PATH=./db
    STARTING_BALANCE=500
    ```

4. **Database Preparation**:
   Ensure there is a directory named `db` containing the following files:
    - `products.json`
    - `customers.json`
    - `orders.json`

5. **Run the server**:
    ```bash
    npm start
    ```

## API Routes

### General

| Method | Route     | Description                                      |
| ------ | --------- | ------------------------------------------------ |
| `GET`  | `/`       | Welcome message confirming the server is running |
| `GET`  | `/health` | Server health check                              |

### Products

| Method | Route       | Description            | Possible Query Params                        |
| ------ | ----------- | ---------------------- | -------------------------------------------- |
| `GET`  | `/products` | Fetch list of products | `inStock=true`, `maxPrice=50`, `search=name` |

### Customers & Cart

| Method   | Route                    | Description                 | Required Parameters                                                |
| -------- | ------------------------ | --------------------------- | ------------------------------------------------------------------ |
| `GET`    | `/cart`                  | View shopping cart          | `?customerId=xxx` (Query)                                          |
| `POST`   | `/cart/items`            | Add product to cart         | `{ "customerId": "x", "productId": 1, "quantity": 2 }` (Body JSON) |
| `DELETE` | `/cart/items/:productId` | Remove product from cart    | `{ "customerId": "x" }` (Body JSON) + `:productId` in URL          |
| `GET`    | `/account/balance`       | View customer money balance | `?customerId=xxx` (Query)                                          |

### Orders

| Method | Route              | Description                                | Required Parameters                   |
| ------ | ------------------ | ------------------------------------------ | ------------------------------------- |
| `POST` | `/orders/checkout` | Process payment and create order from cart | `{ "customerId": "xxx" }` (Body JSON) |
| `GET`  | `/orders`          | View customer order history                | `?customerId=xxx` (Query)             |

## Response Structure

The API returns responses in a uniform JSON format:

**Success (200/201):**

```json
{
    "success": true,
    "data": {}
}
```

**Error (400/404/500):**

```json
{
    "success": false,
    "message": "Error description here",
    "data": {}
}
```
