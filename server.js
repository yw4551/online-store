import dotenv from "dotenv";
import express from "express";
import generalRouter from "./routes/general.js";
import productRouter from "./routes/product.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", generalRouter);

app.use("/products", productRouter);

app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`);
});
