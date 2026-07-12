import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

export async function getAllProductsWithFilters(req, res, next) {
    try {
        const dbPath = `./${process.env.DB_BASE_PATH}/products.json`;
        const fileContent = await fs.readFile(dbPath, "utf-8");
        const products = JSON.parse(fileContent);
        const inStock = req.query.inStock;
        const maxPrice = req.query.maxPrice;
        const search = req.query.search;

        let productsList = [...products];

        if (inStock === "true") {
            productsList = productsList.filter((product) => product.stock > 0);
        }

        if (maxPrice) {
            productsList = productsList.filter(
                (product) => product.price <= Number(maxPrice),
            );
        }

        if (search) {
            productsList = productsList.filter((product) =>
                product.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        res.json({
            success: true,
            message: "Here are the products that are find",
            data: productsList,
        });
    } catch (error) {
        next(error);
    }
}
