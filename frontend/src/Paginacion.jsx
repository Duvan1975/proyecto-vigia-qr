import React from "react";

const Paginacion = ({ totalPaginas, paginaActual, onChange }) => {
  if (totalPaginas === 0) return null;

  return (
    <div className="d-flex justify-content-center mt-3">
      {Array.from({ length: totalPaginas }, (_, index) => (
        <button
          key={index}
          className={`btn btn-sm mx-1 ${
            index === paginaActual ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => onChange(index)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default Paginacion;