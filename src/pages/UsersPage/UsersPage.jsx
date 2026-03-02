import React, { useMemo, useState } from "react";
import "./UsersPage.css";
import UsersList from "../../components/UsersList";
import UserModal from "../../components/UserModal";

export default function UsersPage() {
    const [users, setUsers] = useState([
        { id: nanoid(6), name: 'Карина', age: 19 },
        { id: nanoid(6), name: 'Александр', age: 19 },
        { id: nanoid(6), name: 'Бездна', age: 1 },
    ]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [ediitingUser, setEditingUser] = useState(null);
    
};