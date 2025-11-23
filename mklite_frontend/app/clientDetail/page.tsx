import styles from "./page.module.css";

export default function Detalles() {
  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Código Cliente</th>
                <th className={styles.th}>Nombre</th>
                <th className={styles.th}>Teléfono</th>
                <th className={styles.th}>N° Pedidos</th>
              </tr>
            </thead>

            <tbody>
              <tr className={styles.rowHover}>
                <td className={styles.td}>#CUST001</td>
                <td className={styles.td}>Pepe Ramirez</td>
                <td className={styles.td}>+591 69520024</td>
                <td className={styles.td}>25</td>
              </tr>

              <tr className={`${styles.rowHover} ${styles.selectedRow}`}>
                <td className={styles.td}>#CUST002</td>
                <td className={styles.td}>JP Maiz</td>
                <td className={styles.td}>+591 689650024</td>
                <td className={styles.td}>65</td>
              </tr>
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button className={styles.paginationBtn}>← Anterior</button>
            <button className={`${styles.paginationBtn} ${styles.activeBtn}`}>1</button>
            <button className={styles.paginationBtn}>2</button>
            <button className={styles.paginationBtn}>3</button>
          </div>
        </div>
      </div>

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

        <div className={styles.sectionTitle}>Información del Cliente</div>
        <div className={styles.inputBox}>+591 69520024</div>
        <div className={styles.inputBox}>Julio Mendez, Cercado</div>
      </div>
    </div>
  );
}
