const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors"); // Добавляем CORS
const app = express(); 
const port = 8080;

app.use(cors()); // Используем CORS
app.use(bodyParser.json());

const productsPath = path.join(__dirname, 'products.json');

function readProducts() {
    const data = fs.readFileSync(productsPath, 'utf8');
    return JSON.parse(data);
}

function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}

app.get('/api/products', (req, res) => {
    const products = readProducts();
    res.json(products);
});

app.post('/api/products/:id', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.id);
    const updatedProduct = req.body;
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        writeProducts(products);
        res.json(products[index]);
    } else {
        res.status(404).send('Product not found');
    }
});

app.delete('/api/products/:id', (req, res) => {
    const products = readProducts();
    const productId = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== productId);
    writeProducts(filteredProducts);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Admin server is running on http://localhost:${port}`);
});