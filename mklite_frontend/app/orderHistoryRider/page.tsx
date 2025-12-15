"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Pedidos() {
  const [page, setPage] = useState(1);

  return (
    <div className={styles.layout}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Hora salida</th>
              <th>Hora entrega</th>
              <th>Puntualidad</th>
              <th>Tarifa final</th>
              <th>Detalle</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <span className={`${styles.badge} ${styles.entregado}`}>
                  Entregado
                </span>
              </td>
              <td>01-01-2025</td>
              <td>10:15</td>
              <td>10:35</td>
              <td>
                <span className={`${styles.badge} ${styles.tiempo}`}>
                  A Tiempo
                </span>
              </td>
              <td>
                Bs. 8.00
                <div className={styles.sub}>Puntual</div>
              </td>
              <td className={styles.more}>•••</td>
            </tr>

            <tr>
              <td>
                <span className={`${styles.badge} ${styles.entregado}`}>
                  Entregado
                </span>
              </td>
              <td>01-01-2025</td>
              <td>10:15</td>
              <td>10:35</td>
              <td>
                <span className={`${styles.badge} ${styles.retraso}`}>
                  Retraso (10 min)
                </span>
              </td>
              <td>
                Bs. 7.00
                <div className={styles.sub}>Retraso</div>
              </td>
              <td className={styles.more}>•••</td>
            </tr>

            <tr>
              <td>
                <span className={`${styles.badge} ${styles.cancelado}`}>
                  Cancelado
                </span>
              </td>
              <td>01-01-2025</td>
              <td>-</td>
              <td>-</td>
              <td>
                <span className={`${styles.badge} ${styles.noEntregado}`}>
                  No entregado
                </span>
              </td>
              <td>
                Bs. 0.00
                <div className={styles.sub}>Cancelado</div>
              </td>
              <td className={styles.more}>•••</td>
            </tr>
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button>← Anterior</button>

          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={page === p ? styles.active : ""}
            >
              {p}
            </button>
          ))}

          <button>…</button>

          <button
            onClick={() => setPage(24)}
            className={page === 24 ? styles.active : ""}
          >
            24
          </button>

          <button>Siguiente →</button>
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.user}>
          <div className={styles.avatar}>👤</div>
          <div>
            <div className={styles.name}>Carlos Pérez</div>
            <div className={styles.sub}>Pedido: #ORD0001</div>
            <div className={styles.sub}>Email: carlos@gmail.com</div>
          </div>
        </div>

        <div className={styles.sectionGrid}>
          <div className={styles.box}>
            <span>Fecha</span>
            <p>01-01-2025</p>
          </div>

          <div className={styles.box}>
            <span>Estado</span>
            <p className={styles.entregado}>Entregado</p>
          </div>

          <div className={styles.box}>
            <span>Hora de salida</span>
            <p>10:15</p>
          </div>

          <div className={styles.box}>
            <span>Hora de entrega</span>
            <p>10:35</p>
          </div>

          <div className={styles.boxFull}>
            <span>Puntualidad</span>
            <p className={styles.tiempo}>A tiempo · Dentro del rango</p>
          </div>
        </div>

        <div className={styles.boxFull}>
          <span>Ruta de entrega</span>
          <p>
            Recojo
            <br />
            Tienda Merkado Lite - Centro
            <br />
            Av. América esq. Pando
          </p>
        </div>

        <div className={styles.boxFull}>
          <span>Entrega</span>
          <p>
            Carlos Pérez
            <br />
            Calle Sucre #245 - Zona Centro
          </p>
        </div>

        <div className={styles.boxFull}>
          <span>Productos entregados</span>
          <ul>
            <li>2x Leche PIL 1L</li>
            <li>1x Pan Bimbo</li>
            <li>1x Coca Cola 2L</li>
          </ul>
        </div>

        <div className={styles.boxTotal}>
          <span>Tarifa final</span>
          <strong>Bs. 8.00</strong>
        </div>

        <p className={styles.note}>
          Este monto incluye la tarifa base más la bonificación por puntualidad.
        </p>
      </div>
    </div>
  );
}
