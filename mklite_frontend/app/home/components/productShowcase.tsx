"use client";

import React from "react";
import styles from "./productShowcase.module.css";

interface Product {
  name: string;
  price: number;
  oldPrice?: number;
  imageUrl: string;
}

const ProductShowcase: React.FC = () => {
  const bestSellers: Product[] = [
    { name: "All Natural Style Chicken Meatballs", price: 52.85, oldPrice: 55.80, imageUrl: "/products/1.jpg" },
    { name: "Angie’s Sweet & Salty Kettle Corn", price: 52.85, oldPrice: 55.80, imageUrl: "/products/2.jpg" },
    { name: "Gorton’s Beer Battered Fish Fillets", price: 23.85, oldPrice: 25.80, imageUrl: "/products/3.jpg" },
  ];

  const newArrivals: Product[] = [
    { name: "Seeds of Change Organic Red Rice", price: 28.85, oldPrice: 32.80, imageUrl: "/products/4.jpg" },
    { name: "All Natural Style Chicken Meatballs", price: 52.85, oldPrice: 55.80, imageUrl: "/products/1.jpg" },
    { name: "Angie’s Sweet & Salty Kettle Corn", price: 48.85, oldPrice: 52.80, imageUrl: "/products/2.jpg" },
  ];

  const topRated: Product[] = [
    { name: "Blue Almonds Lightly Salted Vegetables", price: 23.85, oldPrice: 25.80, imageUrl: "/products/5.jpg" },
    { name: "Organic Cage Grade A Large Eggs", price: 21.00, oldPrice: 24.00, imageUrl: "/products/6.jpg" },
    { name: "All Natural Style Chicken Meatballs", price: 52.85, oldPrice: 55.80, imageUrl: "/products/1.jpg" },
  ];

  const renderList = (title: string, products: Product[]) => (
    <div className={styles.column}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.productList}>
        {products.map((p, i) => (
          <li key={i} className={styles.productItem}>
            <img src={p.imageUrl} alt={p.name} className={styles.image} />
            <div>
              <p className={styles.name}>{p.name}</p>
              <div className={styles.prices}>
                <span className={styles.price}>Bs.{p.price.toFixed(2)}</span>
                {p.oldPrice && <span className={styles.oldPrice}>Bs.{p.oldPrice.toFixed(2)}</span>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className={styles.showcase}>
      {renderList("Más Vendidos", bestSellers)}
      {renderList("Recién Agregados", newArrivals)}
      {renderList("Mejor Calificados", topRated)}
    </section>
  );
};

export default ProductShowcase;



