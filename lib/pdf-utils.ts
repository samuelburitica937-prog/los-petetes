import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from './data';

export const generateQuotePDF = (items: any[], total: number) => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('es-CO');

    // Header Color Stripe
    doc.setFillColor(0, 31, 63); // Navy
    doc.rect(0, 0, 210, 40, 'F');

    // Logo / Title
    doc.setTextColor(255, 215, 0); // Gold
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('LOS PETETES MAYORISTAS', 15, 22);

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('DISTRIBUIDORA LÍDER - EJE CAFETERO', 15, 30);
    doc.text('Manizales | Pereira | Armenia', 15, 35);

    // Quote Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN DE PRODUCTOS', 15, 55);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, 160, 55);
    doc.text(`Válida por: 15 días calendario`, 160, 60);

    // Table
    const tableData = items.map(item => [
        item.quantity,
        item.product.nombre,
        formatPrice(item.product.precioMayorista),
        formatPrice(item.product.precioMayorista * item.quantity)
    ]);

    autoTable(doc, {
        startY: 70,
        head: [['Cant.', 'Producto', 'Precio Unitario', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: [0, 31, 63], textColor: [255, 215, 0], fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 15 },
            2: { cellWidth: 40, halign: 'right' },
            3: { cellWidth: 40, halign: 'right' },
        }
    });

    // Final Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFillColor(255, 215, 0);
    doc.rect(130, finalY, 65, 12, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 31, 63);
    doc.text('TOTAL COTIZADO:', 134, finalY + 8);
    doc.text(formatPrice(total), 190, finalY + 8, { align: 'right' });

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Precios vigentes para compras al por mayor. Sujeto a disponibilidad de inventario.', 15, 285);
    doc.text('Los Petetes - "Un paso adelante" en tu negocio.', 15, 290);

    // Save
    doc.save(`Cotizacion_Los_Petetes_${date.replace(/\//g, '-')}.pdf`);
};
// ─────────────────────────────────────────────────────────────
// TARJETA DE FIDELIZACIÓN — Tamaño CR80 (85.6 x 53.98 mm)
// ─────────────────────────────────────────────────────────────

export interface LoyaltyData {
    nombre: string;
    email: string;
    userId: string;
    totalCompras: number; // En COP
    totalPedidos: number;
}

function getLoyaltyLevel(totalCompras: number): {
    nivel: string;
    color: [number, number, number];
    descuento: string;
    emoji: string;
} {
    if (totalCompras >= 10_000_000) return { nivel: 'PLATINO', color: [192, 192, 192], descuento: '20%', emoji: '💎' };
    if (totalCompras >= 5_000_000)  return { nivel: 'GOLD',    color: [255, 215, 0],   descuento: '15%', emoji: '🥇' };
    if (totalCompras >= 2_000_000)  return { nivel: 'SILVER',  color: [200, 200, 220], descuento: '10%', emoji: '🥈' };
    return                                 { nivel: 'ALIADO',  color: [205, 127, 50],  descuento: '5%',  emoji: '🤝' };
}

