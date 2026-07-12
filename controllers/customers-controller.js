import dotenv from "dotenv";
import fs from "fs/promises";
import * as helper from "../helper.js";

dotenv.config();

export async function getCustomerCart(req, res, next) {
    try {
        const customerQueryId = req.query.customerId;

        if (!customerQueryId) {
            return helper.isFalse("Customer is required", res, 400);
        }

        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerIndex = await helper.getOrCreateCustomer(
            customers,
            customerQueryId,
        );

        await helper.writeToFile(customerDbPath, customers);

        const customerCart = customers[customerIndex].cart;

        return res.json({
            success: true,
            message: "Here is your cart",
            data: customerCart,
        });
    } catch (error) {
        next(error);
    }
}

export async function addProductToCart(req, res, next) {
    try {
        const { customerId, productId, quantity } = req.body;

        if (!customerId) {
            return helper.isFalse("customerId is required", res, 400);
        }

        if (!productId) {
            return helper.isFalse("productId is required", res, 400);
        }

        if (!quantity) {
            return helper.isFalse("quantity is required", res, 400);
        }

        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const productsDbPath = `./${process.env.DB_BASE_PATH}/products.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const products = await helper.readFileContent(productsDbPath);
        const product = products.find((pro) => pro.id === productId);

        if (!product) {
            return helper.isFalse("product not found", res, 404);
        }

        const customerIndex = await helper.getOrCreateCustomer(
            customers,
            customerId,
        );

        const customerProductIndex = customers[customerIndex].cart.findIndex(
            (pro) => pro.productId === productId,
        );

        let requestedQuantity = quantity;

        if (customerProductIndex !== -1) {
            requestedQuantity +=
                customers[customerIndex].cart[customerProductIndex].quantity;
        }

        if (product.stock < requestedQuantity) {
            return helper.isFalse("Not enough in stock", res, 400);
        }

        if (customerProductIndex !== -1) {
            customers[customerIndex].cart[customerProductIndex].quantity +=
                quantity;
        } else {
            customers[customerIndex].cart.push({ productId, quantity });
        }

        await helper.writeToFile(customerDbPath, customers);

        res.json({
            success: true,
            message: "Product added to cart successfully",
            data: {},
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const customerId = req.body.customerId;
        const productId = Number(req.params.productId);

        if (!customerId) {
            return helper.isFalse("customerId is required", res, 400);
        }

        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerIndex = customers.findIndex(
            (cus) => String(cus.customerId) === String(customerId),
        );

        if (customerIndex === -1) {
            return helper.isFalse("Customer not found", res, 404);
        }

        const productIndex = customers[customerIndex].cart.findIndex(
            (pro) => pro.productId === productId,
        );

        if (productIndex === -1) {
            return helper.isFalse("Product not found", res, 404);
        }

        customers[customerIndex].cart.splice(productIndex, 1);

        await helper.writeToFile(customerDbPath, customers);

        res.json({
            success: true,
            message: "Product deleted successfully.",
            data: {},
        });
    } catch (error) {
        next(error);
    }
}

export async function getCustomerBalance(req, res, next) {
    try {
        const customerQueryId = req.query.customerId;

        if (!customerQueryId) {
            return helper.isFalse("customerId is required", res, 400);
        }

        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerIndex = await helper.getOrCreateCustomer(
            customers,
            customerQueryId,
        );

        await helper.writeToFile(customerDbPath, customers);

        res.json({
            success: true,
            message: "Customer balance shown successfully",
            data: customers[customerIndex].balance,
        });
    } catch (error) {
        next(error);
    }
}
