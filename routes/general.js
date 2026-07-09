import express from "express";

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

export default router;
