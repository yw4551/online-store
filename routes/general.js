import express from "express";
import { getCustomerBalance } from "../controllers/customers-controller.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Server started...",
    });
});

router.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy.",
    });
});

router.get("/account/balance", getCustomerBalance);

export default router;
