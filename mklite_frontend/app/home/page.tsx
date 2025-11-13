"use client";

import Header from "./components/header";
import Footer from "./components/footer";
import Benefits from "./components/benefits";
import ProductShowcase from "./components/productShowcase";
import ProductCard from "./components/productCard";
import CategoryCard from "./components/categoryCard";

// Importa los iconos que usarás para las categorías
import { GiMilkCarton, GiMeat, GiCarrot, GiFruitBowl, GiChipsBag, GiDrinkMe } from 'react-icons/gi';

import ProductCardModel from "../models/productCard.model";
import CategoryCardModel from "../models/categoryCard.model";

import styles from "./page.module.css";

export default function HomePage() {
  //CATEGORIAS
  const categories: CategoryCardModel[] = [
  { id: 1, name: "Lácteos", IconComponent: GiMilkCarton },
  { id: 2, name: "Carnes", IconComponent: GiMeat },
  { id: 3, name: "Verduras", IconComponent: GiCarrot },
  { id: 4, name: "Frutas", IconComponent: GiFruitBowl },
  { id: 5, name: "Snacks", IconComponent: GiChipsBag },
  { id: 6, name: "Bebidas", IconComponent: GiDrinkMe },
];

  // 🔹 Productos populares 
  const popularProducts: ProductCardModel[] = [
    {
      name: "Leche Pil 1L",
      description: "Leche entera fresca de 1 litro.",
      price: 7.5,
      imageUrl: "/products/leche.jpg",
      discount: 10,
    },
     {
      name: "Galletas Oreo",
      description: "Paquete de galletas 12 unidades",
      price: 10,
      imageUrl: "/products/oreo.jpg",
      discount: 5,
    },
    {
      name: "Huevos frescos 12u",
      description: "Docena de huevos seleccionados.",
      price: 12,
      imageUrl: "/products/huevos.jpg",
    },
    {
      name: "Jamon Serrano",
      description: "Paquete de 24 unidades.",
      price: 20,
      imageUrl: "/products/jamon.jpg",
    },
    {
      name: "Yogurt natural",
      description: "Yogurt sin azúcar añadido.",
      price: 8,
      imageUrl: "/products/yogurt.jpg",
      discount: 5,
    },
    {
      name: "Queso criollo",
      description: "Queso artesanal 500g.",
      price: 20,
      imageUrl: "/products/queso.jpg",
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
              <CategoryCard key={cat.id} name={cat.name} IconComponent={cat.IconComponent} />
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







