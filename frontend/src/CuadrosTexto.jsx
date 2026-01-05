export function CuadrosTexto(props) {
    return (
        <div className={props.tamanoinput}>
            <label htmlFor="">{props.titulolabel}</label>
            <input type={props.tipoinput}
                name={props.nombreinput}
                id={props.idinput}
                placeholder={props.placeholderinput}
                className="form-control"
            />
        </div>
    )
}