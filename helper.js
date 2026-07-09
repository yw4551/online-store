import fs from "fs/promises";

export async function readFileContent(filePath) {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return data;
}

export async function writeToFile(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export function isFalse(err, res, status) {
    res.status(status).json({
        success: false,
        error: err,
    });
}
