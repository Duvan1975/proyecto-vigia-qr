export function CuadrosTexto(props) {
    return (
        <div className={props.tamanoinput}>
            <label htmlFor={props.idinput}>{props.titulolabel}</label>

            {props.opciones ? (
                <select
                    className="form-control"
                    name={props.nombreinput}
                    id={props.idinput}
                >
                    <option value="">Seleccione una opción</option>
                    {props.opciones.map((opcion, index) => (
                        <option key={index} value={opcion}>
                            {opcion.charAt(0).toUpperCase() + opcion.slice(1).replaceAll("_", " ")}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={props.tipoinput}
                    name={props.nombreinput}
                    id={props.idinput}
                    placeholder={props.placeholderinput}
                    className="form-control"
                />
            )}
        </div>
    );
}