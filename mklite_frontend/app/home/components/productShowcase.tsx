"use client";

import React, { useEffect, useState } from "react";
import styles from "./productShowcase.module.css";
import { useRouter } from "next/navigation";
import { ProductService } from "@/app/services/product.service";
import type ProductModel from "@/app/models/productCard.model";

const MAX_PRODUCTS = 9; // 3 columnas x 3 productos

const ProductShowcase: React.FC = () => {
  const router = useRouter();

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [isLogged, setIsLogged] = useState(false);

  // Verificar login
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  // Cargar productos aleatorios
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await ProductService.getAll();

        // Mezclar productos (shuffle)
        const shuffled = [...allProducts].sort(
          () => Math.random() - 0.5
        );

        setProducts(shuffled.slice(0, MAX_PRODUCTS));
      } catch (error) {
        console.error("Error cargando productos recomendados", error);
      }
    };

    loadProducts();
  }, []);

  const handleAddClick = (productId: number) => {
    if (!isLogged) {
      router.push("/login");
      return;
    }

    router.push(`/product/${productId}`);
  };

  // Dividir en 3 columnas
  const columns = [0, 1, 2].map((col) =>
    products.filter((_, index) => index % 3 === col)
  );

  return (
    <section className={styles.showcase}>
      <h2 className={styles.mainTitle}>Productos recomendados</h2>

      <div className={styles.columns}>
        {columns.map((column, colIndex) => (
          <ul key={colIndex} className={styles.productList}>
            {column.map((product) => (
              <li key={product.id} className={styles.productItem}>
                <img
                  src={product.imageUrl || "/products/no-image.png"}
                  alt={product.name}
                  className={styles.image}
                />

                <div className={styles.info}>
                  <p className={styles.name}>{product.name}</p>

                  <div className={styles.pricesRow}>
                    <span className={styles.price}>
                      Bs. {Number(product.salePrice).toFixed(2)}
                    </span>

                    <button
                      className={styles.addButton}
                      onClick={() => handleAddClick(product.id)}
                      title="Ver producto"
                    >
                      🛒
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
