"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserService } from "@/app/services/user.service";
import type User from "@/app/models/user.model";

export default function RepartidoresPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<User | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(null);

  // paginación simple
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    fetchDrivers();
  }, [page]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      // Trae página del backend (si hay muchos usuarios mejor backend-side filter)
      const all = await UserService.getAll(page, limit, "fullName", "asc");

      // Filtramos por rol: aceptamos tanto 'Delivery' (frontend model) como 'DeliveryDriver' (backend entity)
     const drivers = all.filter((u) => u.role === "DeliveryDriver");


      setUsers(drivers);
      // si no hay selección, seleccionar el primero
      if (drivers.length > 0 && !selected) {
        selectDriver(drivers[0]);
      }
    } catch (err) {
      console.error("Error cargando repartidores:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectDriver = async (u: User) => {
    setSelected(u);
    setOrdersCount(null);
    try {
      const resp = await UserService.getOrdersCount(u.id); // función que agregamos al service
      setOrdersCount(resp.totalOrders ?? resp);
    } catch (err) {
      console.error("Error al obtener conteo de pedidos:", err);
      setOrdersCount(null);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.layout}>
        {/* tabla izquierda */}
        <div className={styles.container}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Código Repartidor</th>
                  <th className={styles.th}>Nombre</th>
                  <th className={styles.th}>Teléfono</th>
                  <th className={styles.th}>N° de Pedidos</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={4}>Cargando repartidores...</td>
                  </tr>
                )}

                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan={4}>No se encontraron repartidores.</td>
                  </tr>
                )}

                {users.map((u) => (
                  <tr
                    key={u.id}
                    className={`${styles.rowHover} ${
                      selected?.id === u.id ? styles.selectedRow : ""
                    }`}
                    onClick={() => selectDriver(u)}
                  >
                    <td className={styles.td}>#REPT{u.id.toString().padStart(3, "0")}</td>
                    <td className={styles.td}>{u.fullName}</td>
                    <td className={styles.td}>
                      {/* el modelo no tiene phone guaranteed; mostramos email si no existe */}
                      {u?.addresses?.length ? (
                        // si tu backend guarda teléfonos en addresses, aquí habría que adaptarlo
                        u.addresses[0].city ?? "—"
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className={styles.td}>
                      {/* Si queremos mostrar el número de pedidos directamente: llamamos al endpoint por cada fila sería costoso.
                          Aquí mostramos un botón o '—' y al seleccionar la fila se carga el conteo en la card derecha. */}
                      <button
                        className={styles.smallBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectDriver(u);
                        }}
                      >
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* paginación simple */}
            <div className={styles.pagination}>
              <button
                className={styles.paginationBtn}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Anterior
              </button>

              <div className={styles.pageIndicator}>Página {page}</div>

              <button
                className={styles.paginationBtn}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* card derecha */}
        <div className={styles.card}>
          {selected ? (
            <>
              <div className={styles.profile}>
                <img
                  className={styles.profileImg}
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="avatar"
                />
                <div>
                  <div className={styles.title}>{selected.fullName}</div>
                  <div className={styles.subtitle}>{selected.email}</div>
                </div>
              </div>

              <div className={styles.sectionTitle}>Customer Info</div>
              <div className={styles.inputBox}>
                {/* intentar mostrar teléfono si existe en phone o en addresses */}
                {/** @ts-ignore **/}
                {selected["phone"] ? selected["phone"] : "—"}
              </div>
              <div className={styles.inputBox}>
                {selected.addresses && selected.addresses.length
                  ? `${selected.addresses[0].street || ""}, ${selected.addresses[0].city || ""}`
                  : "Dirección no disponible"}
              </div>

              <div className={styles.sectionTitle}>Actividad</div>
              <div className={styles.inputBox}>Registro: {/* si tienes createdAt en user, mostrarlo */} — </div>
              <div className={styles.inputBox}>Última Compra: —</div>

              <div className={styles.sectionTitle}>Resumen Pedidos</div>

              <div className={styles.stats}>
                <div className={`${styles.statBox} ${styles.blue}`}>
                  {ordersCount ?? "—"} <br /> Total Pedidos
                </div>
                <div className={`${styles.statBox} ${styles.green}`}>
                  {/* Podrías pedir estados entregados desde otro endpoint */}
                  — <br /> Entregados
                </div>
                <div className={`${styles.statBox} ${styles.red}`}>
                  — <br /> Cancelados
                </div>
              </div>
            </>
          ) : (
            <div>Selecciona un repartidor para ver detalles</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
