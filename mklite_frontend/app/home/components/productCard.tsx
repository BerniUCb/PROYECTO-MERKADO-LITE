"use client";

import React from "react";
import styles from "./productCard.module.css";
import ProductCardModel from "../../models/productCard.model";

interface Props {
  product: ProductCardModel;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * product.discount!) / 100
    : product.price;

  return (
    <div className={styles.card}>
      {hasDiscount && (
        <span className={styles.discountTag}>-{product.discount}%</span>
      )}
      <img
        src={product.imageUrl}
        alt={product.name}
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceContainer}>
          {hasDiscount && (
            <span className={styles.originalPrice}>
              Bs. {product.price.toFixed(2)}
            </span>
          )}
          <span className={styles.finalPrice}>
            Bs. {discountedPrice.toFixed(2)}
          </span>
        </div>
        <button className={styles.addButton}>🛒 Add</button>
      </div>
    </div>
  );
};

export default ProductCard;





