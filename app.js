const express = require('express');
const { nanoid } = require('nanoid')
const app = express();
const port = 3000;

let users = [
    { id: nanoid(6), name: 'Карина', age: 19 },
    { id: nanoid(6), name: 'Александр', age: 19 },
    { id: nanoid(6), name: 'Бездна', age: 1 },
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

// Функция для получения пользователя из списка
function findUserOr404(id, res) {
    const user = users.find(u => u.id == id);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return null;
    }
    return user;
};

// POST /api/users
app.post("/api/users", (req, res) => {
    const { name, age } = req.body;

    const newUser = {
        id: nanoid(6),
        name: name.trim(),
        age: Number(age),
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// GET /api/users
app.get("/api/users", (req, res) => {
    res.json(users);
});

// GET /api/users/:id
app.get("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const user = findUserOr404(id, res);
    if (!user) return;

    res.json(user);
});

// PATCH /api/users/:id
app.patch("/api/users/:id", (req, res) => {
    const id = req.params.id;

    const user = findUserOr404(id, res);
    if (!user) return;

    if (req.body?.name === undefined && req.body?.age === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }

    const { name, age } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (age !== undefined) user.age = Number(age);

    res.json(user);
});

// DELETE /api/users/:id
app.delete("/api/users/:id", (req, res) => {
    const id = req.params.id;
    const exists = users.some((u) => u.id === id);
    if (!exists) return res.statusCode(404).json({ error: "User not found" });

    users = users.filter((u) => u.id !== id);
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
    console.log('Сервер запущен на http://localhost:${port}');
});
