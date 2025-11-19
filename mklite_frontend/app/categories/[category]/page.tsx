"use client";

import { useParams } from "next/navigation";
import styles from "./page.module.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";


// LISTA COMPLETA DEL SIDEBAR
const categoriasSidebar = [
  { id: "abarrotes", nombre: "Abarrotes", icono: "/icons/abarrotes.svg", count: 2 },
  { id: "bebidas", nombre: "Bebidas", icono: "/icons/bebidas.svg", count: 2 },
  { id: "frutas", nombre: "Frutas", icono: "/icons/frutas.svg", count: 2 },
  { id: "vegetales", nombre: "Verduras", icono: "/icons/verduras.svg", count: 2 },
  { id: "mariscos", nombre: "Mariscos", icono: "/icons/mariscos.svg", count: 2 },
  { id: "snacks", nombre: "Snack y golosinas", icono: "/icons/snacks.svg", count: 2 },
  { id: "lacteos", nombre: "Lácteos y derivados", icono: "/icons/lacteos.svg", count: 2 },
  { id: "mascotas", nombre: "Mascotas", icono: "/icons/mascotas.svg", count: 2 },
];

// PRODUCTOS DE CADA CATEGORÍA ----- agregar total 6 
const dataCategorias = {
  vegetales: {
    titulo: "Vegetales",
    productos: [
      { nombre: "Pimiento Verde 1kg", precio: 15.0, img: "/images/pimiento.png" },
      { nombre: "Brócoli 1kg", precio: 32.85, img: "/images/brocoli.png" },
      { nombre: "Lechuga Romana", precio: 10.5, img: "/images/lechuga.png" },
      { nombre: "Zanahoria 1kg", precio: 8.75, img: "/images/zanahoria.png" },
    ],
  },

  frutas: {
    titulo: "Frutas",
    productos: [
      { nombre: "Manzana Roja 1kg", precio: 12, img: "/images/manzana.png" },
      { nombre: "Banana 1kg", precio: 7.5, img: "/images/banana.png" },
      { nombre: "Piña 1kg", precio: 14, img: "/images/pina.png" },
    ],
  },

  bebidas: {
    titulo: "Bebidas",
    productos: [
      { nombre: "Coca Cola 2L", precio: 12, img: "/images/cocacola.png" },
      { nombre: "Fanta 2L", precio: 11, img: "/images/fanta.png" },
      { nombre: "Sprite 2L", precio: 11, img: "/images/sprite.png" },
    ],
  },
};


export default function CategoriaDinamica() {
  const { category } = useParams<{ category: keyof typeof dataCategorias }>();
  const categoria = dataCategorias[category];

  // Si la categoría no existe
  if (!categoria) {
    return <h1 style={{ padding: "50px" }}>Categoría no encontrada</h1>;
  }

  return (
    <>
      {/* HEADER GLOBAL */}
      <Header />

      <main>
        {/* BANNER */}
      <section className={styles.banner}>
        <div className={styles.breadcrumb}>
          <a href="/">Inicio</a> &gt; <span>{categoria.titulo}</span>
        </div>
      </section>

      

      {/* CONTENIDO PRINCIPAL */}
      <section className={styles.main}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <h3>Categorías</h3>
          <hr />

          <ul>
            {categoriasSidebar.map((cat) => (
              <li
                key={cat.id}
                className={styles.categoriaItem}
                onClick={() => (window.location.href = `/categories/${cat.id}`)}
              >
                <div className={styles.itemLeft}>
                  <img src={cat.icono} width="25" />
                  {cat.nombre}
                </div>
                <span className={styles.itemCount}>{cat.count}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* PRODUCTOS */}
        <div className={styles.productos}>
          <h3 className={styles.titulo}>
            Encontramos {categoria.productos.length} productos
          </h3>

          <div className={styles.grid}>
            {categoria.productos.map((p, i) => (
              <div key={i} className={styles.card}>
                <img src={p.img} alt={p.nombre} />
                <h4>{p.nombre}</h4>
                <p className={styles.precio}>Bs. {p.precio.toFixed(2)}</p>
                <button className={styles.btn}>🛒 Add</button>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div className={styles.paginacion}>
            <button>&laquo;</button>
            <button className={styles.activo}>1</button>
            <button>2</button>
            <button>3</button>
            <button>&raquo;</button>
          </div>
        </div>

      </section>

      <Footer />
    </main>
      {/* FOOTER GLOBAL */}
      <Footer />
    </>
  );
}
