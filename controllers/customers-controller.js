import dotenv from "dotenv";
import fs from "fs/promises";
import * as helper from "../helper.js";

dotenv.config();

export async function getCustomerCart(req, res, next) {
    try {
        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerQueryId = req.query.customerId;
        const customerCart = customers.find(
            (customer) => String(customer.customerId) === customerQueryId,
        );

        if (!customerCart) {
            return helper.isFalse("Customer not found", res, 404);
        }

        if (customerCart.cart.length === 0) {
            return res.status(404).json({
                success: true,
                error: "Cart is empty",
            });
        }

        return res.json({
            success: true,
            message: "Here is your cart",
            body: customerCart.cart,
        });
    } catch (error) {
        next(error);
    }
}

export async function addProductToCart(req, res, next) {
    try {
        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const productsDbPath = `./${process.env.DB_BASE_PATH}/products.json`;
        const products = await helper.readFileContent(productsDbPath);
        const { customerId, productId, quantity } = req.body;
        const product = products.find((pro) => pro.id === productId);
        const customerIndex = customers.findIndex(
            (cus) => cus.customerId === customerId,
        );

        if (!product) {
            return helper.isFalse("product not found", res, 404);
        }

        if (!customerId) {
            return helper.isFalse("customerId is required", res, 400);
        }

        if (!productId) {
            return helper.isFalse("productId is required", res, 400);
        }
        if (!quantity) {
            return helper.isFalse("quantity is required", res, 400);
        }

        if (quantity <= 0) {
            return helper.isFalse("quantity must be positive", res, 400);
        }

        const customerProductIndex = customers[customerIndex].cart.findIndex(
            (pro) => pro.productId === productId,
        );

        if (customerProductIndex !== -1) {
            customers[customerIndex].cart[customerProductIndex].quantity +=
                quantity;
        } else {
            customers[customerIndex].cart.push({ productId, quantity });
        }

        helper.writeToFile(customerDbPath, customers);

        res.json({
            success: true,
            message: "Product added to cart successfully",
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerId = req.body.customerId;
        const productId = Number(req.params.productId);

        if (!customerId) {
            return helper.isFalse("customerId is required", res, 400);
        }

        const customerIndex = customers.findIndex(
            (cus) => cus.customerId === customerId,
        );
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
        });
    } catch (error) {
        next(error);
    }
}

export async function getCustomerBalance(req, res, next) {
    try {
        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const customerQueryId = req.query.customerId;
        const customerIndex = customers.findIndex(
            (cus) => cus.customerId === customerQueryId,
        );

        if (customerIndex === -1) {
            return helper.isFalse("Customer not found", res, 404);
        }

        res.json({
            success: true,
            message: "Customer balance shown successfully",
            body: customers[customerIndex].balance,
        });
    } catch (error) {
        next(error);
    }
}
