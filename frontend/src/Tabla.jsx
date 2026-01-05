export function Tabla() {

    return (
        <table className="table table-striped table-hover" id="tabla">
            <thead>
                <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Tipo Documento</th>
                    <th>Número Documento</th>
                    <th>Usuario</th>
                    <th>Contraseña</th>
                    <th>Rol</th>
                </tr>
            </thead>
            <tbody id="tablabody">
                
            </tbody>
        </table>
    )
}