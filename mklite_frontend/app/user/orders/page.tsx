'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Librería para decodificar el token manualmente
import { jwtDecode } from "jwt-decode";

// Librerías para PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Iconos y Componentes
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { X, Download } from 'lucide-react'; 
import UserSidebar from '../../components/UserSidebar';
import styles from './page.module.css';

// Services & Models
import { OrderService } from '../../services/order.service';
import type Order from '../../models/order.model';
import { OrderStatus } from '../../models/order.model';

// --- UTILS ---
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
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: number) => `Bs. ${Number(amount).toFixed(2)}`;

// --- COMPONENTE PRINCIPAL ---
const PAGE_LIMIT = 5;

const MisPedidos: React.FC = () => {
  // 1. ESTADO PARA EL USUARIO (Leído manualmente)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // 2. EFECTO PARA LEER EL TOKEN DEL LOCALSTORAGE
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const userId = decoded.sub || decoded.id;
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // --- CARGA DE PEDIDOS ---
  const loadOrders = useCallback(async (page: number, userId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await OrderService.getByUser(userId, page, PAGE_LIMIT);
      setOrders(data);
      setHasMore(data.length === PAGE_LIMIT);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error al cargar los pedidos:', err);
      setError('No se pudieron cargar tus pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
       loadOrders(currentPage, currentUserId);
    }
  }, [loadOrders, currentPage, currentUserId]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    if (newPage > currentPage && !hasMore) return; 
    if (currentUserId) {
      loadOrders(newPage, currentUserId);
    }
  };

  // --- MANEJO DEL DETALLE (MODAL) ---
  const handleViewDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      const fullOrder = await OrderService.getById(orderId);
      setSelectedOrder(fullOrder);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error al cargar detalle:", err);
      alert("No se pudo cargar el detalle del pedido.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // --- GENERACIÓN DE PDF ---
  const handleDownloadPDF = () => {
    if (!selectedOrder) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colores
    const redColor = "#d32f2f";
    const darkColor = "#333333";
    const greyColor = "#666666";

    // 1. LOGO CENTRADO (MERKADO en rojo, LITE en negro)
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
    
    // Obtener dirección segura
    const address = selectedOrder.user?.addresses?.[0] 
        ? `${selectedOrder.user.addresses[0].street} #${selectedOrder.user.addresses[0].streetNumber}` 
        : 'Dirección no registrada';
    const userName = selectedOrder.user?.fullName || "Cliente";

    doc.text(`Cliente: ${userName}`, leftMargin, yPos);
    doc.text(`Código de pedido: #${selectedOrder.id}`, leftMargin, yPos + 6);
    doc.text(`Fecha: ${new Date(selectedOrder.createdAt).toLocaleDateString()}`, leftMargin, yPos + 12);
    doc.text(`Dirección: ${address}`, leftMargin, yPos + 18);

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
            0: { halign: 'left' },   // Producto izquierda
            1: { halign: 'center' }, // Cantidad centro
            2: { halign: 'right' },  // Precio derecha
            3: { halign: 'right' }   // Subtotal derecha
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

    doc.text("ENVÍO", labelX, summaryY + 6);
    doc.text("Bs. 0.00", rightMargin, summaryY + 6, { align: "right" });

    doc.text("IMPUESTOS", labelX, summaryY + 12);
    doc.setTextColor(redColor);
    doc.text("Incluidos", rightMargin, summaryY + 12, { align: "right" });
    doc.setTextColor(darkColor);

    doc.line(40, summaryY + 18, 170, summaryY + 18); 

    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", labelX, summaryY + 26);
    doc.text(formatCurrency(selectedOrder.orderTotal), rightMargin, summaryY + 26, { align: "right" });

    // 8. FOOTER
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const footerY = summaryY + 40;

    doc.text(`Forma de pago: ${selectedOrder.paymentMethod || 'Efectivo'}`, labelX, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(greyColor);
    doc.text("Gracias por confiar en Merkado Lite.", pageWidth / 2, footerY + 15, { align: "center" });

    doc.save(`Recibo_MerkadoLite_${selectedOrder.id}.pdf`);
  };

  // --- RENDERIZADO ---
  if (isCheckingAuth) return <div className={styles["mis-pedidos-container"]}>Verificando sesión...</div>;
  
  if (!currentUserId) return (
    <div className={styles["layoutWrapper"]}>
        {/*<UserSidebar />*/}
        <div className={styles["mis-pedidos-container"]}>
            <div style={{textAlign: 'center', padding: '40px'}}>
                No se encontró un usuario activo. Por favor inicia sesión nuevamente.
            </div>
        </div>
    </div>
  );

  return (
    <div className={styles["layoutWrapper"]}>
      {/* <UserSidebar /> */}
      
      <div className={styles["mis-pedidos-container"]}>
        <h1>Mis Pedidos</h1>
        
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {loading && orders.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px'}}>Cargando historial...</div>
        ) : (
            <>
                <div className={styles["pedidos-table-wrapper"]}>
                <table className={styles["pedidos-table"]}>
                    <thead>
                    <tr>
                        <th>Código Pedido</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Detalle</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                        <tr key={order.id}>
                            <td data-label="Código Pedido">#{order.id}</td>
                            <td data-label="Estado">
                            <span className={`${styles["estado-tag"]} ${getStatusClass(order.status)}`}>
                                {mapStatusToText(order.status)}
                            </span>
                            </td>
                            <td data-label="Fecha">{formatDate(order.createdAt)}</td>
                            <td data-label="Total">{formatCurrency(order.orderTotal)}</td>
                            <td data-label="Detalle">
                            <button 
                                className={styles["btn-detalle"]}
                                onClick={() => handleViewDetails(order.id)}
                                disabled={loadingDetails}
                            >
                                Ver
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            No tienes pedidos registrados aún.
                        </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>

                {/* Paginación */}
                {orders.length > 0 && (
                    <div className={styles["pagination"]}>
                    <button
                        className={`${styles["page-arrow"]} ${currentPage === 1 ? styles["disabled"] : ''}`}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1 || loading}
                    >
                        <IoIosArrowBack />
                    </button>

                    <span className={styles["page-number"] + " " + styles["active"]}>
                        {currentPage}
                    </span>
                    
                    <button
                        className={`${styles["page-arrow"]} ${!hasMore ? styles["disabled"] : ''}`}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!hasMore || loading}
                    >
                        <IoIosArrowForward />
                    </button>
                    </div>
                )}
            </>
        )}
      </div>

      {/* --- MODAL DETALLE PEDIDO --- */}
      {isModalOpen && selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              <X size={24} />
            </button>

            <div className={styles.modalHeader}>
              <div>
                <h2>Detalle del pedido</h2>
                <div className={styles.orderInfo}>
                   <p><strong>Codigo pedido:</strong> #{selectedOrder.id}</p>
                   <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                   <p><strong>Enviado a:</strong> {selectedOrder.user?.addresses?.[0] 
                      ? `${selectedOrder.user.addresses[0].street} #${selectedOrder.user.addresses[0].streetNumber}` 
                      : 'Dirección de registro'}
                   </p>
                </div>
              </div>
              <span className={`${styles["estado-tag"]} ${getStatusClass(selectedOrder.status)}`}>
                {mapStatusToText(selectedOrder.status)}
              </span>
            </div>

            <div className={styles.productsTableContainer}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className={styles.textCenter}>Cant</th>
                    <th className={styles.textRight}>Precio</th>
                    <th className={styles.textRight}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || 'Producto'}</td>
                      <td className={styles.textCenter}>{item.quantity}</td>
                      <td className={styles.textRight}>{formatCurrency(item.unitPrice)}</td>
                      <td className={styles.textRight}>
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className={styles.modalTotal}>
               Total: {formatCurrency(selectedOrder.orderTotal)}
            </div>
            
            {/* Botón de Descarga PDF */}
            <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
               <Download size={18} style={{marginRight: 8}} />
               Descargar recibo en PDF
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;