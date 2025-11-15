"use client";

import { useState } from 'react';
import styles from './page.module.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
//import type { Product } from '../../src/types/entities';

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);

interface Product {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precioVenta: number;
  precioRegular?: number | null;
  precioOferta?: number | null;
  unidadMedida?: string | null;
  stockDisponible: number;
  categoriaId?: number | null;    // FK simple
  providerId?: number | null;     // FK simple
  imagenes?: string[];            // array de URLs o nombres de archivo
  createdAt?: string;
  updatedAt?: string;
}
  // Producto principal (ejemplo) usando la interfaz Product
  const product: Product = {
    id: 1,
    nombre: 'Brócoli 1 kg',
    descripcion: 'Brócoli fresco, ideal para ensaladas, guisos y comidas saludables. Producto orgánico de alta calidad.',
    precioVenta: 29.0,
    unidadMedida: 'kg',
    stockDisponible: 42,
    imagenes: [
      'https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg',
    ],
  };

  // Productos relacionados tipados con la interfaz Product (muestras simplificadas)
  const relatedProducts: Product[] = [
    { id: 2, nombre: 'Hamburguesa Fridosa Premium 1kg', precioVenta: 23.5, stockDisponible: 10, imagenes: ['https://via.placeholder.com/150'] },
    { id: 3, nombre: 'Hamburguesa Fridosa Premium 1kg', precioVenta: 23.5, stockDisponible: 8, imagenes: ['https://via.placeholder.com/150'] },
    { id: 4, nombre: 'Hamburguesa Fridosa Premium 1kg', precioVenta: 23.5, stockDisponible: 5, imagenes: ['https://via.placeholder.com/150'] },
    { id: 5, nombre: 'Hamburguesa Fridosa Premium 1kg', precioVenta: 23.5, stockDisponible: 2, imagenes: ['https://via.placeholder.com/150'] },
  ];

  return (
    <div className={styles['product-page']}>
      {/* HEADER GLOBAL */}
      <Header />

      {/* MAIN */}
      <main className={styles['main-content']}>
        {/* Imagen del producto */}
        <div className={styles['product-image']}>
          <img
            src={product.imagenes?.[0] ?? '/placeholder.png'}
            alt={product.nombre}
          />
        </div>

        {/* Información del producto */}
        <div className={styles['product-info']}>
          <h2>{product.nombre}</h2>
          <p className={styles.price}>Bs. {Number(product.precioVenta).toFixed(2)}</p>
          <p className={styles.description}>{product.descripcion}</p>
          <div className={styles['quantity-controls']}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>+</button>
            <button className={styles['add-btn']}>🛒 Agregar al carrito</button>
          </div>
          <div className={styles.details}>
            <p><strong>Tipo:</strong> {product.unidadMedida ?? 'Unidad'}</p>
            <p><strong>Stock:</strong> {product.stockDisponible ?? '—'}</p>
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
              <img src={p.imagenes?.[0] ?? '/placeholder.png'} alt={p.nombre} />
              <h4>{p.nombre}</h4>
              <p>Bs. {Number(p.precioVenta).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

        {/* FOOTER GLOBAL */}
        <Footer />
        
    </div>
  );
}
