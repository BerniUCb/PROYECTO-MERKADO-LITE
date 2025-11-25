import Footer from "../components/Footer";
import Header from "../components/Header";
import styles from "./page.module.css";

export default function Notificaciones() {
  return (
    <>
    <Header/>
    <div className={styles.pageBackground}>
      <div className={styles.wrapper}>
        <div className={styles.title}>Notificaciones</div>

        <div className={styles.container}>

          {/* 1. CASH_REGISTER_CLOSED */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Caja cerrada</div>
                <div className={styles.subText}>
                  La caja registradora ha sido cerrada correctamente.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 2. LOW_STOCK */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Stock bajo</div>
                <div className={styles.subText}>
                  Uno de tus productos está por agotarse. Revisa el inventario.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 3. HIGH_DEMAND_PRODUCT */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Producto en alta demanda</div>
                <div className={styles.subText}>
                  Uno de tus productos está recibiendo muchas visitas y compras.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 4. ORDER_RECEIVED */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Pedido recibido</div>
                <div className={styles.subText}>
                  Un nuevo pedido ha sido recibido en tu tienda.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 5. ORDER_SHIPPED */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Pedido enviado</div>
                <div className={styles.subText}>
                  El pedido ha sido despachado y está en camino al cliente.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 6. ORDER_DELIVERED */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Pedido entregado</div>
                <div className={styles.subText}>
                  El pedido fue entregado exitosamente al cliente.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

          {/* 7. NEW_PROMOTION */}
          <div className={styles.item}>
            <div className={styles.left}>
              <img className={styles.icon} src="." />
              <div className={styles.textBlock}>
                <div className={styles.mainText}>Nueva promoción</div>
                <div className={styles.subText}>
                  Hay una nueva promoción disponible para tus productos.
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.date}>12/03/2025 — 10:24</div>
              <button className={styles.deleteBtn}>Eliminar</button>
            </div>
          </div>

        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
