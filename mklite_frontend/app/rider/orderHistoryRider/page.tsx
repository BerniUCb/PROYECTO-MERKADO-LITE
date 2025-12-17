"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { ShipmentService } from "@/app/services/shipment.service";
import type Shipment from "@/app/models/shipment.model";

const PAGE_SIZE = 5;

export default function OrderRiderHistory() {
  const [driverId, setDriverId] = useState<number | null>(null);

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [selected, setSelected] = useState<Shipment | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // =========================
  // Obtener driverId (token)
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload: any = JSON.parse(atob(token.split(".")[1]));
      setDriverId(payload.sub || payload.id);
    } catch {
      console.error("Token inválido");
    }
  }, []);

  // =========================
  // Cargar historial
  // =========================
  useEffect(() => {
    if (!driverId) return;

    const load = async () => {
      try {
        const res = await ShipmentService.getDriverHistory(
          driverId,
          page,
          PAGE_SIZE
        );
        setShipments(res.data);
        setTotal(res.total);
        setSelected(res.data[0] ?? null);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [driverId, page]);

  // =========================
  // Helpers
  // =========================
  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString() : "-";

  const formatTime = (d?: string) =>
    d ? new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

  const calcEarning = (s: Shipment) =>
    s.order.items.reduce(
      (acc, i) => acc + i.quantity * i.unitPrice,
      0
    );

  const punctuality = (s: Shipment) => {
    if (!s.estimatedDelivery || !s.deliveredAt) return "A tiempo";
    const est = new Date(s.estimatedDelivery).getTime();
    const del = new Date(s.deliveredAt).getTime();
    const diff = Math.round((del - est) / 60000);
    return diff <= 0 ? "A tiempo" : `Retraso (${diff} min)`;
  };

  // =========================
  // Render
  // =========================
  return (
    <div className={styles.layout}>
      {/* ===== TABLA ===== */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Salida</th>
              <th>Entrega</th>
              <th>Puntualidad</th>
              <th>Tarifa</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((s) => (
              <tr
                key={s.id}
                onClick={() => setSelected(s)}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <span className={`${styles.badge} ${styles.entregado}`}>
                    Entregado
                  </span>
                </td>
                <td>{formatDate(s.deliveredAt)}</td>
                <td>{formatTime(s.assignedAt)}</td>
                <td>{formatTime(s.deliveredAt)}</td>
                <td>
                  <span className={styles.badge}>
                    {punctuality(s)}
                  </span>
                </td>
                <td>Bs. {calcEarning(s).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ===== PAGINACIÓN ===== */}
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ←
          </button>

          <span>
            Página {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            →
          </button>
        </div>
      </div>

      {/* ===== DETALLE ===== */}
      {selected && (
        <div className={styles.detailCard}>
          <h3>Pedido #{selected.order.id}</h3>

          <p>
            <strong>Cliente:</strong> {selected.order.user.fullName}
          </p>

          <p>
            <strong>Dirección:</strong>{" "}
            {selected.deliveryAddress.street}{" "}
            {selected.deliveryAddress.streetNumber}
          </p>

          <div className={styles.boxFull}>
            <strong>Productos</strong>
            <ul>
              {selected.order.items.map((i, idx) => (
                <li key={idx}>
                  {i.quantity}x {i.product.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.boxTotal}>
            <span>Tarifa final</span>
            <strong>
              Bs. {calcEarning(selected).toFixed(2)}
            </strong>
          </div>
        </div>
      )}
    </div>
  );
}
