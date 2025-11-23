"use client";

import HeaderAdmin from "../components/HeaderAdmin";
import styles from "./page.module.css";

export default function CategoriesAdminPage() {
  return (
    <div className={styles.wrapper}>

      {/* HEADER ADMIN */}
      <HeaderAdmin />

      <main className={styles.main}>

        <h1 className={styles.welcome}>Bienvenido Pepe</h1>
        <h2 className={styles.subtitle}>Explorar</h2>

        {/* CATEGORÍAS */}
        <section className={styles.categories}>
          <div className={styles.card}>
            <img src="/icons/abarrotes.svg" />
            <span>Abarrotes</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/bebidas.svg" />
            <span>Bebidas</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/frutas.svg" />
            <span>Frutas</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/verduras.svg" />
            <span>Verduras</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/mariscos.svg" />
            <span>Mariscos</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/snacks.svg" />
            <span>Snacks y golosinas</span>
          </div>
          <div className={styles.card}>
            <img src="/icons/lacteos.svg" />
            <span>Lácteos y derivados</span>
          </div>
        </section>

        {/* TABLA */}
        <section className={styles.tableBox}>

          <div className={styles.tabs}>
            <button className={styles.active}>Todos (145)</button>
            <button>Fuera de Stock</button>
          </div>

          <div className={styles.search}>
            <input placeholder="Buscar Producto" />
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Fecha de Registro</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#CUST001</td>
                <td>
                  <div className={styles.product}>
                    <img src="/productos/jugo.png" />
                    <span>Jugo Ades Manzana 1L</span>
                  </div>
                </td>
                <td>01-01-2025</td>
                <td>25</td>
                <td>🗑️</td>
              </tr>
            </tbody>
          </table>

        </section>
      </main>
    </div>
  );
}
