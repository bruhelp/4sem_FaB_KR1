const express = require('express');
const { nanoid } = require('nanoid')
const cors = require("cors");
const app = express();
const port = 3000;

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API управления продуктами',
            version: '1.0.0',
            description: 'Простое API для управления продуктами',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Локальный сервер',
            },
        ],
    },
    apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

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

/**
 * @swagger
 * components: 
 *  schemas:
 *   Product:
 *    type: object
 *    required:   
 *     - photo
 *     - name 
 *     - categrory
 *     - description
 *     - price
 *    properties:
 *     id:
 *      type: string
 *      description: Автоматически сгенерированный уникальный ID продукта
 *     photo:
 *      type: string
 *      description: URL фотографии продукта
 *     name:
 *      type: string
 *      description: Название продукта
 *     category:
 *      type: string
 *      description: Категория продукта
 *     description:
 *      type: string
 *      description: Описание продукта
 *     price:
 *      type: number
 *      description: Стоимость продукта
 *    example:
 *     id: "abc123"
 *     photo: "https://example.com/product.jpg"
 *     name: "Мороженое ванильное, стаканчик"
 *     category: "Замороженные продукты"
 *     description: "Неуникальный вкус, стандартная классика"
 *     price: 90
*/

// Функция для получения продукта из списка
function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
};

/**
 * @swagger
 * /api/products:
 *  post:
 *   summary: Создание нового продукта
 *   tags: [Products]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *     schema:
 *    type: object
 *    required:   
 *     - photo
 *     - name 
 *     - categrory
 *     - description
 *     - price
 *    properties:
 *     photo:
 *      type: string
 *      description: URL фотографии продукта
 *     name:
 *      type: string
 *      description: Название продукта
 *     category:
 *      type: string
 *      description: Категория продукта
 *     description:
 *      type: string
 *      description: Описание продукта
 *     price:
 *      type: number
 *      description: Стоимость продукта
 *  responses:
 *   201:
 *    description: Продукт успешно создан
 *    content:
 *    application/json:
 *    schema:
 *     $ref: '#/components/schemas/Product'
 *    400:
 *      description: Ошибка в теле запроса
 */
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

/**
 * @swagger
 * /api/products:
 * get:
 *   summary: Получение списка всех продуктов
 *   tags: [Products]
 *   responses:
 *    200:
 *      description: Список продуктов
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/Product'
 */
// GET /api/products
app.get("/api/products", (req, res) => {
    res.json(products);
});

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *   summary: Получение продукта по ID
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: ID продукта
 *   responses:
 *    200:
 *      description: Информация о продукте
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    404:
 *      description: Продукт не найден
 */
// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
    const id = req.params.id;

    const product = findProductOr404(id, res);
    if (!product) return;

    res.json(product);
});

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *   summary: Обновление информации о продукте
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *        type: string
 *      required: true
 *      description: ID продукта
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *     schema:
 *    type: object
 *    properties:
 *     photo:
 *      type: string
 *      description: URL фотографии продукта
 *     name:
 *      type: string
 *      description: Название продукта
 *     category:
 *      type: string
 *      description: Категория продукта
 *     description:
 *      type: string
 *      description: Описание продукта
 *     price:
 *      type: number
 *      description: Стоимость продукта
 *   responses:
 *    200:
 *      description: Обновлённый продукт
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    400:
 *      description: Ошибка в теле запроса
 *    404:
 *      description: Продукт не найден
 */
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

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *   summary: Удаление продукта
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *      description: ID продукта
 *   responses:
 *    204:
 *      description: Продукт успешно удалён
 *    404:
 *      description: Продукт не найден
 */
// DELETE /api/products/:id
app.delete("/api/products/:id", (req, res) => {
    const id = req.params.id;
    const exists = products.some((p) => p.id === id);
    if (!exists) return res.statusCode(404).json({ error: "Product not found" });

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

