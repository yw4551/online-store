import express from "express";
import { runCheckout } from "../controllers/orders-controller";

const router = express.Router();

router.post("/checkout", runCheckout);

export default router;