export function generateLoyaltyCard(data: LoyaltyData): void {
    // Formato paisaje, tamaño exacto CR80
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98],
    });

    const W = 85.6;
    const H = 53.98;
    const { nivel, color, descuento } = getLoyaltyLevel(data.totalCompras);

    // ── FONDO PRINCIPAL (Navy)
    doc.setFillColor(0, 21, 50);
    doc.roundedRect(0, 0, W, H, 3, 3, 'F');

    // ── FRANJA DORADA SUPERIOR
    doc.setFillColor(...color);
    doc.rect(0, 0, W, 10, 'F');

    // ── BRILLO CORNER (efecto premium)
    doc.setFillColor(255, 255, 255);
    doc.setGState(doc.GState({ opacity: 0.04 }));
    doc.ellipse(W * 0.85, H * 0.15, 18, 18, 'F');
    doc.setGState(doc.GState({ opacity: 1 }));

    // ── NOMBRE MARCA (en franja dorada)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(0, 21, 50);
    doc.text('LOS PETETES MAYORISTA', 4, 6.8);
    
    // Nivel en la derecha de la franja
    doc.setFontSize(6);
    doc.text(nivel, W - 4, 6.8, { align: 'right' });

    // ── CHIP (decorativo estilo tarjeta)
    doc.setFillColor(200, 170, 80);
    doc.roundedRect(4, 13.5, 9, 7, 1, 1, 'F');
    doc.setDrawColor(160, 130, 50);
    doc.setLineWidth(0.3);
    // Líneas del chip
    doc.line(4, 16, 13, 16);
    doc.line(4, 18, 13, 18);
    doc.line(7, 13.5, 7, 20.5);
    doc.line(10, 13.5, 10, 20.5);

    // ── NOMBRE DEL CLIENTE
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    const nombreDisplay = data.nombre.length > 22 ? data.nombre.slice(0, 22) + '…' : data.nombre;
    doc.text(nombreDisplay.toUpperCase(), 4, 30);

    // ── EMAIL
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(200, 200, 200);
    doc.text(data.email, 4, 34.5);

    // ── NÚMERO DE TARJETA (estilo 4 grupos de 4)
    const cardNum = data.userId
        .replace(/-/g, '')
        .slice(0, 16)
        .padEnd(16, '0')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 160);
    doc.text(cardNum, 4, 41);

    // ── DESCUENTO MAYORISTA
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text('DESCUENTO MAYORISTA', 4, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...color);
    doc.text(descuento, 4, 50.5);

    // ── PEDIDOS
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text('PEDIDOS', 30, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(data.totalPedidos), 30, 50.5);

    // ── VIGENCIA (1 año desde hoy)
    const vigencia = new Date();
    vigencia.setFullYear(vigencia.getFullYear() + 1);
    const vigStr = `${String(vigencia.getMonth() + 1).padStart(2,'0')}/${vigencia.getFullYear()}`;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text('VÁLIDA HASTA', 56, 46);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(vigStr, 56, 50.5);

    // ── LOGO / BRAND (esquina derecha)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.text('★', W - 7, H - 5, { align: 'center' });

    // ── BORDE BRILLANTE
    doc.setDrawColor(...color);
    doc.setLineWidth(0.4);
    doc.roundedRect(0.5, 0.5, W - 1, H - 1, 2.5, 2.5, 'S');

    const filename = `Tarjeta_Petetes_${data.nombre.replace(/\s+/g, '_')}_${nivel}.pdf`;
    doc.save(filename);
}

// ─────────────────────────────────────────────────────────────
// CATALOGO PDF POR CATEGORIA
// ─────────────────────────────────────────────────────────────

export interface CatalogProduct {
    nombre: string;
    referencia?: string;
    descripcion?: string;
    precioMayorista: number;
    precioSugerido?: number;
    unidadMinima?: number;
    disponible?: boolean;
}

const CATEGORY_META: Record<string, { label: string; color: [number, number, number]; desc: string }> = {
    ferreteria:        { label: 'Ferreteria y Herramientas',  color: [255, 107, 53],  desc: 'Herramientas, fijaciones y electrico' },
    belleza:           { label: 'Belleza y Cuidado Personal', color: [255, 105, 180], desc: 'Cosmeticos, piel y cabello' },
    salud:             { label: 'Salud e Higiene',            color: [0, 200, 100],   desc: 'Medicamentos OTC y bienestar' },
    hogar:             { label: 'Hogar y Decoracion',         color: [79, 195, 247],  desc: 'Muebles, decoracion y electrodomesticos' },
    petshop:           { label: 'Pet Shop',                   color: [255, 140, 0],   desc: 'Mascotas, alimentos y accesorios' },
    deportes:          { label: 'Deportes y Recreacion',      color: [255, 215, 0],   desc: 'Equipos, ropa deportiva y fitness' },
    bebes:             { label: 'Bebes y Maternidad',         color: [255, 182, 193], desc: 'Panales, ropa y juguetes' },
    electrodomesticos: { label: 'Electrodomesticos',          color: [147, 112, 219], desc: 'Pequenos y grandes electrodomesticos' },
    tecnologia:        { label: 'Tecnologia y Accesorios',    color: [0, 191, 255],   desc: 'Gadgets, cables y accesorios tech' },
    papeleria:         { label: 'Papeleria y Oficina',        color: [50, 205, 50],   desc: 'Cuadernos, boligrafos y suministros' },
    escolar:           { label: 'Material Escolar',           color: [255, 165, 0],   desc: 'Todo para el regreso a clases' },
    oficina:           { label: 'Muebles y Oficina',          color: [119, 136, 153], desc: 'Sillas, escritorios y organizacion' },
    horaloca:          { label: 'Hora Loca y Fiestas',        color: [218, 112, 214], desc: 'Cotillon, decoracion y fiesta' },
    jugueteria:        { label: 'Jugueteria',                 color: [255, 99, 71],   desc: 'Juguetes para todas las edades' },
    intimates:         { label: 'Linea Intima',               color: [220, 20, 60],   desc: 'Productos adulto de alta rotacion' },
};

