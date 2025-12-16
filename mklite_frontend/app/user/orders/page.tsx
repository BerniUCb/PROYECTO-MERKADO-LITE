'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { X, Download } from 'lucide-react';

import styles from './page.module.css';

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
  return d.toLocaleDateString();
};

const formatCurrency = (amount: number) =>
  `Bs. ${Number(amount).toFixed(2)}`;

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

  // ===== CARGAR PEDIDOS (FIX REAL) =====
  const loadOrders = useCallback(async (page: number, userId: number) => {
    setLoading(true);
    setError(null);

    try {
      const res = await OrderService.getByUser(userId, page, PAGE_LIMIT);

      setOrders(res.data);                 // 🔥 CLAVE
      setHasMore(page < res.totalPages);   // 🔥 CLAVE
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

  // ===== MODAL =====
  const handleViewDetails = async (orderId: number) => {
    setLoadingDetails(true);
    try {
      const order = await OrderService.getById(orderId);
      setSelectedOrder(order);
      setIsModalOpen(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // ===== RENDER =====
  if (isCheckingAuth) return <div>Cargando sesión...</div>;
  if (!currentUserId) return <div>No hay sesión activa.</div>;

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles["mis-pedidos-container"]}>
        <h1>Mis Pedidos</h1>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <table className={styles["pedidos-table"]}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  No tienes pedidos registrados aún.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <span className={`${styles["estado-tag"]} ${getStatusClass(order.status)}`}>
                      {mapStatusToText(order.status)}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatCurrency(order.orderTotal)}</td>
                  <td>
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
            )}
          </tbody>
        </table>

        {/* PAGINACIÓN */}
        {orders.length > 0 && (
          <div className={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              <IoIosArrowBack />
            </button>
            <span>{currentPage}</span>
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
           <button className={styles.closeBtn} onClick={closeModal} > <X /> </button>
            <h2>Pedido #{selectedOrder.id}</h2>
            <p>Total: {formatCurrency(selectedOrder.orderTotal)}</p>

            <button onClick={() => alert("PDF OK")}>
              <Download /> Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
