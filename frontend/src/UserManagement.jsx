import React, { useState, useEffect } from 'react';
import { authGet } from '../utils/authFetch';

const UserManagement = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await authGet('http://localhost:8080/usuarios');
            console.log('Data received:', data); // ← Agrega esto para debuggear
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Usuarios</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.rol}</td>
                            <td>{user.estado ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;