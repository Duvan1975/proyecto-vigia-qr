export function CuadrosTexto({
  tamanoinput,
  titulolabel,
  tipoinput,
  nombreinput,
  idinput,
  placeholderinput,
  value,
  onChange
}) {
  return (
    <div className={tamanoinput}>
      <label htmlFor={idinput}>{titulolabel}</label>
      <input
        type={tipoinput}
        name={nombreinput}
        id={idinput}
        placeholder={placeholderinput}
        className="form-control"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}