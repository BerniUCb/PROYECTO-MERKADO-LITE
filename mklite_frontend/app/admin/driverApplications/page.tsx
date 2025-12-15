"use client";

import styles from "./page.module.css";
import { useState } from "react";
import { FaPhoneAlt, FaMotorcycle, FaCalendarAlt } from "react-icons/fa";

/* ===============================
   TIPOS (SOLO MODELADO)
================================ */
type Application = {
  id: number;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  date: string;
};

/* ===============================
   MOCK DATA (TEMPORAL)
================================ */
const mockApplications: Application[] = [
  {
    id: 1,
    code: "#SOLR001",
    fullName: "Carlos Pérez",
    email: "perez@gmail.com",
    phone: "+591 65491862",
    vehicle: "Moto",
    plate: "123-ABC",
    date: "25/11/2025",
  },
  {
    id: 2,
    code: "#SOLR002",
    fullName: "Carlos Pérez",
    email: "perez@gmail.com",
    phone: "+591 65491862",
    vehicle: "Moto",
    plate: "123-ABC",
    date: "25/11/2025",
  },
  {
    id: 3,
    code: "#SOLR003",
    fullName: "Carlos Pérez",
    email: "perez@gmail.com",
    phone: "+591 65491862",
    vehicle: "Moto",
    plate: "123-ABC",
    date: "25/11/2025",
  },
];

export default function DriverApplicationsPage() {
  const [applications] = useState<Application[]>(mockApplications);
  const [selected, setSelected] = useState<Application | null>(
    mockApplications[0]
  );

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Solicitudes de repartidor</h1>
      <p className={styles.subtitle}>
        Aquí puedes revisar, aprobar o rechazar las solicitudes para convertirse
        en repartidor.
      </p>

      <div className={styles.layout}>
        {/* ===== TABLA ===== */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código Solicitud</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Vehículo</th>
                <th>Fecha solicitud</th>
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
                  <td>{item.code}</td>
                  <td>{item.fullName}</td>
                  <td>{item.phone}</td>
                  <td>{item.vehicle}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== DETALLE ===== */}
        {selected && (
          <aside className={styles.detailCard}>
            <h3>{selected.fullName}</h3>
            <p className={styles.email}>{selected.email}</p>

            <div className={styles.info}>
              <span>
                <FaPhoneAlt size={14} />
                {selected.phone}
              </span>

              <span>
                <FaMotorcycle size={16} />
                {selected.vehicle} · Placa {selected.plate}
              </span>

              <span>
                <FaCalendarAlt size={14} />
                Fecha de solicitud: {selected.date}
              </span>
            </div>

            <div className={styles.actions}>
              <button
                className={styles.accept}
                onClick={() => alert("Solicitud aceptada (mock)")}
              >
                Aceptar
              </button>

              <button
                className={styles.reject}
                onClick={() => alert("Solicitud rechazada (mock)")}
              >
                Rechazar
              </button>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
