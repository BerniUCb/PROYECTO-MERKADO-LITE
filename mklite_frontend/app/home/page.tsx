"use client";

import React, { useEffect, useState } from "react";

import Benefits from "./components/benefits";
import ProductShowcase from "./components/productShowcase";
import ProductCard from "./components/productCard";
import CategoryCard from "./components/categoryCard";

import ProductModel from "../models/productCard.model";
import CategoryCardModel from "../models/categoryCard.model";

import styles from "./page.module.css";

// Servicios
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";

// Iconos locales
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";

// ❌ Ya no usamos Header/Footer/UserSidebar aquí,
// el layout global (LayoutShell) los renderiza.
export default function HomePage() {
  // 🔹 Estado para categorías
  const [categories, setCategories] = useState<CategoryCardModel[]>([]);

  // 🔹 Estado para productos reales desde backend (paginados)
  const [products, setProducts] = useState<ProductModel[]>([]);

  // 🔹 Estado de paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ================================================================
  //  CARGAR CATEGORÍAS DESDE BACKEND
  // ================================================================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await CategoryService.getAll();

        const mapped = data.map((cat: CategoryCardModel) => ({
          ...cat,
          IconComponent: categoryIcons[cat.name] ?? defaultIcon,
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      }
    };

    loadCategories();
  }, []);

  // ================================================================
  //  CARGAR PRODUCTOS DESDE BACKEND (PAGINADOS)
  // ================================================================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { products, totalPages } = await ProductService.getPaginated(
          page,
          15
        );

        const mapped = products.map((p: ProductModel) => ({
          ...p,
          imageUrl: p.imageUrl ?? "/products/no-image.png",
        }));

        setProducts(mapped);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("❌ Error cargando productos paginados:", error);
      }
    };

    loadProducts();
  }, [page]);

  // ================================================================
  //  RETURN
  // ================================================================
  return (
    <main className={styles.main}>
      {/* 🔹 SECCIÓN: Productos */}
      <section id="productos" className={styles.productsSection}>
        <h2>Productos</h2>

        <div className={styles.productsGrid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* 🔹 PAGINACIÓN */}
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            ◀ Anterior
          </button>

          <span>
            Página {page} de {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Siguiente ▶
          </button>
        </div>
      </section>

      {/* 🔹 SECCIÓN: Categorías */}
      <section id="categorias" className={styles.categoriesSection}>
        <h2>Categorías</h2>

        <div className={styles.categoriesGrid}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={(cat.name ?? "sin-nombre")
                .toLowerCase()
                .replace(/ /g, "-")}
              IconComponent={cat.IconComponent!}
            />
          ))}
        </div>
      </section>

      {/* Showcase + Benefits */}
      <ProductShowcase />
      <Benefits />
    </main>
  );
}
