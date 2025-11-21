'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type Pedido from '../models/order.model';
import { OrderService } from '../services/order.service';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { OrderStatus } from '../models/order.model';
import styles from './page.module.css'; 

// --- TIPOS DE DATOS Y UTILS ---

/**
 * Función para simular la obtención de pedidos por ID de usuario.
 * (La implementación es la misma que antes)
 */
const fetchPedidosByUser = async (
  userId: number,
  page: number,
  limit: number
): Promise<{ data: Pedido[]; totalPages: number }> => {
  console.log(`Simulando obtener pedidos para el usuario ${userId}, página ${page}, límite ${limit}`);

  // Datos mockeados basados en la imagen y el modelo
  const mockPedidos: Pedido[] = [
    { id: 101, createdAt: '2025-09-25T10:00:00Z', status: 'delivered', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 102, createdAt: '2025-09-25T11:30:00Z', status: 'cancelled', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 103, createdAt: '2025-09-25T12:00:00Z', status: 'pending', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 104, createdAt: '2025-09-25T13:45:00Z', status: 'cancelled', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 105, createdAt: '2025-09-25T15:00:00Z', status: 'delivered', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 106, createdAt: '2025-09-26T09:00:00Z', status: 'processing', orderTotal: 25.5, paymentMethod: 'QR', user: {} as any, items: [] },
    { id: 107, createdAt: '2025-09-26T14:00:00Z', status: 'shipped', orderTotal: 5.0, paymentMethod: 'Cash', user: {} as any, items: [] },
    { id: 108, createdAt: '2025-09-27T10:00:00Z', status: 'delivered', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 109, createdAt: '2025-09-27T11:30:00Z', status: 'pending', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 110, createdAt: '2025-09-27T12:00:00Z', status: 'delivered', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 111, createdAt: '2025-09-28T13:45:00Z', status: 'cancelled', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
    { id: 112, createdAt: '2025-09-28T15:00:00Z', status: 'delivered', orderTotal: 10.0, paymentMethod: 'Card', user: {} as any, items: [] },
  ];

  // Simular paginación en los datos mockeados
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = mockPedidos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(mockPedidos.length / limit);

  return { data, totalPages };
};

/**
 * Determina la clase CSS para el estado del pedido, usando el objeto styles.
 * @param status Estado del pedido
 * @returns La clase CSS del módulo styles
 */
const getStatusClass = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered':
      return styles["estado-entregado"]; // 🔑 Usando styles["nombre-de-clase"]
    case 'cancelled':
      return styles["estado-cancelado"]; // 🔑 Usando styles["nombre-de-clase"]
    case 'pending':
    case 'processing':
      return styles["estado-pendiente"]; // 🔑 Usando styles["nombre-de-clase"]
    case 'shipped':
      return styles["estado-enviado"]; // 🔑 Usando styles["nombre-de-clase"]
    default:
      return styles["estado-default"]; // 🔑 Usando styles["nombre-de-clase"]
  }
};

/**
 * Mapea el estado del modelo a un texto legible en español para la UI.
 */
const mapStatusToText = (status: OrderStatus): string => {
  switch (status) {
    case 'delivered': return 'Entregado';
    case 'cancelled': return 'Cancelado';
    case 'pending': return 'Pendiente';
    case 'processing': return 'Procesando';
    case 'shipped': return 'Enviado';
    case 'returned': return 'Devuelto';
    default: return 'Desconocido';
  }
};

/**
 * Formatea una fecha ISO 8601 a 'DD/MM/YY'.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
};


// --- COMPONENTE PRINCIPAL ---

const PAGE_LIMIT = 5; 

const MisPedidos: React.FC = () => {
  const MOCK_USER_ID = 1; 

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(5); 
  const [totalPages, setTotalPages] = useState<number>(8); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPedidos = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPedidosByUser(MOCK_USER_ID, page, PAGE_LIMIT);
      setPedidos(result.data);
      setTotalPages(result.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error al cargar los pedidos:', err);
      setError('No se pudieron cargar los pedidos. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPedidos(currentPage);
  }, [loadPedidos, currentPage]);


  const paginationNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadPedidos(page);
    }
  };

  if (loading && pedidos.length === 0) return <div className={styles["mis-pedidos-container"]}>Cargando pedidos...</div>;
  if (error) return <div className={styles["mis-pedidos-container"] + " error"}>{error}</div>; // Nota: Concatenación para clases genéricas

  return (
    <div className={styles["mis-pedidos-container"]}>
      <h1>Mis Pedidos</h1>

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
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td data-label="Código Pedido">#{pedido.id}</td>
                <td data-label="Estado">
                  {/* Uso de template strings para combinar clases dinámicas */}
                  <span className={`${styles["estado-tag"]} ${getStatusClass(pedido.status)}`}>
                    {mapStatusToText(pedido.status)}
                  </span>
                </td>
                <td data-label="Fecha">{formatDate(pedido.createdAt)}</td>
                <td data-label="Total">Bs. {pedido.orderTotal.toFixed(2)}</td>
                <td data-label="Detalle">
                  <span className={styles["detalle-placeholder"]}>-</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className={styles["pagination"]}>
        {/* Flecha izquierda */}
        <button
          className={`${styles["page-arrow"]} ${currentPage === 1 ? styles["disabled"] : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        {/* Números de página */}
        {paginationNumbers.map((page) => (
          <button
            key={page}
            className={`${styles["page-number"]} ${page === currentPage ? styles["active"] : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        
        {/* Flecha derecha */}
        <button
          className={`${styles["page-arrow"]} ${currentPage === totalPages ? styles["disabled"] : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default MisPedidos;