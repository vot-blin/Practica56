const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors"); // Добавляем CORS
const app = express(); 
const port = 3000;

app.use(cors()); // Используем CORS
app.use(express.json());

const productsPath = path.join(__dirname, 'products.json');
let products = [];

function readProducts() {
    try {
        const data = fs.readFileSync(productsPath, 'utf8');
        products = JSON.parse(data);
    } catch (err) {
        console.error('Error reading products.json:', err);
        products = []; // Если файл не существует или пуст, начинаем с пустого массива
    }
}

function writeProducts(products) {
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
}


// Отдача статического HTML-файла
app.use(express.static(path.join(__dirname)));

// API для получения списка товаров
app.get('/api/products', (req, res) => {
    readProducts(); // Обновляем данные перед отправкой
    res.json(products);
});

// API для добавления товара
app.post('/api/products', (req, res) => {
    readProducts(); // Читаем текущие данные
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1; // Новый ID
    const newProduct = {
        id: newId,
        title: req.body.title,
        price: req.body.price
    };
    products.push(newProduct);
    writeProducts(products); // Записываем обновлённые данные
    res.json(newProduct); // Возвращаем добавленный товар
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});