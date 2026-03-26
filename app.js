const express = require('express');
const { nanoid } = require('nanoid')
const cors = require("cors");
const app = express();
const port = 3000;

let products = [
    {
        id: nanoid(6),
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYn4l1flYazmEbVA9BiTvYiR-HpYuqj0FZp3AZN9Ehfz9VSRU8IfXbDdXwqSaBh2EXEUpVsVaMXnNoHr9UCRhwPgWHfNq3PBOmuhMrGQ&s=10',
        name: 'Мороженое ванильное, стаканчик',
        category: 'Замороженные продукты',
        description: "Неуникальный вкус, стандартная классика",
        price: 90,
    },
    {
        id: nanoid(6),
        photo: 'https://lifehacker.ru/wp-content/uploads/2020/01/shutterstock_265726205_1581604259-e1588846196843-scaled.jpg',
        name: 'Мороженое шоколадное, стаканчик',
        category: 'Замороженные продукты',
        description: "Если хочется рот в коричневой субстанции",
        price: 90,
    },
    {
        id: nanoid(6),
        name: 'Ничего',
        category: 'Пустота',
        description: "Абсолютное ничего",
        price: 0,
    },
]



// Middleqware
app.use(express.json());
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция для получения продукта из списка
function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
};

// POST /api/products
app.post("/api/products", (req, res) => {
    const { photo, name, price, category, description } = req.body;

    const newProduct = {
        id: nanoid(6),
        photo: photo.trim(),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

// GET /api/products
app.get("/api/products", (req, res) => {
    res.json(products);
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    res.json(product);
});

// PATCH /api/products/:id
app.patch("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    if (
        req.body?.photo === undefined &&
        req.body?.name === undefined &&
        req.body?.category === undefined &&
        req.body?.description === undefined &&
        req.body?.price === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }

    const { photo, name, price, category, description } = req.body;

    if (photo !== undefined) product.photo = photo.trim();
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = Number(price);

    res.json(product);
});

// DELETE /api/products/:id
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter((p) => p.id !== id);
    res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

