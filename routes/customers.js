import express from "express";
import * as controllers from "../controllers/customers-controller.js";

const router = express.Router();

router.get("/", controllers.getCustomerCart);

router.post("/items", controllers.addProductToCart);

router.delete("/items/:productId", controllers.deleteProduct);

export default router;
