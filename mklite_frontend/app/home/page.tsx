"use client";

import React from "react";
import Benefits from "./components/benefits";
import ProductShowcase from "./components/productShowcase";
import ProductCard from "./components/productCard";
import CategoryCard from "./components/categoryCard";

// Importa los iconos que usarás para las categorías
import { GiMilkCarton, GiMeat, GiCarrot, GiFruitBowl, GiChipsBag, GiDrinkMe, GiBroom } from 'react-icons/gi';

import ProductCardModel from "../models/productCard.model";
import CategoryCardModel from "../models/categoryCard.model";

import styles from "./page.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  //CATEGORIAS
  const categories: CategoryCardModel[] = [
  { id: 1, name: "Lácteos", slug: "lacteos", IconComponent: GiMilkCarton },
  { id: 2, name: "Carnes", slug: "carnes", IconComponent: GiMeat },
  { id: 3, name: "Verduras", slug: "vegetales", IconComponent: GiCarrot },
  { id: 4, name: "Frutas", slug: "frutas", IconComponent: GiFruitBowl },
  { id: 5, name: "Snacks", slug: "snacks", IconComponent: GiChipsBag },
  { id: 6, name: "Bebidas", slug: "bebidas", IconComponent: GiDrinkMe },
];


  // 🔹 Productos populares 
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
        name: "Lácteos",
        slug: "lacteos",
        IconComponent: GiMilkCarton,
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
        name : "Snacks",
        slug: "snacks",
        IconComponent: GiChipsBag,
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
        name: "Carnes",
        slug: "carnes",
        IconComponent: GiMeat,
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
        name: "Carnes",
        slug: "carnes",
        IconComponent: GiMeat,
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
        name: "Lácteos",
        slug: "lacteos",
        IconComponent: GiMilkCarton,
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
        name: "Lácteos",
        slug: "lacteos",
        IconComponent: GiMilkCarton,
      },
    },
  ];

  return (
    <>
      
    <Header />
      <main className={styles.main}>
        {/* 🔹 SECCIÓN: Productos populares */}
        <section id="productos" className={styles.productsSection}>
          <h2>Productos Populares</h2>
          <div className={styles.productsGrid}>
            {popularProducts.map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </section>

        {/* 🔹 SECCIÓN: Categorías */}
        <section id="categorias" className={styles.categoriesSection}>
          <h2>Categorías</h2>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              // Cambié para que pase IconComponent en vez de category completa
             <CategoryCard
                  key={cat.id}
                  name={cat.name}
                  slug={cat.slug}
                  IconComponent={cat.IconComponent}
                />

            ))}
          </div>
        </section>

        {/* 🔹 SECCIÓN: Showcase (más vendidos, nuevos, mejor calificados) */}
        <ProductShowcase />

        {/* 🔹 SECCIÓN: Beneficios */}
        <Benefits />
      </main>
       <Footer />
      
    </>
  );
}









