"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import HeaderAdmin from "../../components/HeaderAdmin";

import DriverApplicationModel, {
  DriverApplicationStatus,
} from "@/app/models/driverApplication.model";

import { DriverApplicationService } from "@/app/services/driverApplication.service";

import { FaPhoneAlt, FaMotorcycle, FaCalendarAlt } from "react-icons/fa";

export default function DriverApplicationsPage() {
  const [applications, setApplications] =
    useState<DriverApplicationModel[]>([]);
  const [selected, setSelected] =
    useState<DriverApplicationModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DriverApplicationService.getAll()
      .then((data: DriverApplicationModel[]) => {
        setApplications(data);
        setSelected(data[0] ?? null);
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
      const updated =
        await DriverApplicationService.updateStatus(id, status);

      setApplications((prev) =>
        prev.map((app) => (app.id === id ? updated : app))
      );

      setSelected(updated);
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  if (loading) {
    return <p>Cargando solicitudes...</p>;
  }

  return (
    <>
      <HeaderAdmin />

      <main className={styles.page}>
        <h1 className={styles.title}>Solicitudes de repartidor</h1>
        <p className={styles.subtitle}>
          Aquí puedes revisar, aprobar o rechazar las solicitudes.
        </p>

        <div className={styles.layout}>
          {/* ===== TABLA ===== */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Vehículo</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className={
                      selected?.id === item.id ? styles.activeRow : ""
                    }
                  >
                    <td>{item.id}</td>
                    <td>{item.user.fullName}</td>
                    <td>{item.user.phone}</td>
                    <td>{item.vehicleType}</td>
                    <td>{item.status}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===== DETALLE ===== */}
          {selected && (
            <aside className={styles.detailCard}>
              <h3>{selected.user.fullName}</h3>
              <p className={styles.email}>{selected.user.email}</p>

              <div className={styles.info}>
                <span>
                  <FaPhoneAlt size={14} />
                  {selected.user.phone}
                </span>

                <span>
                  <FaMotorcycle size={16} />
                  {selected.vehicleType}
                </span>

                <span>
                  <FaCalendarAlt size={14} />
                  {new Date(selected.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.accept}
                  disabled={
                    selected.status !==
                    DriverApplicationStatus.PENDING
                  }
                  onClick={() =>
                    handleStatusChange(
                      selected.id,
                      DriverApplicationStatus.APPROVED
                    )
                  }
                >
                  Aceptar
                </button>

                <button
                  className={styles.reject}
                  disabled={
                    selected.status !==
                    DriverApplicationStatus.PENDING
                  }
                  onClick={() =>
                    handleStatusChange(
                      selected.id,
                      DriverApplicationStatus.REJECTED
                    )
                  }
                >
                  Rechazar
                </button>
              </div>
            </aside>
          )}
        </div>
      </main>
    </>
  );
}
