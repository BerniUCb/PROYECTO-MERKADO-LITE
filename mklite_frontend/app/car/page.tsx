"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

type Product = {
  id: number;
  name: string;
  price: number;
  qty: number;
  img: string;
};

export default function CarPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Lavavajilla Sapolio Manzana 750 ml",
      price: 19,
      qty: 2,
      img: "/img/lavavajilla.png",
    },
    {
      id: 2,
      name: "Pasta Dental Natural 233 gr",
      price: 19,
      qty: 2,
      img: "/img/pasta.png",
    },
    {
      id: 3,
      name: "Enjuague Bucal Dento Menta 500 ml",
      price: 39,
      qty: 1,
      img: "/img/enjuague.png",
    },
  ]);

  const [shipping, setShipping] = useState<number>(0);

  const changeQty = (id: number, delta: number) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, qty: Math.max(1, p.qty + delta) } : p
      )
    );
  };

  const removeProduct = (id: number) => {
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.classList.add(styles.fadeOut);
      setTimeout(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
      }, 300);
    }
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const total = subtotal + shipping;

  return (
    <main>
      {/* HEADER GLOBAL */}
      <Header />
      
      {/* CONTENIDO DEL CARRITO */}
      <div className={styles.container}>
        <section className={styles.cartBox}>
          <div className={styles.header}>
            <h1>Tu Carrito</h1>
            <p>Hay {products.length} productos en tu carrito!</p>
            <button className={styles.clear}>Limpiar Carrito</button>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio U.</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  {/* PRODUCTO */}
                  <td className={styles.productCell}>
                    <img src={p.img} alt={p.name} />
                    <div>
                      <p>{p.name}</p>
                      <button onClick={() => removeProduct(p.id)}>
                        × Eliminar
                      </button>
                    </div>
                  </td>

                  {/* CANTIDAD */}
                  <td className={styles.qtyCell}>
                    <button onClick={() => changeQty(p.id, -1)}>-</button>
                    <span>{p.qty}</span>
                    <button onClick={() => changeQty(p.id, 1)}>+</button>
                  </td>

                  {/* PRECIO */}
                  <td className={styles.price}>
                    Bs. {p.price.toFixed(2)}
                  </td>

                  {/* SUBTOTAL */}
                  <td className={styles.subtotal}>
                    Bs. {(p.price * p.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* RESUMEN LATERAL */}
        <aside className={styles.summary}>
          <h3>Resumen de compra</h3>

          <div className={styles.shippingOptions}>
            <label>
              <input
                type="radio"
                name="shipping"
                onChange={() => setShipping(0)}
                defaultChecked
              />
              Envío Gratis
            </label>
            <span>Bs. 0.00</span>

            <label>
              <input
                type="radio"
                name="shipping"
                onChange={() => setShipping(15)}
              />
              Envío Express
            </label>
            <span>Bs. 15.00</span>
          </div>

          <div className={styles.totals}>
            <p>Subtotal: Bs. {subtotal.toFixed(2)}</p>
            <p>
              <strong>Total: Bs. {total.toFixed(2)}</strong>
            </p>
          </div>

          <button className={styles.checkout}>Realizar envío</button>
        </aside>
      </div>

      {/* FOOTER GLOBAL */}
      <Footer />
    </main>
  );
}