export function generateCatalogPDF(
    categoryId: string,
    products: CatalogProduct[]
): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const meta = CATEGORY_META[categoryId] || { label: categoryId, color: [0, 31, 63] as [number,number,number], desc: '' };
    const date = new Date().toLocaleDateString('es-CO');
    const [r, g, b] = meta.color;

    // Header Navy
    doc.setFillColor(0, 20, 45);
    doc.rect(0, 0, 210, 50, 'F');

    // Franja de color
    doc.setFillColor(r, g, b);
    doc.rect(0, 44, 210, 8, 'F');

    // Titulo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 215, 0);
    doc.text('LOS PETETES MAYORISTA', 15, 18);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    doc.text('Manizales | Pereira | Armenia  •  +57 314 509 0821  •  lospetetes.vercel.app', 15, 25);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(r, g, b);
    doc.text('CATALOGO: ' + meta.label.toUpperCase(), 15, 38);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(meta.desc + '  |  Fecha: ' + date, 15, 48.5);

    // Subtotales header
    doc.setFillColor(0, 31, 63);
    doc.rect(0, 52, 210, 12, 'F');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 215, 0);
    doc.text('PEDIDOS: +57 314 509 0821', 15, 60);
    doc.text('WEB: lospetetes.vercel.app', 90, 60);
    doc.text('IG: @lospetetesmanizales7', 160, 60);

    // Tabla de productos
    const tableBody = products.map(function(p, i) {
        return [
            String(i + 1).padStart(2, '0'),
            p.referencia || ('LP-' + String(i + 1).padStart(4, '0')),
            p.nombre,
            p.descripcion ? p.descripcion.slice(0, 45) : '-',
            p.unidadMinima ? ('x' + p.unidadMinima) : 'x1',
            formatPrice(p.precioMayorista),
            p.disponible === false ? 'Agotado' : 'Disponible',
        ];
    });

    autoTable(doc, {
        startY: 68,
        head: [['#', 'Ref.', 'Producto', 'Descripcion', 'Min.', 'Precio Mayor.', 'Stock']],
        body: tableBody,
        headStyles: { fillColor: [0, 20, 45], textColor: [255, 215, 0], fontStyle: 'bold', fontSize: 8, cellPadding: 3 },
        bodyStyles: { fontSize: 8, cellPadding: 2.5 },
        alternateRowStyles: { fillColor: [242, 246, 250] },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 22 },
            2: { cellWidth: 45, fontStyle: 'bold' },
            3: { cellWidth: 50, textColor: [80, 80, 80] },
            4: { cellWidth: 12, halign: 'center' },
            5: { cellWidth: 32, halign: 'right', textColor: [0, 110, 0], fontStyle: 'bold' },
            6: { cellWidth: 22, halign: 'center' },
        },
    });

    // Bloque "Como pedir"
    var fy = Math.min((doc as any).lastAutoTable.finalY + 8, 255);
    doc.setFillColor(0, 20, 45);
    doc.roundedRect(15, fy, 180, 20, 3, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 215, 0);
    doc.text('COMO HACER TU PEDIDO:', 20, fy + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('1. Elige productos  2. WhatsApp +57 314 509 0821  3. Confirma pago  4. Recibe en bodega', 20, fy + 14);

    // Footer
    doc.setFillColor(r, g, b);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 20, 45);
    doc.text('LOS PETETES MAYORISTA  |  Precios validos 15 dias. Sujeto a disponibilidad.', 15, 292);

    doc.save('Catalogo_Petetes_' + meta.label.replace(/[^a-zA-Z]/g, '_') + '_' + date.replace(/\//g, '-') + '.pdf');
}
