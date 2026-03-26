import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        if (!open) return;
        // Возвращает ничего, если нет записи
        setPhoto(initialProduct?.photo ?? "");
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование продукта" : "Создание продукта";

    const handleSubmit = (e) => {
        // Без перезагрущки страницы
        e.preventDefault();

        const setPhoto = photo.trim();
        const trimmed = name.trim();
        const parsedCategory = category.trim();
        const parsedDescription = description.trim();
        const parsedPrice = Number(price);

        if (!trimmed) {
            alert("Введите название");
            return;
        }
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            alert("Введите корректную цену");
            return;
        }
        if (!setPhoto) {
            alert("Введите URL фотографии");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            photo: setPhoto,
            name: trimmed,
            category: parsedCategory,
            description: parsedDescription,
            price: parsedPrice,
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            {/* stopPropagation() — метод, который останавливает дальнейшее всплытие или погружение события по DOM-дереву*/}
            <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose} aria-label="Закрыть">
                        ✕
                    </button>
                </div>
                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        URL (ссылка) на фото продукта
                        <input
                            className="input"
                            value={photo}
                            onChange={(e) => setPhoto(e.target.value)}
                            placeholder="Фотография продукта"
                        />
                    </label>

                    <label className="label">
                        Название продукта
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Новый продукт"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория товара
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Категория продукта"
                        />
                    </label>

                    <label className="label">
                        Описание
                        <input
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание продукта"
                        />
                    </label>

                    <label className="label">
                        Цена
                        <input
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Стоимость продукта"
                            inputMode="numeric"
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Создать"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}