'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { X, Download, FileText } from 'lucide-react';

import styles from './page.module.css';
import UserSidebar from '../../components/UserSidebar';

import { OrderService } from '../../services/order.service';
import type Order from '../../models/order.model';
import { OrderStatus } from '../../models/order.model';

// ================= UTILIDADES =================
const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return styles["estado-entregado"];
    case 'cancelled': return styles["estado-cancelado"];
    case 'pending': return styles["estado-pendiente"];
    case 'processing': return styles["estado-processing"];
    case 'shipped': return styles["estado-enviado"];
    default: return styles["estado-default"];
  }
};

const mapStatusToText = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return 'Entregado';
    case 'cancelled': return 'Cancelado';
    case 'pending': return 'Pendiente';
    case 'processing': return 'Procesando';
    case 'shipped': return 'Enviado';
    case 'returned': return 'Devuelto';
    default: return status;
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number) => `Bs. ${Number(amount).toFixed(2)}`;

// ================= COMPONENTE =================
const PAGE_LIMIT = 5;

const MisPedidos: React.FC = () => {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ===== AUTH =====
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setCurrentUserId(decoded.sub || decoded.id);
      } catch (err) {
        console.error(err);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // ===== CARGAR PEDIDOS =====
  const loadOrders = useCallback(async (page: number, userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await OrderService.getByUser(userId, page, PAGE_LIMIT);
      const dataList = Array.isArray(res) ? res : (res as any).data || []; 
      
      setOrders(dataList);
      setHasMore(dataList.length === PAGE_LIMIT); 
      setCurrentPage(page);

    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar tus pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadOrders(1, currentUserId);
    }
  }, [currentUserId, loadOrders]);

  const handlePageChange = (page: number) => {
    if (!currentUserId || page < 1) return;
    loadOrders(page, currentUserId);
  };

  // ===== MODAL & PDF =====
  const handleViewDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      const order = await OrderService.getById(orderId);
      setSelectedOrder(order);
      setIsModalOpen(true);
    } catch(e) {
      alert("Error cargando detalles");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleDownloadPDF = () => {
    if (!selectedOrder) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colores
    const redColor = "#d32f2f";
    const darkColor = "#333333";
    const greyColor = "#666666";

    // 1. LOGO
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    const text1 = "MERKADO";
    const text2 = "LITE";
    const w1 = doc.getTextWidth(text1);
    const w2 = doc.getTextWidth(text2);
    const startX = (pageWidth - (w1 + w2)) / 2;

    doc.setTextColor(redColor);
    doc.text(text1, startX, 20);
    doc.setTextColor(darkColor);
    doc.text(text2, startX + w1, 20);

    // 2. INFO
    doc.setFontSize(10);
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
    
    const userName = selectedOrder.user?.fullName || "Cliente";
    const address = selectedOrder.user?.addresses?.[0] 
        ? `${selectedOrder.user.addresses[0].street} #${selectedOrder.user.addresses[0].streetNumber}` 
        : 'Dirección no registrada';

    doc.text(`Cliente: ${userName}`, leftMargin, yPos);
    doc.text(`Código de pedido: #${selectedOrder.id}`, leftMargin, yPos + 6);
    doc.text(`Fecha: ${formatDate(selectedOrder.createdAt)}`, leftMargin, yPos + 12);
    doc.text(`Dirección de envío: ${address}`, leftMargin, yPos + 18);

    doc.line(40, yPos + 24, 170, yPos + 24); 

    // 5. TOTAL DESTACADO
    yPos += 35;
    doc.setFontSize(10);
    doc.text("TOTAL PAGADO", pageWidth / 2, yPos, { align: "center" });
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(formatCurrency(selectedOrder.orderTotal), pageWidth / 2, yPos + 7, { align: "center" });

    // 6. TABLA DE PRODUCTOS
    const tableBody = selectedOrder.items?.map(item => [
        item.product?.name || "Producto",
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        formatCurrency(item.quantity * item.unitPrice)
    ]) || [];

    (autoTable as any)(doc, {
        startY: yPos + 15,
        margin: { left: 40, right: 40 },
        head: [['Producto', 'Cant', 'Precio', 'Subtotal']],
        body: tableBody,
        theme: 'plain', 
        styles: { fontSize: 10, cellPadding: 2, textColor: darkColor },
        headStyles: { fillColor: [255, 255, 255], textColor: darkColor, fontStyle: 'bold', halign: 'right' },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center' },
            2: { halign: 'right' },
            3: { halign: 'right' }
        },
        didParseCell: (data: any) => {
            if (data.section === 'head' && data.column.index === 0) data.cell.styles.halign = 'left';
            if (data.section === 'head' && data.column.index === 1) data.cell.styles.halign = 'center';
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
    doc.text(formatCurrency(selectedOrder.orderTotal), rightMargin, summaryY, { align: "right" });

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
    doc.text(formatCurrency(selectedOrder.orderTotal), rightMargin, summaryY + 32, { align: "right" });

    // 8. FOOTER
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const footerY = summaryY + 45;

    doc.text(`Forma de pago: ${selectedOrder.paymentMethod || 'Efectivo'}`, labelX, footerY);
    doc.text(`Autorización: ${Math.floor(100000 + Math.random() * 900000)}`, labelX, footerY + 5);

    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235); 
    doc.text("Este documento es un comprobante de compra electrónico.", pageWidth / 2, footerY + 15, { align: "center" });
    
    doc.setTextColor(greyColor);
    doc.text("Gracias por confiar en Merkado Lite.", pageWidth / 2, footerY + 20, { align: "center" });
    doc.text("www.merkadolite.com", pageWidth / 2, footerY + 24, { align: "center" });

    doc.save(`Recibo_MerkadoLite_${selectedOrder.id}.pdf`);
  };

  // ===== RENDER =====
  if (isCheckingAuth) return <div className={styles.loadingState}>Cargando sesión...</div>;
  if (!currentUserId) return <div className={styles.loadingState}>Debes iniciar sesión.</div>;

  return (
    <div className={styles.layoutWrapper}>
      {/*<UserSidebar />*/}
      <div className={styles.misPedidosContainer}>
        <h1 className={styles.pageTitle}>Historial de Pedidos</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.tableCard}>
          <table className={styles.pedidosTable}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Total</th>
                <th className={styles.textCenter}>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    No tienes pedidos registrados aún.
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id}>
                    <td className={styles.codeCell}>#{order.id}</td>
                    <td>
                      <span className={`${styles.statusTag} ${getStatusClass(order.status)}`}>
                        {mapStatusToText(order.status)}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className={styles.amountCell}>{formatCurrency(order.orderTotal)}</td>
                    
                    {/* --- CONDICIONAL: SOLO SI ES DELIVERED SE MUESTRA EL BOTÓN --- */}
                    <td className={styles.textCenter}>
                      {order.status === 'delivered' ? (
                          <button
                            className={styles.viewBtn}
                            onClick={() => handleViewDetails(order.id)}
                            disabled={loadingDetails}
                          >
                            <FileText size={16} /> Ver Recibo
                          </button>
                      ) : (
                          <span style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
                              --
                          </span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        {orders.length > 0 && (
          <div className={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <IoIosArrowBack />
            </button>
            <span className={styles.pageNumber}>{currentPage}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={!hasMore}>
              <IoIosArrowForward />
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}><X size={24}/></button>
            
            <div className={styles.modalHeader}>
              <h2>Pedido #{selectedOrder.id}</h2>
              <span className={`${styles.statusTag} ${getStatusClass(selectedOrder.status)}`}>
                  {mapStatusToText(selectedOrder.status)}
              </span>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.infoRow}>
                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Método de Pago:</strong> {selectedOrder.paymentMethod || 'Efectivo'}</p>
                </div>
                
                <div className={styles.productsList}>
                    <table className={styles.miniTable}>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th className={styles.textCenter}>Cant.</th>
                                <th className={styles.textRight}>Precio</th>
                                <th className={styles.textRight}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.items?.map((item, i) => (
                                <tr key={i}>
                                    <td>{item.product?.name || 'Producto'}</td>
                                    <td className={styles.textCenter}>{item.quantity}</td>
                                    <td className={styles.textRight}>{formatCurrency(item.unitPrice)}</td>
                                    <td className={styles.textRight}>{formatCurrency(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.totalRow}>
                    <span>Total Pagado:</span>
                    <span className={styles.totalAmount}>{formatCurrency(selectedOrder.orderTotal)}</span>
                </div>
            </div>

            <div className={styles.modalFooter}>
                <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
                    <Download size={18} style={{marginRight: 8}} />
                    Descargar Recibo en PDF
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;