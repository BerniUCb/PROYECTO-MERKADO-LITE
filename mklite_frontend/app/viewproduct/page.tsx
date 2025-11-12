"use client";

import { useState } from 'react';
import styles from './page.module.css';

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);

  const relatedProducts = [
    { id: 1, name: 'Hamburguesa Fridosa Premium 1kg', price: 23.5, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Hamburguesa Fridosa Premium 1kg', price: 23.5, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Hamburguesa Fridosa Premium 1kg', price: 23.5, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Hamburguesa Fridosa Premium 1kg', price: 23.5, image: 'https://via.placeholder.com/150' },
  ];

  return (
    <div className={styles['product-page']}>
      {/* HEADER GLOBAL */}

      {/* MAIN */}
      <main className={styles['main-content']}>
        {/* Imagen del producto */}
        <div className={styles['product-image']}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg"
            alt="Brócoli"
          />
        </div>

        {/* Información del producto */}
        <div className={styles['product-info']}>
          <h2>Brócoli 1 kg</h2>
          <p className={styles.price}>Bs. 29.00</p>
          <p className={styles.description}>
            Brócoli fresco, ideal para ensaladas, guisos y comidas saludables. Producto orgánico de alta calidad.
          </p>
          <div className={styles['quantity-controls']}>
            <button onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
            <button className={styles['add-btn']}>🛒 Agregar al carrito</button>
          </div>
          <div className={styles.details}>
            <p><strong>Tipo:</strong> Orgánico</p>
            <p><strong>Stock:</strong> En stock</p>
          </div>
        </div>

        {/* Categorías */}
        <aside className={styles.categories}>
          <h3>Categorías</h3>
          <ul>
            <li className={styles.active}>Lácteos</li>
            <li>Frutas</li>
            <li>Verduras</li>
            <li>Bebidas</li>
          </ul>
        </aside>
      </main>

      {/* Productos relacionados */}
      <section className={styles['related-products']}>
        <h3>Productos Relacionados</h3>
        <div className={styles['related-grid']}>
          {relatedProducts.map((p) => (
            <div key={p.id} className={styles['related-card']}>
              <img src={p.image} alt={p.name} />
              <h4>{p.name}</h4>
              <p>Bs. {p.price}</p>
            </div>
          ))}
        </div>
      </section>

        {/* FOOTER GLOBAL */}
        
    </div>
  );
}
