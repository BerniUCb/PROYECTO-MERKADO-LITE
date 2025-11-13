"use client";
import styles from "./page.module.css";

export default function Vegetales() {
  return (
    <main>
      {/*  HEADER con buscador */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <span>MERKADO</span>
          <span className={styles.lite}>LITE</span>
        </div>

        <div className={styles.search}>
          <input type="text" placeholder="Buscar productos..." />
          <button>Buscar</button>
        </div>

        <div className={styles.icons}>
          <a href="#">❤️ Lista de Deseos</a>
          <a href="#">🛒 Carrito</a>
          <a href="#">👤 Cuenta</a>
        </div>
      </header>

      {/*  Banner */}
      <section className={styles.banner}>
        <div className={styles.breadcrumb}>
          <a href="/">Inicio</a> &gt; <span>Vegetales</span>
        </div>
      </section>

      {/*  Contenido principal */}
      <section className={styles.main}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3>Categorías</h3>
          <ul>
            <li>🥛 Lácteos & Derivados</li>
            <li>🍖 Carnes</li>
            <li>🍓 Frutas</li>
            <li className={styles.activo}>🥦 Vegetales</li>
            <li>🍞 Panadería</li>
          </ul>
        </aside>

        {/* Productos */}
        <div className={styles.productos}>
          <h3 className={styles.titulo}>Encontramos 4 productos</h3>
          <div className={styles.grid}>
            <div className={styles.card}>
              <img src="/images/pimiento.png" alt="Pimiento Verde" />
              <h4>Pimiento Verde 1kg</h4>
              <p className={styles.precio}>Bs. 15.00</p>
              <button className={styles.btn}>🛒 Añadir</button>
            </div>
            <div className={styles.card}>
              <img src="/images/brocoli.png" alt="Brócoli 1kg" />
              <h4>Brócoli 1kg</h4>
              <p className={styles.precio}>Bs. 32.85</p>
              <button className={styles.btn}>🛒 Añadir</button>
            </div>
            <div className={styles.card}>
              <img src="/images/lechuga.png" alt="Lechuga Romana" />
              <h4>Lechuga Romana</h4>
              <p className={styles.precio}>Bs. 10.50</p>
              <button className={styles.btn}>🛒 Añadir</button>
            </div>
            <div className={styles.card}>
              <img src="/images/zanahoria.png" alt="Zanahoria 1kg" />
              <h4>Zanahoria 1kg</h4>
              <p className={styles.precio}>Bs. 8.75</p>
              <button className={styles.btn}>🛒 Añadir</button>
            </div>
          </div>

          {/*Paginación */}
          <div className={styles.paginacion}>
            <button>&laquo;</button>
            <button className={styles.activo}>1</button>
            <button>2</button>
            <button>3</button>
            <button>&raquo;</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <h3>Quédate en casa y consigue tus compras diarias</h3>
        <p>Comienza tus compras con <b>Merkado Lite</b></p>
        <div>
          <input type="email" placeholder="Tu correo electrónico" />
          <button>Suscribirse</button>
        </div>
      </footer>
    </main>
  );
}
