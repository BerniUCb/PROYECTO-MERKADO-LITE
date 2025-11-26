'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Librería para decodificar el token manualmente
import { jwtDecode } from "jwt-decode";

// Iconos y Componentes
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { X } from 'lucide-react'; 
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
  const [loading, setLoading] = useState<boolean>(false); // Inicialmente false hasta tener usuario
  const [error, setError] = useState<string | null>(null);

  // Estados para Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  // 2. EFECTO PARA LEER EL TOKEN DEL LOCALSTORAGE
  useEffect(() => {
    const token = localStorage.getItem('token'); // Asegúrate que la clave sea 'token' o la que uses
    if (token) {
      try {
        // Decodificamos el token
        const decoded: any = jwtDecode(token);
        // Normalmente el ID viene en 'sub' o 'id'
        const userId = decoded.sub || decoded.id;
        setCurrentUserId(userId);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        // Si el token es inválido, podrías redirigir al login aquí
      }
    }
    setIsCheckingAuth(false);
  }, []);

  // --- CARGA DE PEDIDOS ---
  const loadOrders = useCallback(async (page: number, userId: number) => {
    setLoading(true);
    setError(null);
    try {
      // Usamos el endpoint específico para el usuario
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

  // --- EFECTO PRINCIPAL: Cargar datos cuando ya tengamos el ID ---
  useEffect(() => {
    if (currentUserId) {
       loadOrders(currentPage, currentUserId);
    }
  }, [loadOrders, currentPage, currentUserId]);

  // --- MANEJO DE PAGINACIÓN ---
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

  // --- RENDERIZADO CONDICIONAL ---
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
     {/* <UserSidebar />*/}
      
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

      {/* --- MODAL DETALLE --- */}
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
            
            <div style={{textAlign: 'right', marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: '#111'}}>
               Total: {formatCurrency(selectedOrder.orderTotal)}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MisPedidos;