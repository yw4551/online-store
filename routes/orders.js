import express from "express";
import {
    runCheckout,
    getCustomerOrderHistory,
} from "../controllers/orders-controller";

const router = express.Router();

router.post("/checkout", runCheckout);

router.get("/", getCustomerOrderHistory);

export default router;
