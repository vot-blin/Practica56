const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Добавляем CORS
const app = express(); 
const port = 3000;

app.use(cors()); // Используем CORS

const productsPath = path.join(__dirname, 'products.json');
let products = [];

// Чтение данных из products.json
try {
    const data = fs.readFileSync(productsPath, 'utf8');
    products = JSON.parse(data);
} catch (err) {
    console.error('Error reading products.json:', err);
}

// Отдача статического HTML-файла
app.use(express.static(path.join(__dirname)));

// API для получения списка товаров
app.get('/api/products', (req, res) => {
    res.json(products);  // Отправляем данные о товарах в формате JSON
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});