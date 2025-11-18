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

// Iconos locales
import { categoryIcons, defaultIcon } from "../utils/categoryIcons";

export default function HomePage() {
  
  // 🔹 Estado para categorías cargadas desde el backend
  const [categories, setCategories] = useState<CategoryCardModel[]>([]);

  // ===================================================================
  // 🔥 CARGAR CATEGORÍAS DESDE BACKEND
  // ===================================================================
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await CategoryService.getAll();

        // Asignar icono desde categoryIcons según el nombre
        const mapped = data.map((cat: CategoryCardModel) => ({
          ...cat,
          IconComponent: categoryIcons[cat.nombre] ?? defaultIcon
        }));

        setCategories(mapped);
      } catch (error) {
        console.error("❌ Error cargando categorías:", error);
      }
    };

    loadCategories();
  }, []);

  // ===================================================================
  // 🔹 Productos populares (tú ya tenías esto, NO TOQUÉ NADA)
  // ===================================================================
  const popularProducts: ProductCardModel[] = [
    {
      id: 1,
      nombre: "Leche Pil 1L",
      descripcion: "Leche entera fresca de 1 litro.",
      precioVenta: 7.5,
      urlImagen: "/products/leche.jpg",
      discount: 10,
      unidadMedida: "Litro",
      stockFisico: 100,
      stockReservado: 20,
      isActive: true,
      categoria: {
        id: 1,
        nombre: "Lácteos",
        descripcion: "Productos lácteos variados.",
        IconComponent: categoryIcons["Lácteos"],
      },
    },
    {
      id: 2,
      nombre: "Galletas Oreo",
      descripcion: "Paquete de galletas 12 unidades",
      precioVenta: 10,
      urlImagen: "/products/oreo.jpg",
      discount: 5,
      unidadMedida: "Paquete",
      stockFisico: 50,
      stockReservado: 5,
      isActive: true,
      categoria: {
        id: 5,
        nombre: "Snacks",
        descripcion: "Aperitivos y snacks variados.",
        IconComponent: categoryIcons["Snacks"],
      },
    },
    {
      id: 3,
      nombre: "Huevos frescos 12u",
      descripcion: "Docena de huevos seleccionados.",
      precioVenta: 12,
      urlImagen: "/products/huevos.jpg",
      unidadMedida: "Docena",
      stockFisico: 200,
      stockReservado: 30,
      isActive: true,
      categoria: {
        id: 2,
        nombre: "Carnes",
        descripcion: "Carnes frescas y procesadas.",
        IconComponent: categoryIcons["Carnes"],
      },
    },
    {
      id: 4,
      nombre: "Jamon Serrano",
      descripcion: "Paquete de 24 unidades.",
      precioVenta: 20,
      urlImagen: "/products/jamon.jpg",
      discount: 15,
      unidadMedida: "Paquete",
      stockFisico: 24,
      stockReservado: 0,
      isActive: true,
      categoria: {
        id: 2,
        nombre: "Carnes",
        descripcion: "Carnes frescas y procesadas.",
        IconComponent: categoryIcons["Carnes"],
      },
    },
    {
      id: 5,
      nombre: "Yogurt natural",
      descripcion: "Yogurt sin azúcar añadido.",
      precioVenta: 8,
      urlImagen: "/products/yogurt.jpg",
      discount: 5,
      unidadMedida: "Vaso",
      stockFisico: 80,
      stockReservado: 10,
      isActive: true,
      categoria: {
        id: 1,
        nombre: "Lácteos",
        descripcion: "Productos lácteos variados.",
        IconComponent: categoryIcons["Lácteos"],
      },
    },
    {
      id: 6,
      nombre: "Queso criollo",
      descripcion: "Queso artesanal 500g.",
      precioVenta: 20,
      urlImagen: "/products/queso.jpg",
      unidadMedida: "Paquete",
      stockFisico: 40,
      stockReservado: 5,
      isActive: true,
      categoria: {
        id: 1,
        nombre: "Lácteos",
        descripcion: "Productos lácteos variados.",
        IconComponent: categoryIcons["Lácteos"],
      },
    },
  ];

  // ===================================================================
  // 🔹 RETURN
  // ===================================================================
  return (
    <>
      <Header />

      <main className={styles.main}>

        {/* ================================================================= */}
        {/* 🔹 SECCIÓN: Productos Populares */}
        {/* ================================================================= */}
        <section id="productos" className={styles.productsSection}>
          <h2>Productos Populares</h2>
          <div className={styles.productsGrid}>
            {popularProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 🔹 SECCIÓN: Categorías */}
        {/* ================================================================= */}
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

        {/* ================================================================= */}
        {/* Showcase + Benefits (SIN CAMBIAR NADA) */}
        {/* ================================================================= */}
        <ProductShowcase />
        <Benefits />

      </main>

      <Footer />
    </>
  );
}










