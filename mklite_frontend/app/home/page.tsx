"use client";

import React, { useEffect, useState } from "react";

import Benefits from "./components/benefits";
import ProductShowcase from "./components/productShowcase";
import ProductCard from "./components/productCard";
import CategoryCard from "./components/categoryCard";

import ProductCardModel from "../models/productCard.model";
import CategoryCardModel from "../models/categoryCard.model";

import Header from "../components/Header";
import Footer from "../components/Footer";

import styles from "./page.module.css";

// Servicios
import { CategoryService } from "../services/category.service";
//import { ProductService } from "../services/product.service";

// Iconos locales
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";

export default function HomePage() {
  // 🔹 Estado para categorías
  const [categories, setCategories] = useState<CategoryCardModel[]>([]);

  // 🔹 Estado para productos reales desde backend
  const [products, setProducts] = useState<ProductCardModel[]>([]);

  // ================================================================
  // 🔥 CARGAR CATEGORÍAS DESDE BACKEND (NO SE TOCA NADA AQUÍ)
  // ================================================================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await CategoryService.getAll();

        const mapped = data.map((cat: CategoryCardModel) => ({
          ...cat,
          IconComponent: categoryIcons[cat.nombre] ?? defaultIcon,
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      }
    };

    loadCategories();
  }, []);

  
  //  CARGAR PRODUCTOS DESDE BACKEND 
  
 /* useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await ProductService.getProducts();

        // 🔄 Asegurar que haya imagen o colocar placeholder
        const mapped = data.map((p: ProductCardModel) => ({
          ...p,
          urlImagen: p.urlImagen ?? "/products/no-image.png",
        }));

        setProducts(mapped);
      } catch (error) {
        console.error("❌ Error cargando productos:", error);
      }
    };

    loadProducts();
  }, []);*/


  //  RETURN
  
  return (
    <>
      <Header />

      <main className={styles.main}>

        {/* 🔹 SECCIÓN: Productos desde el BACKEND */}
      
        <section id="productos" className={styles.productsSection}>
          <h2>Productos</h2>

          <div className={styles.productsGrid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

       
        {/* 🔹 SECCIÓN: Categorías  */}
       
        <section id="categorias" className={styles.categoriesSection}>
          <h2>Categorías</h2>

          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.nombre}
                slug={cat.nombre.toLowerCase()}
                IconComponent={cat.IconComponent!}
              />
            ))}
          </div>
        </section>

      
        {/* Showcase + Benefits  */}
        
        <ProductShowcase />
        <Benefits />

      </main>

      <Footer />
    </>
  );
}











