"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import type ProductModel from "@/app/models/productCard.model";
import { getProductById, getProducts } from "@/app/services/product.service";

import { CartItemService } from "@/app/services/cartItem.service";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id);

  const [product, setProduct] = useState<ProductModel | null>(null);
  const [related, setRelated] = useState<ProductModel[]>([]);
  const [quantity, setQuantity] = useState(1);

  // =========================================================
  // 1) Cargar producto principal
  // =========================================================
  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const data = await getProductById(productId);
      setProduct(data);
    };

    loadProduct();
  }, [productId]);

  // =========================================================
  // 2) Cargar productos relacionados por categoría
  // =========================================================
  useEffect(() => {
    const loadRelated = async () => {
      if (!product?.category?.id) return;

      const all = await getProducts();
      const filtered = all.filter(
        (p) => p.category?.id === product.category?.id && p.id !== product.id
      );

      setRelated(filtered);
    };

    loadRelated();
  }, [product]);

  // =========================================================
  // 3) Agregar al carrito
  // =========================================================
  const handleAddToCart = async () => {
    const userId = 1; // ← reemplazar luego

    if (!product) return;

    await CartItemService.addToCart(userId, product.id, quantity);
    alert("Producto agregado al carrito");
  };

  // =========================================================
  // Render
  // =========================================================
  //if (!product) 
    // return <p style={{ padding: 30 }}>Cargando producto...</p>;

  return (
    <div className={styles["product-page"]}>
      

      <main className={styles["main-content"]}>
        {/* Imagen */}
        <div className={styles["product-image"]}>
          <img
            src={product?.imageUrl ?? "/placeholder.png"}
            alt={product?.name}
          />
        </div>

        {/* Info */}
        <div className={styles["product-info"]}>
          <h2>{product?.name}</h2>

          <p className={styles.price}>
            Bs. {Number(product?.salePrice).toFixed(2)}
          </p>

          <p className={styles.description}>{product?.description}</p>

          <div className={styles["quantity-controls"]}>
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity((q) => q + 1)}>+</button>

            <button className={styles["add-btn"]} onClick={handleAddToCart}>
              🛒 Agregar al carrito
            </button>
          </div>

          <div className={styles.details}>
            <p>
              <strong>Tipo:</strong> {product?.unitOfMeasure ?? "Unidad"}
            </p>
            <p>
              <strong>Stock:</strong> {product?.physicalStock ?? "—"}
            </p>
          </div>
        </div>

        {/* Categoría */}
        <aside className={styles.categories}>
          <h3>Categoría</h3>
          <ul>
            <li className={styles.active}>
              {product?.category?.name ?? "Sin categoría"}
            </li>
          </ul>
        </aside>
      </main>

      {/* Productos Relacionados */}
      <section className={styles["related-products"]}>
        <h3>Productos Relacionados</h3>

        <div className={styles["related-grid"]}>
          {related.length === 0 && <p>No hay productos relacionados.</p>}

          {related.map((p) => (
            <div key={p.id} className={styles["related-card"]}>
              <img src={p.imageUrl ?? "/placeholder.png"} alt={p.name} />
              <h4>{p.name}</h4>
              <p>Bs. {Number(p.salePrice).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}
