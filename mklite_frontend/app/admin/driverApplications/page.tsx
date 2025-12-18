"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
// import HeaderAdmin from "../../components/HeaderAdmin"; // Si usas Sidebar, el header suele ir dentro del layout

import DriverApplicationModel, {
  DriverApplicationStatus,
} from "@/app/models/driverApplication.model";

import { DriverApplicationService } from "@/app/services/driverApplication.service";

import { FaPhoneAlt, FaMotorcycle, FaCalendarAlt, FaUser } from "react-icons/fa";

export default function DriverApplicationsPage() {
  const [applications, setApplications] = useState<DriverApplicationModel[]>([]);
  const [selected, setSelected] = useState<DriverApplicationModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DriverApplicationService.getAll()
      .then((data: DriverApplicationModel[]) => {
        setApplications(data);
        if (data.length > 0) {
            setSelected(data[0]);
        }
      })
      .catch((err) => {
        console.error("Error cargando solicitudes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (
    id: number,
    status: DriverApplicationStatus
  ) => {
    try {
      const updated = await DriverApplicationService.updateStatus(id, status);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );

      setSelected(updated);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'PENDING': return 'Pendiente';
          case 'APPROVED': return 'Aprobado';
          case 'REJECTED': return 'Rechazado';
          default: return status;
      }
  };

  const getStatusClass = (status: string) => {
      switch(status) {
          case 'PENDING': return styles.statusPending;
          case 'APPROVED': return styles.statusApproved;
          case 'REJECTED': return styles.statusRejected;
          default: return '';
      }
  };

  if (loading) {
    return <div className={styles.loadingScreen}>Cargando solicitudes...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* <HeaderAdmin />  <-- Descomentar si es necesario, pero usualmente va en el layout padre */}

      <main className={styles.mainContent}>
        <header className={styles.header}>
            <h1 className={styles.title}>Solicitudes de repartidor</h1>
            <p className={styles.subtitle}>
            Administra las solicitudes de ingreso de nuevos conductores.
            </p>
        </header>

        <div className={styles.contentGrid}>
          
          {/* ===== LISTA DE SOLICITUDES (IZQUIERDA) ===== */}
          <section className={styles.listSection}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Vehículo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.length === 0 && (
                        <tr><td colSpan={5} className={styles.emptyState}>No hay solicitudes pendientes.</td></tr>
                    )}
                    {applications.map((item) => (
                    <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className={selected?.id === item.id ? styles.activeRow : ""}
                    >
                        <td className={styles.boldText}>#{item.id}</td>
                        <td>{item.user.fullName}</td>
                        <td>{item.vehicleType}</td>
                        <td>
                            <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                                {getStatusLabel(item.status)}
                            </span>
                        </td>
                        <td className={styles.dateCell}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          </section>

          {/* ===== DETALLE (DERECHA) ===== */}
          {selected ? (
            <aside className={styles.detailSection}>
              <div className={styles.detailCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarCircle}>
                        <FaUser size={24} />
                    </div>
                    <div>
                        <h3 className={styles.detailName}>{selected.user.fullName}</h3>
                        <p className={styles.detailEmail}>{selected.user.email}</p>
                    </div>
                </div>

                <hr className={styles.divider} />

                <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                        <span className={styles.label}><FaPhoneAlt /> Teléfono</span>
                        <span className={styles.value}>{selected.user.phone || 'N/A'}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}><FaMotorcycle /> Vehículo</span>
                        <span className={styles.value} style={{textTransform:'capitalize'}}>{selected.vehicleType}</span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.label}><FaCalendarAlt /> Fecha Solicitud</span>
                        <span className={styles.value}>{new Date(selected.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {selected.status === DriverApplicationStatus.PENDING ? (
                    <div className={styles.actions}>
                        <button
                            className={styles.btnApprove}
                            onClick={() => handleStatusChange(selected.id, DriverApplicationStatus.APPROVED)}
                        >
                            Aprobar Solicitud
                        </button>
                        <button
                            className={styles.btnReject}
                            onClick={() => handleStatusChange(selected.id, DriverApplicationStatus.REJECTED)}
                        >
                            Rechazar
                        </button>
                    </div>
                ) : (
                    <div className={`${styles.statusMessage} ${getStatusClass(selected.status)}`}>
                        Solicitud {getStatusLabel(selected.status)}
                    </div>
                )}
              </div>
            </aside>
          ) : (
             <div className={styles.emptySelection}>Selecciona una solicitud para ver detalles</div>
          )}

        </div>
      </main>
    </div>
  );
}