"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

import type ProductoCardModel from "@/app/models/productCard.model";
import { getProductById, getProducts} from "@/app/services/product.service";

import { CartItemService } from "@/app/services/cartItem.service";
import { useParams } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const productId = Number(params.id); // /product/12 → id = 12

  const [product, setProduct] = useState<ProductoCardModel | null>(null);
  const [related, setRelated] = useState<ProductoCardModel[]>([]);
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
      if (!product?.categoria?.id) return;

      const all = await getProducts();
      const filtered = all.filter(
        (p) => p.categoria?.id === product.categoria?.id && p.id !== product.id
      );

      setRelated(filtered);
    };

    loadRelated();
  }, [product]);

  // =========================================================
  // 3) Agregar al carrito
  // =========================================================
  const handleAddToCart = async () => {
    const userId = 1; // ← reemplazar por usuario real logueado

    if (!product) return;

    await CartItemService.addToCart(userId, product.id, quantity);
    alert("Producto agregado al carrito");
  };

  // =========================================================
  // Render
  // =========================================================
  if (product)
   // return <p style={{ padding: 30 }}>Cargando producto...</p>;

  return (
    <div className={styles['product-page']}>
      {/* HEADER GLOBAL */}
       <Header />

      <main className={styles["main-content"]}>
        {/* Imagen */}
        <div className={styles["product-image"]}>
          <img
            src={product.urlImagen ?? "/placeholder.png"}
            alt={product.nombre}
          />
        </div>

        {/* Info */}
        <div className={styles["product-info"]}>
          <h2>{product.nombre}</h2>

          <p className={styles.price}>
            Bs. {Number(product.precioVenta).toFixed(2)}
          </p>

          <p className={styles.description}>{product.descripcion}</p>

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
              <strong>Tipo:</strong> {product.unidadMedida ?? "Unidad"}
            </p>
            <p>
              <strong>Stock:</strong> {product.stockFisico ?? "—"}
            </p>
          </div>
        </div>

        {/* Categorías */}
        <aside className={styles.categories}>
          <h3>Categoría</h3>
          <ul>
            <li className={styles.active}>
              {product.categoria?.name ?? "Sin categoría"}
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
              <img
                src={p.urlImagen ?? "/placeholder.png"}
                alt={p.nombre}
              />
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
