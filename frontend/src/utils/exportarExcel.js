import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

export function exportarAExcel(datos, nombreArchivo = "exportacion") {
    if (!datos || datos.length === 0) {
        console.warn("No hay datos para exportar");
        return;
    }

    // 1. Crear hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(datos);

    // 2. Ajustar anchos de columnas automáticamente
    worksheet['!cols'] = calcularAnchosColumnas(datos);

    // 3. Añadir filtros a la primera fila
    const lastCol = Object.keys(datos[0]).length - 1;
    worksheet['!autofilter'] = {
        ref: XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: 0, c: lastCol }
        })
    };

    // 4. Congelar la primera fila (encabezados)
    worksheet['!freeze'] = {
        xSplit: 0,
        ySplit: 1,
        topLeftCell: "A2"
    };

    // 5. Crear libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    // 6. Configurar propiedades del documento
    workbook.Props = {
        Title: nombreArchivo,
        Author: "Sistema de Gestión",
        CreatedDate: new Date()
    };

    // 7. Generar archivo
    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
    });

    // 8. Descargar el archivo
    const archivoBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    FileSaver.saveAs(archivoBlob, `${nombreArchivo}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// Función auxiliar mejorada para calcular anchos de columnas
function calcularAnchosColumnas(datos) {
    const encabezados = Object.keys(datos[0]);
    return encabezados.map(key => {
        const contenido = datos.map(d => String(d[key] || ''));
        const maxLength = Math.max(
            key.length,
            ...contenido.map(s => s.length)
        );

        // Ajuste más preciso del ancho
        return {
            wch: Math.min(
                Math.max(maxLength * 1.2, 10), // Factor de 1.2 para mejor legibilidad
                50 // Ancho máximo
            )
        };
    });
}