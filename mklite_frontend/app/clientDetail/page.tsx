import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "./page.module.css";

export default function Detalles() {
  return (
    <>
    <Header/>
    <div className={styles.layout}>
      {/* TABLA */}
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Código Cliente</th>
                <th className={styles.th}>Nombre</th>
                <th className={styles.th}>Teléfono</th>
                <th className={styles.th}>N° de Pedidos</th>
              </tr>
            </thead>

            <tbody>
              <tr className={styles.rowHover}>
                <td className={styles.td}>#CUST001</td>
                <td className={styles.td}>Pepe Ramirez</td>
                <td className={styles.td}>+591 69520024</td>
                <td className={styles.td}>25</td>
              </tr>

              <tr className={styles.rowHover}>
                <td className={styles.td}>#CUST002</td>
                <td className={styles.td}>JP Maiz</td>
                <td className={styles.td}>+591 69520024</td>
                <td className={styles.td}>5</td>
              </tr>
            </tbody>
          </table>

          {/* PAGINACIÓN */}
          <div className={styles.pagination}>
            <button className={styles.paginationBtn}>← Anterior</button>

            <button className={`${styles.paginationBtn} ${styles.activeBtn}`}>
              1
            </button>

            <button className={styles.paginationBtn}>2</button>
            <button className={styles.paginationBtn}>3</button>
            <button className={styles.paginationBtn}>Siguiente →</button>
          </div>
        </div>
      </div>

      {/* CARD DERECHA */}
      <div className={styles.card}>
        <div className={styles.profile}>
          <img
            className={styles.profileImg}
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          />
          <div>
            <div className={styles.title}>JP Maiz</div>
            <div className={styles.subtitle}>maizhinojosa@gmail.com</div>
          </div>
        </div>

        <div className={styles.sectionTitle}>Customer Info</div>
        <div className={styles.inputBox}> +591 69520024</div>
        <div className={styles.inputBox}> Julio Mendez, Cercado</div>

        <div className={styles.sectionTitle}>Actividad</div>
        <div className={styles.inputBox}>Registro: 15.01.2025</div>
        <div className={styles.inputBox}>Última Compra: 10.01.2025</div>

        <div className={styles.sectionTitle}>Resumen Pedidos</div>

        <div className={styles.stats}>
          <div className={`${styles.statBox} ${styles.blue}`}>
            5 <br /> Total Pedidos
          </div>
          <div className={`${styles.statBox} ${styles.green}`}>
            4 <br /> Entregados
          </div>
          <div className={`${styles.statBox} ${styles.red}`}>
            1 <br /> Cancelados
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
