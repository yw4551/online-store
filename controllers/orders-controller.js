import dotenv from "dotenv";
import fs from "fs/promises";
import * as helper from "../helper.js";

dotenv.config();

export async function runCheckout(req, res, next) {
    try {
        const customerDbPath = `./${process.env.DB_BASE_PATH}/customers.json`;
        const customers = await helper.readFileContent(customerDbPath);
        const productDbPath = `./${process.env.DB_BASE_PATH}/products.json`;
        const products = await helper.readFileContent(productDbPath);
        const customerId = req.body.customerId;

        if (!customerId) {
            return helper.isFalse("CustomerId is required", res, 404);
        }

        const customerIndex = customers.findIndex(
            (cus) => cus.customerId === customerId,
        );
        const customerCart = customers[customerIndex].cart;

        if (customerCart === -1) {
            return helper.isFalse("Customer not found", res, 404);
        }

        const customerCart = customers[customerIndex].cart;

        if (customerCart.length === 0) {
            return helper.isFalse("You cant checkout an empty cart", res, 400);
        }

        let totalCartPrice = 0;

        for (const product of customerCart) {
            const productId = product.productId;
            const productIndex = products.findIndex(
                (fro) => pro.id === productId,
            );

            if (productIndex === -1) {
                return helper.isFalse("Product not found", res, 404);
            }

            if (products[productIndex].stock < product.quantity) {
                return helper.isFalse(
                    "We are low in stock of this product",
                    res,
                    400,
                );
            }

            totalCartPrice += products[productIndex].price * product.quantity;
        }

        if (customers[customerIndex].balance < totalCartPrice) {
            return helper.isFalse(
                "You don't have enough money for this cart",
                res,
                400,
            );
        }

        const itemsList = [];

        for (const product of customerCart) {
            const productId = product.productId;
            const productIndex = products.findIndex(
                (fro) => pro.id === productId,
            );
            products[productIndex].stock -= product.quantity;
            itemsList.push(products[productIndex].name);
        }

        customers[customerIndex].balance -= totalCartPrice;
        customers[customerIndex].cart = [];

        await helper.writeToFile(productDbPath, products);
        await helper.writeToFile(customerDbPath, customers);

        const orderDbPath = `./${process.env.DB_BASE_PATH}/orders.json`;
        const orders = await helper.readFileContent(orderDbPath);
        const newId = orders.length > 0 ? orders[orders.length - 1].id + 1 : 1;

        const order = {
            id: newId,
            customerId,
            items: itemsList,
            total: totalCartPrice,
            createdAt: Date.now(),
        };

        orders.push(order);

        await helper.writeToFile(orderDbPath, orders);

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            body: order,
        });
    } catch (error) {
        next(error);
    }
}
