import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatPrice } from './data';

export const generateQuotePDF = (items: any[], total: number, user?: any) => {
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
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('COTIZACIÓN DE PRODUCTOS', 15, 50);
    
    if (user && user.nombre) {
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Preparada para: ${user.nombre}`, 15, 56);
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Fecha: ${date}`, 160, 50);
    doc.text(`Válida por: 15 días calendario`, 160, 56);

    // Table
    const tableData = items.map(item => [
        item.quantity,
        item.product.nombre,
        formatPrice(item.product.precioMayorista),
        formatPrice(item.product.precioMayorista * item.quantity)
    ]);

    autoTable(doc, {
        startY: 65,
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
    doc.rect(120, finalY, 75, 12, 'F'); // Made box wider (was 130, 65)
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 31, 63);
    doc.text('TOTAL COTIZADO:', 124, finalY + 8);
    doc.text(formatPrice(total), 190, finalY + 8, { align: 'right' });

    // Payment Methods
    let paymentsY = finalY + 30;
    doc.setFontSize(10);
    doc.setTextColor(0, 31, 63);
    doc.text('MÉTODOS DE PAGO DISPONIBLES', 15, paymentsY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Paga con tus sistemas favoritos:', 15, paymentsY + 5);

    const favorites = user?.metodosPago || ['Nequi', 'Bancolombia'];
    const allowedMethods = ['Nequi', 'Wompi', 'Bancolombia', 'PSE', 'PayPal', 'Payoneer'];
    const methodsToShow = allowedMethods.filter(m => favorites.includes(m));
    if (methodsToShow.length === 0) methodsToShow.push('Nequi', 'Bancolombia');

    // Usamos el origen actual del navegador para la simulación
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

    let xOffset = 15;
    methodsToShow.forEach(method => {
        const url = `${baseUrl}/checkout?method=${encodeURIComponent(method)}&amount=${total}`;
        if (method === 'Nequi') {
            doc.setFillColor(216, 27, 96);
            doc.roundedRect(xOffset, paymentsY + 10, 24, 8, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text('NEQUI', xOffset + 12, paymentsY + 15, { align: 'center' });
            doc.link(xOffset, paymentsY + 10, 24, 8, { url });
            xOffset += 28;
        } else if (method === 'Wompi') {
            doc.setFillColor(25, 118, 210);
            doc.roundedRect(xOffset, paymentsY + 10, 24, 8, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text('WOMPI', xOffset + 12, paymentsY + 15, { align: 'center' });
            doc.link(xOffset, paymentsY + 10, 24, 8, { url });
            xOffset += 28;
        } else if (method === 'Bancolombia') {
            doc.setFillColor(245, 205, 0);
            doc.roundedRect(xOffset, paymentsY + 10, 28, 8, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(0, 0, 0);
            doc.text('BANCOLOMBIA', xOffset + 14, paymentsY + 15, { align: 'center' });
            doc.link(xOffset, paymentsY + 10, 28, 8, { url });
            xOffset += 32;
        } else {
            doc.setFillColor(0, 31, 63);
            doc.roundedRect(xOffset, paymentsY + 10, 24, 8, 1, 1, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(6);
            doc.setTextColor(255, 255, 255);
            doc.text(method.toUpperCase(), xOffset + 12, paymentsY + 15, { align: 'center' });
            doc.link(xOffset, paymentsY + 10, 24, 8, { url });
            xOffset += 28;
        }
    });

    // PAGO VIA ASESOR (WhatsApp)
    const itemsDetailed = items.map(i => `${i.quantity}x ${i.product.nombre} a ${formatPrice(i.product.precioMayorista)} c/u`).join(', ');
    const userName = user?.nombre || 'Usuario';
    const totalFormatted = formatPrice(total);
    const waText = `Hola SOMOS ${userName}, ESTAMOS interesados en pagar los productos: ${itemsDetailed}. Total cotizado: ${totalFormatted}. Queremos pagarlos vía asesor.`;
    const waUrl = `https://wa.me/573145090821?text=${encodeURIComponent(waText)}`;

    doc.setFillColor(37, 211, 102); // WhatsApp Green
    doc.roundedRect(xOffset, paymentsY + 10, 40, 8, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text('PAGO VÍA ASESOR (WA)', xOffset + 20, paymentsY + 15, { align: 'center' });
    doc.link(xOffset, paymentsY + 10, 40, 8, { url: waUrl });

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
    if (totalCompras >= 20_000_000) return { nivel: 'PLATINO', color: [229, 228, 226], descuento: '15%', emoji: '💎' };
    if (totalCompras >= 10_000_000) return { nivel: 'GOLD',    color: [255, 215, 0],   descuento: '10%', emoji: '🥇' };
    if (totalCompras >= 5_000_000)  return { nivel: 'SILVER',  color: [200, 200, 220], descuento: '8%',  emoji: '🥈' };
    if (totalCompras >= 2_000_000)  return { nivel: 'BRONCE',  color: [205, 127, 50],  descuento: '7%',  emoji: '🥉' };
    return                                 { nivel: 'ALIADO',  color: [79, 195, 247],  descuento: '5%',  emoji: '🤝' };
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

    // ── FONDO PRINCIPAL (Azul oscuro / Navy)
    doc.setFillColor(11, 27, 61); // #0b1b3d
    doc.roundedRect(0, 0, W, H, 3, 3, 'F');

    // ── BORDE EXTERIOR
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.roundedRect(2, 2, W - 4, H - 4, 2, 2, 'S');

    // ── DECORACIÓN GEOMÉTRICA (Tech lines)
    doc.setDrawColor(79, 195, 247); // Light blue
    doc.setLineWidth(0.1);
    doc.line(10, 10, 25, 25);
    doc.line(25, 25, 25, H - 10);
    doc.line(W - 10, 10, W - 25, 25);
    doc.line(W - 25, 25, W - 25, H - 10);

    // ── TÍTULO (Dorado)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 215, 0); // Gold
    doc.text('TARJETA CLIENTE LOS PETETES', W / 2, 8, { align: 'center' });
    
    doc.setFontSize(7);
    doc.setTextColor(...color);
    doc.text(`MIEMBRO ${nivel}`, W / 2, 12, { align: 'center' });

    // ── TEXTOS DEL CUERPO (Miembro desde / Vencimiento)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(137, 180, 248); // Light blue / Silver
    doc.text('MIEMBRO DESDE:', 15, 25);
    doc.text('VENCIMIENTO:', 15, 32);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(232, 240, 254);
    
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const expiryYear = currentYear + 3;

    doc.text(`${currentMonth}/${currentYear}`, 45, 25);
    doc.text(`${currentMonth}/${expiryYear}`, 45, 32);

    // ── CHIP
    doc.setFillColor(212, 175, 55); // Metallic Gold
    doc.roundedRect(65, 20, 10, 8, 1, 1, 'F');
    doc.setDrawColor(160, 130, 50);
    doc.setLineWidth(0.2);
    doc.line(65, 22, 75, 22);
    doc.line(65, 26, 75, 26);
    doc.line(68, 20, 68, 28);
    doc.line(72, 20, 72, 28);

    // ── LOGO "LP"
    doc.setDrawColor(137, 180, 248);
    doc.setLineWidth(0.5);
    doc.circle(70, 40, 5, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(137, 180, 248);
    doc.text('LP', 70, 41.5, { align: 'center' });
    doc.setFontSize(4);
    doc.text('LOS PETETES', 70, 47, { align: 'center' });

    // ── NOMBRE DEL CLIENTE Y DESCUENTO
    const nombreDisplay = data.nombre.length > 20 ? data.nombre.slice(0, 20) + '…' : data.nombre;
    doc.setFontSize(8);
    doc.setTextColor(255, 215, 0); // Nombre en dorado
    doc.text(nombreDisplay.toUpperCase(), 15, 43);

    const cardNum = data.userId.replace(/-/g, '').slice(0, 16).padEnd(16, '0').replace(/(.{4})/g, '$1 ').trim().toUpperCase();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text(cardNum, 15, 47);

    // ── DESCUENTO EN LA ESQUINA
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(...color);
    doc.text(`DESCUENTO: ${descuento}`, W - 25, 48, { align: 'right' });

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
    imagenes?: string[];
}

const imageCache: Record<string, string> = {};

async function fetchImageBase64(url: string): Promise<string | null> {
    if (imageCache[url]) return imageCache[url];
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const b64 = reader.result as string;
                imageCache[url] = b64;
                resolve(b64);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return null;
    }
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

export async function generateCatalogPDF(
    categoryId: string,
    products: CatalogProduct[],
    user?: any,
    returnBlob: boolean = false
): Promise<Blob | void> {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const meta = CATEGORY_META[categoryId] || { label: categoryId.toUpperCase(), color: [255, 215, 0] as [number,number,number], desc: '' };
    const date = new Date().toLocaleDateString('es-CO');
    
    const bgColor: [number, number, number] = [20, 24, 32]; 
    const goldColor: [number, number, number] = [255, 215, 0];
    const greenColor: [number, number, number] = [37, 211, 102];
    
    // --- PAGE 1: COVER ---
    doc.setFillColor(...bgColor);
    doc.rect(0, 0, 210, 297, 'F');
    
    // Gold line left
    doc.setFillColor(...goldColor);
    doc.rect(10, 0, 2, 297, 'F');
    // Gold line right
    doc.rect(198, 0, 2, 297, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(...goldColor);
    doc.text('LOS PETETES MAYORISTA', 105, 80, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text('LUJO Y CALIDAD PARA TU NEGOCIO', 105, 90, { align: 'center' });

    if (user && user.nombre) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(`¡Hola, ${user.nombre}! 👋`, 105, 110, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(180, 180, 180);
        doc.text(`Gracias por confiar en nosotros.`, 105, 118, { align: 'center' });
        doc.text(`Aquí tienes el catálogo que preparaste.`, 105, 125, { align: 'center' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(...goldColor);
    doc.text(meta.label.toUpperCase(), 105, 140, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('Catalogo de Productos', 105, 155, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text(`${products.length} productos disponibles`, 105, 165, { align: 'center' });
    
    doc.setDrawColor(...goldColor);
    doc.line(70, 172, 140, 172);
    
    doc.setFontSize(10);
    doc.text(`Actualizado: ${date}`, 105, 180, { align: 'center' });

    // Botones WhatsApp Cover
    doc.setFillColor(...greenColor);
    doc.roundedRect(30, 200, 70, 18, 2, 2, 'F');
    doc.roundedRect(110, 200, 70, 18, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    // @ts-ignore
    doc.textWithLink('WhatsApp Johana', 65, 211, { url: 'https://wa.me/573146301755', align: 'center' });
    // @ts-ignore
    doc.textWithLink('WhatsApp Laura', 145, 211, { url: 'https://wa.me/573148463900', align: 'center' });

    // --- PRODUCTS PAGES ---
    const itemsPerPage = 6;
    let pageNum = 1;

    for (let i = 0; i < products.length; i++) {
        const isNewPage = i % itemsPerPage === 0;
        if (isNewPage) {
            doc.addPage();
            pageNum++;
            doc.setFillColor(...bgColor);
            doc.rect(0, 0, 210, 297, 'F');
            
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.setTextColor(...goldColor);
            doc.text(meta.label.toUpperCase(), 15, 20);
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(`Pagina ${pageNum - 1}`, 195, 20, { align: 'right' });
            
            doc.setDrawColor(...goldColor);
            doc.line(15, 25, 195, 25);
        }

        const idxOnPage = i % itemsPerPage;
        const col = idxOnPage % 2; // 0 or 1
        const row = Math.floor(idxOnPage / 2); // 0, 1, or 2
        
        const cardW = 85;
        const cardH = 80;
        const startX = 15 + (col * (cardW + 10));
        const startY = 32 + (row * (cardH + 8));

        // Card bg
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(startX, startY, cardW, cardH, 3, 3, 'F');

        const p = products[i];
        
        // Product Image
        if (p.imagenes && p.imagenes.length > 0) {
            const b64 = await fetchImageBase64(p.imagenes[0]);
            if (b64) {
                try {
                    doc.addImage(b64, 'JPEG', startX + 2, startY + 2, cardW - 4, 38, undefined, 'FAST');
                } catch (e) {
                    doc.setFillColor(230,230,230);
                    doc.rect(startX + 2, startY + 2, cardW - 4, 38, 'F');
                }
            } else {
                doc.setFillColor(230,230,230);
                doc.rect(startX + 2, startY + 2, cardW - 4, 38, 'F');
            }
        } else {
            doc.setFillColor(230,230,230);
            doc.rect(startX + 2, startY + 2, cardW - 4, 38, 'F');
        }

        // Ref & Title
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text(`REF: ${p.referencia || 'LP-00'+(i+1)}`, startX + 4, startY + 44);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        const titleStr = p.nombre.length > 35 ? p.nombre.slice(0, 35) + '...' : p.nombre;
        doc.text(titleStr, startX + 4, startY + 48.5);

        // Price
        doc.setFontSize(10);
        doc.setTextColor(0, 120, 0);
        doc.text(formatPrice(p.precioMayorista), startX + cardW - 4, startY + 48.5, { align: 'right' });

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6);
        doc.setTextColor(150, 150, 150);
        doc.text('Color: Varios tonos - Alta calidad garantizada', startX + 4, startY + 52);

        // Payment Buttons row based on user favorites
        let xOffset = startX + 4;
        const favorites = user?.metodosPago || ['Nequi', 'Wompi', 'Bancolombia'];
        const allowedMethods = ['Nequi', 'Wompi', 'Bancolombia', 'PSE', 'PayPal', 'Payoneer'];
        
        // Show up to 3 preferred payment methods
        const methodsToShow = allowedMethods.filter(m => favorites.includes(m)).slice(0, 3);
        if (methodsToShow.length === 0) methodsToShow.push('Nequi', 'Bancolombia'); // fallback

        methodsToShow.forEach(method => {
            if (method === 'Nequi') {
                doc.setFillColor(216, 27, 96);
                doc.roundedRect(xOffset, startY + 56, 24, 6, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5);
                doc.setTextColor(255, 255, 255);
                doc.text('NEQUI', xOffset + 12, startY + 60, { align: 'center' });
                xOffset += 26;
            } else if (method === 'Wompi') {
                doc.setFillColor(25, 118, 210);
                doc.roundedRect(xOffset, startY + 56, 24, 6, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5);
                doc.setTextColor(255, 255, 255);
                doc.text('WOMPI', xOffset + 12, startY + 60, { align: 'center' });
                xOffset += 26;
            } else if (method === 'Bancolombia') {
                doc.setFillColor(245, 205, 0);
                doc.roundedRect(xOffset, startY + 56, 25, 6, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5);
                doc.setTextColor(0, 0, 0);
                doc.text('BANCOLOMBIA', xOffset + 12.5, startY + 60, { align: 'center' });
                xOffset += 27;
            } else {
                // generic for PSE/PayPal/Payoneer
                doc.setFillColor(0, 31, 63);
                doc.roundedRect(xOffset, startY + 56, 24, 6, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(5);
                doc.setTextColor(255, 255, 255);
                doc.text(method.toUpperCase(), xOffset + 12, startY + 60, { align: 'center' });
                xOffset += 26;
            }
        });

        // WhatsApp Buttons interactive
        doc.setFillColor(...greenColor);
        doc.roundedRect(startX + 4, startY + 64, 37, 12, 1, 1, 'F');
        doc.roundedRect(startX + 43, startY + 64, 38, 12, 1, 1, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7);
        // @ts-ignore
        doc.textWithLink('Comprar vía Johana', startX + 22.5, startY + 71, { url: `https://wa.me/573146301755?text=Hola,%20me%20interesa%20el%20producto%20${p.referencia || p.nombre}`, align: 'center' });
        // @ts-ignore
        doc.textWithLink('Comprar vía Laura', startX + 62, startY + 71, { url: `https://wa.me/573148463900?text=Hola,%20me%20interesa%20el%20producto%20${p.referencia || p.nombre}`, align: 'center' });
    }

    if (returnBlob) {
        return doc.output('blob');
    } else {
        doc.save(`Catalogo_Petetes_${meta.label.replace(/[^a-zA-Z]/g, '_')}_${date.replace(/\//g, '-')}.pdf`);
    }
}
