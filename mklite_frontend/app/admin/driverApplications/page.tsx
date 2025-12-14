"use client";

import styles from "./page.module.css";
import { useState } from "react";

type Application = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  date: string;
  email: string;
  plate: string;
};

const mockData: Application[] = [
  {
    id: "SOLR001",
    name: "Carlos Pérez",
    phone: "+591 65491862",
    vehicle: "Moto",
    date: "25/11/2025",
    email: "carlos@email.com",
    plate: "ABC-123",
  },
];

export default function DriverApplicationsPage() {
  const [selected, setSelected] = useState<Application | null>(mockData[0]);

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Solicitudes de repartidor</h1>
      <p className={styles.subtitle}>
        Aquí puedes revisar, aprobar o rechazar las solicitudes para convertirse
        en repartidor.
      </p>

      <div className={styles.layout}>
        {/* TABLA */}
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
              {mockData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={
                    selected?.id === item.id ? styles.activeRow : ""
                  }
                >
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.vehicle}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* DETALLE */}
{selected && (
  <aside className={styles.detailCard}>
    <h3>{selected.name}</h3>
    <p className={styles.email}>{selected.email}</p>

    <div className={styles.info}>
      <span>📞 {selected.phone}</span>
      <span>🏍️ Vehículo: {selected.vehicle}</span>
      <span>🔢 Placa: {selected.plate}</span>
      <span>📅 Fecha: {selected.date}</span>
    </div>

    <div className={styles.actions}>
      <button
        className={styles.accept}
        onClick={() => alert("Solicitud aceptada")}
      >
        Aceptar
      </button>

      <button
        className={styles.reject}
        onClick={() => alert("Solicitud rechazada")}
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
