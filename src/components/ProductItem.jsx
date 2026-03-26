import React from "react";
export default function UserItem({ product, onEdit, onDelete }) {
    return (
        <div className="productRow">
                <img className="productPhoto" src={product.photo} alt={product.name}/>
                <div className="productId">#{product.id}</div>
                <div className="productName">{product.name}</div>
                <div className="productCategory">{product.category}</div>
                <div className="productDescription">{product.description}</div>
                <div className="productPrice">{product.price} рублей</div>
            <div className="productActions">
                <button className="btn btn--success" onClick={() => onEdit(product)}>
                    Редактировать
                </button>
                <button className="btn btn--danger" onClick={() =>
                    onDelete(product.id)}>
                    Убрать
                </button>
            </div>
        </div>
    );
}