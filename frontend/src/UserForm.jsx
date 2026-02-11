const UserForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmarPassword: '',
        rol: 'ADMINISTRATIVO',
        estado: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmarPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        onSubmit({
            username: formData.username,
            password: formData.password,
            rol: formData.rol,
            estado: formData.estado
        });
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h5>Crear Nuevo Usuario</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <label className="form-label">Usuario *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.username}
                                onChange={(e) => setFormData({...formData, username: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Rol *</label>
                            <select
                                className="form-select"
                                value={formData.rol}
                                onChange={(e) => setFormData({...formData, rol: e.target.value})}
                            >
                                <option value="ADMINISTRATIVO">Administrador</option>
                                <option value="OPERATIVO">Operativo</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-md-6">
                            <label className="form-label">Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmarPassword}
                                onChange={(e) => setFormData({...formData, confirmarPassword: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.estado}
                                onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                            />
                            <label className="form-check-label">Usuario activo</label>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button type="submit" className="btn btn-success me-2">
                            <i className="bi bi-check-circle me-2"></i>
                            Crear Usuario
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
