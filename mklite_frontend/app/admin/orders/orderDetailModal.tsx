"use client";

import React from "react";
import styles from "./modal.module.css";
import { X, Download } from "lucide-react"; 
import type Order from "../../models/order.model";

// Librerías para PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  order: Order;
  onClose: () => void;
}

export default function OrderDetailModal({ order, onClose }: Props) {
  
  // --- HELPERS ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => `Bs. ${Number(amount).toFixed(2)}`;

  const address = order.user?.addresses?.[0] 
    ? `${order.user.addresses[0].street} #${order.user.addresses[0].streetNumber}` 
    : 'Dirección no registrada';
  
  const userName = order.user?.fullName || "Cliente";

  // --- LÓGICA DE GENERACIÓN DE PDF ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colores
    const redColor = "#d32f2f";
    const darkColor = "#333333";
    const greyColor = "#666666";

    // 1. LOGO (Centrado dinámico)
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");

    const text1 = "MERKADO";
    const text2 = "LITE";
    
    const width1 = doc.getTextWidth(text1);
    const width2 = doc.getTextWidth(text2);
    const totalWidth = width1 + width2;
    const startX = (pageWidth - totalWidth) / 2;

    doc.setTextColor(redColor);
    doc.text(text1, startX, 20);

    doc.setTextColor(darkColor);
    doc.text(text2, startX + width1, 20);

    // 2. INFO EMPRESA
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(greyColor);
    doc.text("MERKADOLITE S.A.", pageWidth / 2, 26, { align: "center" });
    doc.text("NIT: 1023456021", pageWidth / 2, 30, { align: "center" });
    doc.text("Av. Comercio 456 - La Paz, Bolivia", pageWidth / 2, 34, { align: "center" });
    doc.setTextColor(redColor);
    doc.text("Tel: (+591) 700-123-45", pageWidth / 2, 38, { align: "center" });

    // 3. TÍTULO RECIBO
    doc.setDrawColor(200); 
    doc.line(40, 42, 170, 42); 
    
    doc.setFontSize(14);
    doc.setTextColor(darkColor);
    doc.text("RECIBO DE COMPRA", pageWidth / 2, 50, { align: "center" });
    
    doc.line(40, 54, 170, 54); 

    // 4. DATOS CLIENTE
    doc.setFontSize(10);
    doc.setTextColor(darkColor);
    
    let yPos = 65;
    const leftMargin = 40;
    
    doc.text(`Cliente: ${userName}`, leftMargin, yPos);
    doc.text(`Código de pedido: #${order.id}`, leftMargin, yPos + 6);
    doc.text(`Fecha: ${formatDate(order.createdAt)}`, leftMargin, yPos + 12);
    doc.text(`Dirección de envío: ${address}`, leftMargin, yPos + 18);

    doc.line(40, yPos + 24, 170, yPos + 24); 

    // 5. TOTAL DESTACADO
    yPos += 35;
    doc.setFontSize(10);
    doc.text("TOTAL PAGADO", pageWidth / 2, yPos, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(order.orderTotal), pageWidth / 2, yPos + 7, { align: "center" });

    // 6. TABLA DE PRODUCTOS (CORREGIDA CON CANTIDAD)
    const tableBody = order.items?.map(item => [
        item.product?.name || "Producto",
        item.quantity.toString(), // Columna Cantidad Agregada
        formatCurrency(item.unitPrice),
        formatCurrency(item.quantity * item.unitPrice) // Columna Subtotal Agregada
    ]) || [];

    (autoTable as any)(doc, {
        startY: yPos + 15,
        margin: { left: 40, right: 40 },
        // Headers actualizados para reflejar las 4 columnas
        head: [['Producto', 'Cant', 'Precio', 'Subtotal']], 
        body: tableBody,
        theme: 'plain', 
        styles: { fontSize: 10, cellPadding: 2, textColor: darkColor },
        headStyles: { fillColor: [255, 255, 255], textColor: darkColor, fontStyle: 'bold', halign: 'right' },
        columnStyles: {
            0: { halign: 'left' },   // Producto a la izquierda
            1: { halign: 'center' }, // Cantidad centrada
            2: { halign: 'right' },  // Precio a la derecha
            3: { halign: 'right' }   // Subtotal a la derecha
        },
        didParseCell: (data: any) => {
            // Alinear el header de 'Producto' a la izquierda
            if (data.section === 'head' && data.column.index === 0) {
                data.cell.styles.halign = 'left';
            }
            // Alinear el header de 'Cant' al centro
            if (data.section === 'head' && data.column.index === 1) {
                data.cell.styles.halign = 'center';
            }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 5;

    // 7. RESUMEN DE MONTOS
    doc.setDrawColor(200);
    doc.line(40, finalY, 170, finalY);

    const summaryY = finalY + 8;
    const rightMargin = 170;
    const labelX = 40;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text("SUBTOTAL", labelX, summaryY);
    doc.text(formatCurrency(order.orderTotal), rightMargin, summaryY, { align: "right" });

    doc.text("DESCUENTO", labelX, summaryY + 6);
    doc.text("Bs. 0.00", rightMargin, summaryY + 6, { align: "right" });

    doc.text("ENVÍO", labelX, summaryY + 12);
    doc.text("Bs. 0.00", rightMargin, summaryY + 12, { align: "right" });

    doc.text("IMPUESTOS", labelX, summaryY + 18);
    doc.setTextColor(redColor);
    doc.text("Incluidos", rightMargin, summaryY + 18, { align: "right" });
    doc.setTextColor(darkColor);

    doc.line(40, summaryY + 24, 170, summaryY + 24); 

    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", labelX, summaryY + 32);
    doc.text(formatCurrency(order.orderTotal), rightMargin, summaryY + 32, { align: "right" });

    // 8. FOOTER
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const footerY = summaryY + 45;

    doc.text(`Forma de pago: ${order.paymentMethod || 'Efectivo'}`, labelX, footerY);
    doc.text(`Autorización: ${Math.floor(100000 + Math.random() * 900000)}`, labelX, footerY + 5);

    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235); 
    doc.text("Este documento es un comprobante de compra electrónico.", pageWidth / 2, footerY + 15, { align: "center" });
    
    doc.setTextColor(greyColor);
    doc.text("Gracias por confiar en Merkado Lite.", pageWidth / 2, footerY + 20, { align: "center" });
    doc.text("www.merkadolite.com", pageWidth / 2, footerY + 24, { align: "center" });

    doc.save(`Recibo_MerkadoLite_${order.id}.pdf`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER ROJO */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <h2 className={styles.title}>Detalle del pedido</h2>
            <div className={styles.headerActions}>
                <span className={`${styles.badge} ${styles.badgeDelivered}`}>
                    {order.status === 'delivered' ? 'Entregado' : order.status}
                </span>
                <button className={styles.closeIconBtn} onClick={onClose}>
                    <X size={24} color="white" />
                </button>
            </div>
          </div>

          <div className={styles.orderMeta}>
            <p><strong>Código pedido:</strong> #{order.id}</p>
            <p><strong>Fecha:</strong> {formatDate(order.createdAt)}</p>
            <p className={styles.address}><strong>Enviado a:</strong> {address}</p>
          </div>
        </div>

        {/* BODY BLANCO */}
        <div className={styles.body}>
          
          <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.textLeft}>Producto</th>
                        <th className={styles.textCenter}>Cant</th>
                        <th className={styles.textRight}>Precio</th>
                        <th className={styles.textRight}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items?.map((item, index) => (
                        <tr key={index}>
                            <td className={styles.productName}>
                                {item.product?.name || 'Producto'}
                            </td>
                            <td className={styles.textCenter}>{item.quantity}</td>
                            <td className={styles.textRight}>{formatCurrency(item.unitPrice)}</td>
                            <td className={styles.textRight}>{formatCurrency(item.quantity * item.unitPrice)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>

          <div className={styles.totalSection}>
             <span className={styles.totalLabel}>Total:</span>
             <span className={styles.totalValue}>{formatCurrency(order.orderTotal)}</span>
          </div>

          <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
             <Download size={18} style={{marginRight: 8}} />
             Descargar recibo en PDF
          </button>

        </div>
      </div>
    </div>
  );
}