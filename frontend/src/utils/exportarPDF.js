// exportarPDF.js - Versión con QR de mayor tamaño
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';

export async function exportarCodigosQRaPDF(codigosQr, puesto, authFetch) {
    if (!codigosQr || codigosQr.length === 0) {
        Swal.fire("Información", "No hay códigos QR para exportar", "info");
        return;
    }

    Swal.fire({
        title: "Generando PDF...",
        text: "Descargando imágenes QR",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const doc = new jsPDF();
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Título
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`Códigos QR - ${puesto}`, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 12;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total: ${codigosQr.length} códigos | Fecha: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 20;

        // Por cada código QR - AHORA CON QR MÁS GRANDES
        for (let i = 0; i < codigosQr.length; i++) {
            // Verificar si necesitamos nueva página (ajustado para QR más grandes)
            if (yPos > pageHeight - 60) {
                doc.addPage();
                yPos = 20;
            }

            const codigo = codigosQr[i];
            
            try {
                const response = await authFetch(`http://localhost:8080/codigos-qr/${codigo.id}/descargar`);
                const blob = await response.blob();
                const base64 = await blobToBase64(blob);
                
                // ===== QR MÁS GRANDE =====
                // Aumenté el tamaño de 25x25 a 45x45
                const qrSize = 45; // Cambia este valor para más/menos tamaño
                doc.addImage(base64, 'PNG', 20, yPos, qrSize, qrSize);
                
                // Información con fuente más grande para acompañar al QR grande
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text(`Ubicación: ${codigo.ubicacion || 'N/A'}`, 75, yPos + 10);
                
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                // Descripción con formato
                const descripcion = codigo.descripcion || 'Sin descripción';
                // Dividir descripción larga en múltiples líneas
                const descripcionSplit = doc.splitTextToSize(descripcion, 100);
                doc.text(descripcionSplit, 75, yPos + 20);
                
                // Estado destacado
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(12);
                doc.setTextColor(codigo.estado ? 0 : 200, codigo.estado ? 150 : 0, 0);
                doc.text(`Estado: ${codigo.estado ? 'ACTIVO' : 'INACTIVO'}`, 75, yPos + 40);
                doc.setTextColor(0, 0, 0);
                
                // Línea separadora más gruesa
                doc.setDrawColor(180, 180, 180);
                doc.setLineWidth(0.5);
                doc.line(20, yPos + 55, pageWidth - 20, yPos + 55);
                
                yPos += 65; // Más espacio entre QR por el tamaño aumentado
                
            } catch (error) {
                console.error(`Error con QR ${codigo.id}:`, error);
                // Placeholder para QR fallido
                doc.setFillColor(240, 240, 240);
                doc.rect(20, yPos, 45, 45, 'F');
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text('QR no disponible', 20, yPos + 25);
                doc.setTextColor(0, 0, 0);
                yPos += 65;
            }
        }

        // Añadir página de resumen
        doc.addPage();
        yPos = 20;
        
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumen de Códigos QR', 20, yPos);
        
        yPos += 15;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Puesto: ${puesto}`, 20, yPos);
        yPos += 8;
        doc.text(`Total de códigos: ${codigosQr.length}`, 20, yPos);
        yPos += 8;
        doc.text(`Fecha de exportación: ${new Date().toLocaleString()}`, 20, yPos);
        
        yPos += 15;
        
        // Listado resumen con IDs
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Listado de ubicaciones:', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        codigosQr.forEach((codigo, index) => {
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(`${index + 1}. ${codigo.ubicacion || 'N/A'} - ${codigo.estado ? 'Activo' : 'Inactivo'}`, 25, yPos);
            yPos += 6;
        });

        // Pie de página en todas las páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(100, 100, 100);
            doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
            doc.text(`Sistema de Gestión - QR Export`, 20, pageHeight - 10);
            doc.setTextColor(0, 0, 0);
        }

        // Nombre del archivo
        const nombreArchivo = `codigos_qr_${puesto.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0, 10)}.pdf`;
        doc.save(nombreArchivo);
        
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'PDF generado',
            html: `
                <p><strong>${codigosQr.length} códigos QR exportados</strong></p>
                <p class="text-muted small">Imágenes QR de 45x45 mm</p>
            `,
            timer: 2000,
            showConfirmButton: false
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'No se pudo generar el PDF: ' + error.message, 'error');
    }
}

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
    });
}