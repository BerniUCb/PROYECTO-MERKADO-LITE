"use client";

import React from "react";
import styles from "./productCard.module.css";
import ProductCardModel from "../../models/productCard.model";
import Link from "next/link";

interface Props {
  product: ProductCardModel;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { name, description, imageUrl } = product;
  const price = Number(product.salePrice) || 0;

  return (
    <div className={styles.card}>
      <img
        src={imageUrl || "/products/no-image.png"}
        alt={name}
        className={styles.image}
      />

      <div className={styles.content}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.priceContainer}>
          <span className={styles.finalPrice}>
            Bs. {price.toFixed(2)}
          </span>
        </div>

        <Link href={`/product/${product.id}`}>
          <button className={styles.addButton}>🛒 Add</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;







