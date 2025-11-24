'use client';

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
// Iconos
import { User, Phone, MapPin, Copy, ChevronLeft, ChevronRight } from 'lucide-react';

// Importamos el Sidebar (Descomenta cuando lo tengas listo)
import AdminSidebar from '../../components/AdminSidebar';

// Services & Models
import { UserService } from '../../services/user.service';
import type UserModel from '../../models/user.model';
import type AddressModel from '../../models/address.model';

// --- UTILS ---
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', { 
    year: 'numeric', month: '2-digit', day: '2-digit' 
  });
};

const ClientsPage: React.FC = () => {
  // --- ESTADOS ---
  const [clients, setClients] = useState<UserModel[]>([]);
  const [selectedClient, setSelectedClient] = useState<UserModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginación
  const [page, setPage] = useState<number>(1);
  const limit = 10; 

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Llamada al endpoint real: GET /user?page=1&limit=10&sort=id&order=asc
        // Asegúrate de que tu backend soporte estos parámetros de paginación
        const data = await UserService.getAll(page, limit, 'id', 'asc');
        
        // Filtramos usuarios con rol 'Client' si el backend devuelve todos los roles
        const clientList = Array.isArray(data) 
          ? data.filter(u => u.role === 'Client' || !u.role) // Ajusta según tu lógica de roles
          : [];
        
        setClients(clientList);
        
        // Seleccionar el primero por defecto si no hay selección previa
        if (clientList.length > 0 && !selectedClient) {
          setSelectedClient(clientList[0]);
        } else if (clientList.length === 0) {
          setSelectedClient(null);
        }

      } catch (err) {
        console.error("Error al cargar clientes:", err);
        setError("No se pudo cargar la lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page]); // Se recarga cuando cambia la página

  // --- HANDLERS ---
  const handleRowClick = (client: UserModel) => {
    setSelectedClient(client);
  };

  const handleCopyEmail = () => {
    if (selectedClient?.email) {
      navigator.clipboard.writeText(selectedClient.email)
        .then(() => alert("Email copiado al portapapeles"))
        .catch(() => console.error("Error al copiar"));
    }
  };

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePrevPage = () => setPage(prev => Math.max(1, prev - 1));

  // --- CÁLCULO DE ESTADÍSTICAS (Basado en datos reales) ---
  const calculateStats = (user: UserModel | null) => {
    // Si el backend no popula 'orders', estos valores serán 0
    const orders = user?.orders || [];
    
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    
    let lastOrderDate = 'N/A';
    if (orders.length > 0) {
        // Ordenamos las órdenes para encontrar la más reciente
        // Nota: Esto asume que 'orders' viene populado en el objeto user
        const sorted = [...orders].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        lastOrderDate = formatDate(sorted[0].createdAt);
    }

    return { total, delivered, cancelled, lastOrderDate };
  };

  const stats = calculateStats(selectedClient);

  // Obtener dirección principal
  // Nota: Se asume que 'addresses' viene populado en el objeto user
  const mainAddress: AddressModel | undefined = selectedClient?.addresses?.find(a => a.isDefault) || selectedClient?.addresses?.[0];

  if (loading && clients.length === 0) return <div className={styles.loadingScreen}>Cargando Clientes...</div>;
  if (error) return <div className={styles.loadingScreen}>{error}</div>;

  return (
    <div className={styles.adminLayout}>
      
     {/* <AdminSidebar /> */}

      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1 className={styles.welcomeTitle}>Bienvenido Admin</h1>
        </header>

        <div className={styles.contentGrid}>
          
          {/* --- COLUMNA IZQUIERDA: TABLA --- */}
          <section className={styles.tableSection}>
            <h2 className={styles.sectionTitle}>Detalles del Cliente</h2>
            
            <div className={styles.tableWrapper}>
              <table className={styles.dataTable}>
                <thead>
                  <tr>
                    <th>Código Cliente</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Nro de Pedidos</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr 
                      key={client.id} 
                      onClick={() => handleRowClick(client)}
                      className={selectedClient?.id === client.id ? styles.rowActive : ''}
                    >
                      <td className={styles.boldText}>#CUST{client.id.toString().padStart(3, '0')}</td>
                      <td>{client.fullName}</td>
                      <td>
                        {/* Mostramos '-' si no existe el campo phone en el modelo o está vacío */}
                        {(client as any).phone || '-'} 
                      </td>
                      <td className={styles.centerText}>
                        {client.orders?.length || 0}
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 && (
                    <tr><td colSpan={4} className={styles.emptyState}>No se encontraron clientes</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className={styles.pagination}>
              <button onClick={handlePrevPage} disabled={page === 1} className={styles.pageBtn}>
                <ChevronLeft size={16} /> Anterior
              </button>
              <div className={styles.pageIndicator}>
                <span className={styles.pageNumberActive}>{page}</span>
              </div>
              <button 
                onClick={handleNextPage} 
                className={styles.pageBtn}
                // Deshabilitar si trajimos menos registros que el límite (fin de lista)
                disabled={clients.length < limit} 
              >
                Siguiente <ChevronRight size={16} />
              </button>
            </div>
          </section>

          {/* --- COLUMNA DERECHA: DETALLES --- */}
          {selectedClient && (
            <aside className={styles.detailSection}>
              
              {/* Perfil Header */}
              <div className={styles.profileHeader}>
                <div className={styles.avatarCircle}>
                  <User size={32} />
                </div>
                <div className={styles.profileInfo}>
                  <h3>{selectedClient.fullName}</h3>
                  <div className={styles.emailRow}>
                    <span>{selectedClient.email}</span>
                    <button className={styles.copyBtn} onClick={handleCopyEmail} title="Copiar email">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.detailDivider} />

              {/* Customer Info */}
              <div className={styles.infoBlock}>
                <h4>Información de contacto</h4>
                <div className={styles.infoRow}>
                  <Phone size={16} className={styles.infoIcon} />
                  <span>{(selectedClient as any).phone || 'No registrado'}</span> 
                </div>
                <div className={styles.infoRow}>
                  <MapPin size={16} className={styles.infoIcon} />
                  <span>
                    {mainAddress 
                      ? `${mainAddress.street} ${mainAddress.streetNumber}, ${mainAddress.city}`
                      : 'Sin dirección registrada'}
                  </span>
                </div>
              </div>

              {/* Actividad */}
              <div className={styles.infoBlock}>
                <h4>Actividad</h4>
                <div className={styles.activityRow}>
                  <span className={styles.label}>Estado:</span>
                  <span className={styles.value} style={{ color: selectedClient.isActive ? 'green' : 'red' }}>
                    {selectedClient.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className={styles.activityRow}>
                  <span className={styles.label}>Última Compra:</span>
                  <span className={styles.value}>{stats.lastOrderDate}</span>
                </div>
              </div>

              {/* Resumen Pedidos */}
              <div className={styles.infoBlock}>
                <h4>Resumen Pedidos</h4>
                <div className={styles.statsRow}>
                  <div className={styles.statBox}>
                    <span className={styles.statNum} style={{color: '#5c6bc0'}}>{stats.total}</span>
                    <span className={styles.statLabel}>Total Pedidos</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statNum} style={{color: '#4caf50'}}>{stats.delivered}</span>
                    <span className={styles.statLabel}>Entregados</span>
                  </div>
                  <div className={styles.statBox}>
                    <span className={styles.statNum} style={{color: '#f44336'}}>{stats.cancelled}</span>
                    <span className={styles.statLabel}>Cancelados</span>
                  </div>
                </div>
              </div>

            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientsPage;