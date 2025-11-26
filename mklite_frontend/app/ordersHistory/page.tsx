'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type Order from '../models/order.model';
import { OrderStatus } from '../models/order.model';
import { OrderService } from '../services/order.service'; 
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import UserSidebar from '../components/UserSidebar';
import styles from './page.module.css';
import { X } from 'lucide-react'; // Icono de cerrar para el modal

// --- UTILS ---

/**
 * Determina la clase CSS para el estado del pedido.
 */
const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return styles["estado-entregado"];
    case 'cancelled': return styles["estado-cancelado"];
    case 'pending': return styles["estado-pendiente"];
    case 'processing': return styles["estado-pendiente"];
    case 'shipped': return styles["estado-enviado"];
    default: return styles["estado-default"];
  }
};

/**
 * Mapea el estado del modelo a texto legible.
 */
const mapStatusToText = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return 'Entregado';
    case 'cancelled': return 'Cancelado';
    case 'pending': return 'Pendiente';
    case 'processing': return 'Procesando';
    case 'shipped': return 'Enviado';
    case 'returned': return 'Devuelto';
    case 'cancelled': return 'Cancelado';
    default: return 'Desconocido';
  }
};

/**
 * Formatea fecha ISO.
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};
const formatCurrency = (amount: number) => {
  return `Bs. ${Number(amount).toFixed(2)}`;
};

// --- COMPONENTE PRINCIPAL ---

const PAGE_LIMIT = 5;

const MisPedidos: React.FC = () => {
  // NOTA: El userId generalmente se maneja via Token en el interceptor de Axios,
  // por lo que el servicio getAll() debería traer las órdenes del usuario logueado
  // si el backend está configurado así.

  const [orders, setOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  // Como el backend no devuelve "totalCount", manejamos la paginación por detección de longitud
  const [hasMore, setHasMore] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // --- ESTADOS PARA EL MODAL ---
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);


  const loadOrders = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      // Solicitamos orden descendente por fecha de creación para ver lo más reciente primero
      const data = await OrderService.getAll(page, PAGE_LIMIT, 'createdAt', 'desc');
      
      setOrders(data);

      // Lógica simple de paginación: Si recibimos la cantidad completa del limite, 
      // asumimos que podría haber más páginas.
      if (data.length === PAGE_LIMIT) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
      
      setCurrentPage(page);
    } catch (err) {
      console.error('Error al cargar los pedidos:', err);
      setError('No se pudieron cargar los pedidos. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders(currentPage);
  }, [loadOrders, currentPage]);

  // --- MANEJO DEL DETALLE (MODAL) ---
  const handleViewDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      // Hacemos una petición específica por ID para asegurar que tenemos los items completos
      // (A veces el getAll no trae las relaciones profundas como productos)
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

  const handlePageChange = (page: number) => {
    if (page < 1) return;
    // Evitar ir a siguiente si no hay más datos, a menos que estemos cargando
    if (page > currentPage && !hasMore) return; 
    
    loadOrders(page);
  };

  if (loading && orders.length === 0) return <div className={styles["mis-pedidos-container"]}>Cargando pedidos...</div>;
   if (error) return <div className={`${styles["mis-pedidos-container"]} error`}>{error}</div>;

  return (
    <div className={styles["layoutWrapper"]}>
      <UserSidebar />
      
      <div className={styles["mis-pedidos-container"]}>
        <h1>Mis Pedidos</h1>
        
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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
                    <td data-label="Total">Bs. {Number(order.orderTotal).toFixed(2)}</td>
                    <td data-label="Detalle">
                      <button 
                        className={styles["btn-detalle"]}
                        onClick={() => handleViewDetails(order.id)}
                        disabled={loadingDetails}
                      >
                        {loadingDetails ? '...' : 'Ver'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                    No tienes pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación Simplificada (Prev / Next) debido a falta de TotalCount en API */}
        <div className={styles["pagination"]}>
          {/* Flecha izquierda */}
          <button
            className={`${styles["page-arrow"]} ${currentPage === 1 ? styles["disabled"] : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <IoIosArrowBack />
          </button>

          {/* Indicador de página actual */}
          <span className={styles["page-number"] + " " + styles["active"]}>
            {currentPage}
          </span>
          
          {/* Flecha derecha */}
          <button
            className={`${styles["page-arrow"]} ${!hasMore ? styles["disabled"] : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasMore || loading}
          >
            <IoIosArrowForward />
          </button>
        </div>
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
                   {/* Mostramos la dirección si existe en el usuario o en el pedido */}
                   {/* Nota: Ajusta la lógica de dirección según tu modelo exacto */}
                   <p><strong>Enviado a:</strong> {selectedOrder.user?.addresses?.[0] 
                      ? `${selectedOrder.user.addresses[0].street} #${selectedOrder.user.addresses[0].streetNumber}` 
                      : 'Dirección registrada'}
                   </p>
                </div>
              </div>
              {/* Badge de estado en el modal */}
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
                      <td>
                         {/* Ajustar si item.product es objeto o si item tiene nombre directo */}
                         {item.product?.name || 'Producto desconocido'}
                      </td>
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
            
            {/* Total al final del modal */}
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