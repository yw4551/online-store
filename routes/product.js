import express from "express";
import { getAllProductsWithFilters } from "../controllers/products-controller.js";

const router = express.Router();

router.get("/", getAllProductsWithFilters);

export default router;
