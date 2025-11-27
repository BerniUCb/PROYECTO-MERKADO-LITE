"use client";

import React, { useEffect, useState } from "react";
import styles from "./productCard.module.css";
import ProductCardModel from "../../models/productCard.model";
import { useRouter } from "next/navigation";

interface Props {
  product: ProductCardModel;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  const { name, description, imageUrl } = product;
  const price = Number(product.salePrice) || 0;

  // Estado para verificar si está logueado
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  const handleAddClick = () => {
    if (!isLogged) {
      router.push("/login");
      return;
    }

    // Si está logueado, ir al detalle del producto
    router.push(`/product/${product.id}`);
  };

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

        <button className={styles.addButton} onClick={handleAddClick}>
          🛒 Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
