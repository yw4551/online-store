# Express Online Store API

Welcome to the Express Online Store API. This is a lightweight backend built with Express.js that simulates an e-commerce platform. It handles product filtering, shopping cart management, and a complete checkout flow, using local JSON files for data storage.

## Features

- **Product Catalog:** Browse and filter products by stock availability, maximum price, or text search.
- **Shopping Cart:** Easily add or remove items for a specific customer.
- **Secure Checkout:** Validates inventory and customer funds before finalizing an order.
- **Frictionless Onboarding:** No registration required. Providing a new `customerId` automatically sets up an account with a starting balance.
- **Local Storage:** All data is stored securely in local JSON files.
- **Configuration:** Manage ports, database paths, and starting balances using a `.env` file.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Local JSON files

## Project Structure

Here is an overview of the file system and folder structure for this project, featuring a modular routing setup:

```text
├── db/                     # Directory for local JSON database files
│   ├── products.json       # Pre-defined list of products
│   ├── customers.json      # Stores customer data and carts
│   └── orders.json         # Stores order history
├── routes/                 # Express routers for modular routing
│   ├── products.js         # Routes for product catalog and filtering
│   ├── cart.js             # Routes for shopping cart management
│   └── orders.js           # Routes for checking balances and checkout
├── .env                    # Environment variables (ignored by Git)
├── .env.example            # Example configuration file
├── server.js               # Main application entry point and middleware setup
├── package.json            # Project metadata and dependencies
└── README.md               # Project documentation
```

## Getting Started

Ensure you have Node.js and npm installed on your machine.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yw4551/online-store.git
    ```
2. Navigate to the project directory:
    ```bash
    cd your-repo-name
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Set up your environment variables by copying the example file:
    ```bash
    cp .env.example .env
    ```

## Environment Variables

The project relies on a `.env` file for configuration. Do not commit this file to version control.

```env
PORT=3000
DB_BASE_PATH=./db
STARTING_BALANCE=500
```

## API Endpoints

### General Routes

| Method | Endpoint  | Description                      |
| :----- | :-------- | :------------------------------- |
| `GET`  | `/`       | Returns a brief welcome message. |
| `GET`  | `/health` | Server health status check.      |

### Products (`/routes/products.js`)

| Method | Endpoint    | Query Parameters (Optional)                                     | Description                                              |
| :----- | :---------- | :-------------------------------------------------------------- | :------------------------------------------------------- |
| `GET`  | `/products` | `inStock` (boolean)<br>`maxPrice` (number)<br>`search` (string) | Retrieves the product list. Supports combined filtering. |

### Shopping Cart (`/routes/cart.js`)

| Method   | Endpoint                 | Requirements                                                                              | Description                                                   |
| :------- | :----------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------------ |
| `GET`    | `/cart`                  | **Query Param:** `customerId` (Required)                                                  | Retrieves the specified customer's shopping cart.             |
| `POST`   | `/cart/items`            | **Body (JSON):**<br>`{ "customerId": "string", "productId": number, "quantity": number }` | Adds a specific quantity of a product to the customer's cart. |
| `DELETE` | `/cart/items/:productId` | **Route Param:** `productId`<br>**Body (JSON):** `{ "customerId": "string" }`             | Removes the specified product from the customer's cart.       |

### Account & Orders (`/routes/orders.js`)

| Method | Endpoint           | Requirements                                     | Description                                                      |
| :----- | :----------------- | :----------------------------------------------- | :--------------------------------------------------------------- |
| `GET`  | `/account/balance` | **Query Param:** `customerId` (Required)         | Retrieves the customer's current financial balance.              |
| `POST` | `/orders/checkout` | **Body (JSON):**<br>`{ "customerId": "string" }` | Validates cart, stock, and balance, then processes the checkout. |
| `GET`  | `/orders`          | **Query Param:** `customerId` (Required)         | Retrieves the complete order history for the specified customer. |

## Business Logic

- **Customer Identification:** All requests requiring user context must include a `customerId`.
- **Automatic Account Creation:** Unrecognized customer IDs are automatically registered and granted the starting balance defined in `.env`.
- **Inventory Management:** Stock levels are only reduced upon a successful checkout, not when items are placed in the cart.
- **Checkout Validation:** Orders are only processed if the cart contains items, there is sufficient inventory, and the customer has enough funds.

## Running the Server

To start the server in development mode, run:

```bash
npm run dev
```
