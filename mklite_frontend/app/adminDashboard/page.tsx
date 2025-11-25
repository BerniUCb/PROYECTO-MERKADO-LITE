'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import { FaBoxOpen, FaClipboardList, FaExclamationCircle } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'; 
import AdminSidebar from '../components/AdminSidebar';
// Services & Models
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import type Order from '../models/order.model';
import type ProductModel from '../models/productCard.model';


// --- COMPONENTE DE GRÁFICA FUNCIONAL (Interno) ---

interface FunctionalAreaChartProps {
  data: number[];
  labels: string[];
}

const FunctionalAreaChart: React.FC<FunctionalAreaChartProps> = ({ data, labels }) => {
  const width = 500;
  const height = 150;
  const padding = 10;
  
  // Calcular máximo para escalar
  const maxVal = Math.max(...data, 1);
  
  // Calcular coordenadas
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (val / maxVal) * (height - padding * 2) - padding; 
    return { x, y };
  });

  // Generar path de la línea
  const pathD = points.length > 0 
    ? `M ${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')
    : `M 0,${height} L ${width},${height}`;

  // Generar path del área (relleno)
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className={styles.chartWrapper}>
      <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradientRed" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ff4d4f" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ff4d4f" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        <line x1="0" y1={height} x2={width} y2={height} stroke="#eee" strokeWidth="1" />
        <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#eee" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="0" y1={0} x2={width} y2={0} stroke="#eee" strokeWidth="1" />

        <path d={areaD} fill="url(#gradientRed)" />
        <path d={pathD} fill="none" stroke="#ff4d4f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        
        {points.map((p, i) => (
          <g key={i} className={styles.chartPointGroup}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#ff4d4f" strokeWidth="2" />
            <title>{`${labels[i]}: ${data[i]?.toLocaleString()}`}</title>
          </g>
        ))}
      </svg>
      
      <div className={styles.chartLabels}>
        {labels.map((lbl, i) => (
          <span key={i}>{lbl}</span>
        ))}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

const AdminDashboard: React.FC = () => {
  // --- STATE ---
  const [totalSales, setTotalSales] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [weeklySales, setWeeklySales] = useState<number>(0);
  const [latestOrders, setLatestOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<ProductModel[]>([]);
  const [chartData, setChartData] = useState<number[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [registeredClientsCount, setRegisteredClientsCount] = useState<number>(0);
  const [productsCount, setProductsCount] = useState<number>(0);
  const [inStockCount, setInStockCount] = useState<number>(0);
  const [outOfStockCount, setOutOfStockCount] = useState<number>(0);

  const chartLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Simulamos la llamada a datos de la gráfica (ya que el servicio original no lo tiene aún)
        const mockChartDataPromise = Promise.resolve([12000, 19500, 14000, 28000, 22500, 35000, 31000]);

        // Ejecutamos peticiones en paralelo
        const [
          salesData,
          pendingData,
          weeklyData,
          ordersData,
          topProductsData,
          usersCountData,
          productsCountData,
          inStockData,
          outOfStockData,
          chartValues
        ] = await Promise.all([
          OrderService.getTotalSales(),
          OrderService.getPendingOrderCount(),
          OrderService.getWeeklySales(),
          OrderService.getLatestOrders(), // Asegúrate de tener este método en tu OrderService o cambiarlo por getAll({limit: 5})
          ProductService.getTopSelling(), 
          UserService.getRegisteredClientsCount(),
          ProductService.getTotalProductsCount(),
          ProductService.getInStockCount(),
          ProductService.getOutOfStockCount(),
          OrderService.getLast7DaysSales(), // ← Nuevo servicio para historial de ventas
        ]);

        // Asignación segura de datos
        setTotalSales(Number(salesData) || 0); 
        setPendingCount(Number(pendingData) || 0);
        setWeeklySales(Number(weeklyData) || 0); 
        setRegisteredClientsCount(Number(usersCountData) || 0);
        setProductsCount(Number(productsCountData) || 0);
        setInStockCount(Number(inStockData) || 0);
        setOutOfStockCount(Number(outOfStockData) || 0);
        
        setLatestOrders(Array.isArray(ordersData) ? ordersData : []);
        setTopProducts(Array.isArray(topProductsData) ? topProductsData : []);
        setChartData(chartValues);

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- FORMATTERS ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    if (!status) return styles.statusGray;
    switch(status.toLowerCase()) {
      case 'completed':
      case 'delivered': return styles.statusGreen;
      case 'pending':
      case 'processing': return styles.statusYellow;
      case 'cancelled': return styles.statusRed;
      default: return styles.statusGray;
    }
  };

  if (loading) return <div className={styles.loadingScreen}>Cargando Panel de Control...</div>;

  return (
    <div className={styles.layout}>

      <AdminSidebar />
      <div className={styles.dashboardContainer}>
       {/* Header*/}
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>Bienvenido Admin</h1>
      </header> 
      

      {/* Stats Cards Row */}
      <div className={styles.statsGrid}>
        {/* Card 1: Ventas Totales */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Ventas Totales</span>
            <IoIosArrowDown className={styles.iconMore} />
          </div>
          <span className={styles.cardSubtext}>Últimos 7 días</span>
          <h2 className={styles.cardValue}>{formatCurrency(totalSales)}</h2>
          <div className={styles.cardFooterLine}></div>
        </div>

        {/* Card 2: Pedidos Totales */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Pedidos Totales</span>
            <IoIosArrowDown className={styles.iconMore} />
          </div>
          <span className={styles.cardSubtext}>Últimos 7 días</span>
          <h2 className={styles.cardValue}>
             {weeklySales > 1000 ? (weeklySales / 1000).toFixed(1) + 'K' : weeklySales}
          </h2>
          <div className={styles.cardFooterLine}></div>
        </div>

        {/* Card 3: Pendientes y Cancelados */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <span>Pendientes y Cancelados</span>
            <IoIosArrowDown className={styles.iconMore} />
          </div>
          <span className={styles.cardSubtext}>Últimos 7 días</span>
          <div className={styles.splitStat}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Pendientes</span>
              <span className={styles.statNumber}>{pendingCount}</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statLabel} ${styles.redText}`}>Cancelados</span>
              <span className={`${styles.statNumber} ${styles.redText}`}>--</span> 
            </div>
          </div>
          <div className={styles.cardFooterLine}></div>
        </div>
      </div>

      {/* Chart Section */}
      <section className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h3>Reportes de esta semana</h3>
          <div className={styles.toggleButtons}>
            <button className={`${styles.toggleBtn} ${styles.active}`}>Esta semana</button>
            <button className={styles.toggleBtn}>Última semana</button>
          </div>
        </div>
        
        <div className={styles.chartSummary}>
          <div className={styles.summaryItem}>
            <h4>{registeredClientsCount}</h4>
            <span>Clientes</span>
            <div className={`${styles.indicatorBar} ${styles.redBar}`}></div>
          </div>
          <div className={styles.summaryItem}>
            <h4>{productsCount}</h4>
            <span>Total de Productos</span>
          </div>
          <div className={styles.summaryItem}>
            <h4>{inStockCount}</h4>
            <span>Productos en Stock</span>
          </div>
           <div className={styles.summaryItem}>
            <h4>{outOfStockCount}</h4>
            <span>Fuera de Stock</span>
          </div>
        </div>

        <FunctionalAreaChart data={chartData} labels={chartLabels} />
      </section>

      {/* Recent Orders Table */}
      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Pedidos Recientes</h3>
          
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>No</th>
                <th>Id Cliente</th>
                <th>Fecha Orden</th>
                <th>Estado</th>
                <th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.length > 0 ? latestOrders.map((order, index) => (
                <tr key={order.id || index}>
                  <td>{index + 1}.</td>
                  <td className={styles.boldText}>#{order.user?.id || 'N/A'}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    <span className={`${styles.statusDot} ${getStatusColor(order.status)}`}></span>
                    {order.status}
                  </td>
                  <td className={styles.boldText}>{formatCurrency(Number(order.orderTotal))}</td>
                  <td>
                    <button className={styles.detailsBtn}>Detalles</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className={styles.emptyState}>No hay pedidos recientes</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Selling Products Table */}
      <section className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <h3>Productos mejor vendidos</h3>
          
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead className={styles.redThead}>
              <tr>
                <th>PRODUCTO</th>
                <th>TOTAL VENDIDOS</th>
                <th>ESTADO</th>
                <th>PRECIO</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? topProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.imgPlaceholder}>
                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} /> : <FaBoxOpen />}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className={styles.centerText}>
                    {product.physicalStock > 0 ? 'High Demand' : 'N/A'} 
                  </td>
                  <td>
                    {product.physicalStock > 0 ? (
                      <span className={styles.stockGreen}>● Stock</span>
                    ) : (
                      <span className={styles.stockRed}>● Fuera de Stock</span>
                    )}
                  </td>
                  <td className={styles.boldText}>{formatCurrency(Number(product.salePrice))}</td>
                  <td>
                    <button className={styles.detailsBtn}>Detalles</button>
                  </td>
                </tr>
              )) : (
                 <tr><td colSpan={5} className={styles.emptyState}>No hay datos de productos top</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
    </div>
  );
};

export default AdminDashboard;