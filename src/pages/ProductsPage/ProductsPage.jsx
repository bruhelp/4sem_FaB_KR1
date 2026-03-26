import React, { useEffect, useState } from "react";
import "./ProductsPage.css";

import ProductsList from "../../components/ProductsList";
import ProductModal from "../../components/ProductModal";
import { api } from "../../api";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [editingProduct, setEditingProduct] = useState(null);

    // Автоматическая загрузка данных продуктов
    // [] - означает, что сработает после загрузки страницы
    useEffect(() => {
        loadProducts();
    }, []);

    // Функция отловли ошибок при загрузке данных, и запись их в products
    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts(); // Получение продуктов из сервера
            setProducts(data);
        } catch (err) {
            console.error(err);
            alert("Ошибка загрузки продуктов");
        } finally {
            setLoading(false);
        }
    };

    // Функции работы с модальным окном
    const openCreate = () => {
        setModalMode("create");
        setEditingProduct(null);
        setModalOpen(true);
    };
    const openEdit = (product) => {
        setModalMode("edit");
        setEditingProduct(product);
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
        setEditingProduct(null);
    };

    // Фукнция удаления продукта
    const handleDelete = async (id) => {
        const ok = window.confirm("Убрать продукт с полки?");
        if (!ok) return;
        try {
            await api.deleteProduct(id);
            // React автоматически в prev подставляет нынешнее значение products
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
            alert("Ошибка уборки продукта с полки");
        }
    };

    // Модальное окно создание продукта
    // payload - json из id, name, price
    const handleSubmitModal = async (payload) => {
        try {
            if (modalMode === "create") {
                const newProduct = await api.createProduct(payload);
                // ...prev все предыдущие + нынешний
                setProducts((prev) => [...prev, newProduct]);
            } else {
                // находит по id, подгружает payload
                const updatedProduct = await api.updateProduct(payload.id, payload);
                // проверяет, изменились ли данные, сверяясь по каждому продукту в списке
                setProducts((prev) =>
                    prev.map((p) => (p.id === payload.id ? updatedProduct : p))
                );
            }
            closeModal();
        } catch (err) {
            console.error(err);
            alert("Ошибка высталвение продукта на полку");
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__inner">
                    <div className="brand">Магазин продуктов</div>
                    <div className="header__right">React</div>
                </div> </header>
            <main className="main">
                <div className="container">
                    <div className="toolbar">
                        <h1 className="title">Продукты</h1>
                        <button className="btn btn--primary" onClick=
                            {openCreate}>
                            + Создать
                        </button>
                    </div>
                    {loading ? (
                        <div className="empty">Загрузка...</div>
                    ) : (
                        <ProductsList
                            products={products}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </main>
            <footer className="footer">
                <div className="footer__inner">
                    © {new Date().getFullYear()} Магазин продуктов
                </div>
            </footer>
            <ProductModal open={modalOpen}
                mode={modalMode}
                initialProduct={editingProduct}
                onClose={closeModal}
                onSubmit={handleSubmitModal}
            />
        </div>);
}