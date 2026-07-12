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
        message: err,
    });
}

export async function getOrCreateCustomer(customers, customerId) {
    let customerIndex = customers.findIndex(
        (cus) => String(cus.customerId) === String(customerId),
    );

    if (customerIndex === -1) {
        const newCustomer = {
            customerId: customerId,
            balance: Number(process.env.STARTING_BALANCE),
            cart: [],
            createdAt: Date.now(),
        };

        customers.push(newCustomer);
        customerIndex = customers.length - 1;
    }

    return customerIndex;
}
