"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { CategoryService } from "@/app/services/category.service";

// Sidebar fijo (igual al diseño)
const categoriasSidebar = [
  { id: "abarrotes", nombre: "Abarrotes", icono: "/icons/abarrotes.svg", count: 2 },
  { id: "bebidas", nombre: "Bebidas", icono: "/icons/bebidas.svg", count: 2 },
  { id: "frutas", nombre: "Frutas", icono: "/icons/frutas.svg", count: 2 },
  { id: "vegetales", nombre: "Vegetales", icono: "/icons/verduras.svg", count: 2 },
  { id: "mariscos", nombre: "Mariscos", icono: "/icons/mariscos.svg", count: 2 },
  { id: "snacks", nombre: "Snack y golosinas", icono: "/icons/snacks.svg", count: 2 },
  { id: "lacteos", nombre: "Lácteos y derivados", icono: "/icons/lacteos.svg", count: 2 },
  { id: "mascotas", nombre: "Mascotas", icono: "/icons/mascotas.svg", count: 2 },
];

// Datos de ejemplo mientras el backend esté vacío
const dataCategorias = {
  vegetales: {
    titulo: "Vegetales",
    productos: Array.from({ length: 29 }).map(() => ({
      nombre: "Pimentón Verde 1 kg",
      precio: 15.0,
      img: "/images/pimiento.png",
    })),
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
} as const;

type SortOption = "destacados" | "precio-asc" | "precio-desc" | "nombre-asc" | "nombre-desc";

export default function CategoriaDinamica() {
  const { category } = useParams<{ category: string }>();

  const [categoriaBD, setCategoriaBD] = useState<any>(null);
  const [productosBD, setProductosBD] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 estados para mostrar / ordenar / paginar
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<SortOption>("destacados");

  // Cargar categorías desde el backend
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const categorias = await CategoryService.getAll();

        const encontrada = categorias.find(
          (c: any) =>
            c.nombre?.toLowerCase() === category.toLowerCase()
        );

        if (encontrada) {
          setCategoriaBD(encontrada);

          // FUTURO: pedir productos reales por categoría
          // const productos = await ProductService.getByCategory(encontrada.id);
          // setProductosBD(productos);
        }
      } catch (error) {
        console.error("Error al cargar categoría:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  const datosLocal =
    dataCategorias[category as keyof typeof dataCategorias];

  const titulo = categoriaBD?.nombre || datosLocal?.titulo || "Categoría";

  const productosBase =
    productosBD.length > 0
      ? productosBD.map((p) => ({
          nombre: p.nombre,
          precio: p.precio,
          img: p.imagen || "/images/pimiento.png",
        }))
      : datosLocal
      ? datosLocal.productos
      : [];

  // 🔹 función para ordenar productos según opción elegida
  function ordenarProductos(lista: typeof productosBase) {
    const copia = [...lista];

    switch (sortOption) {
      case "precio-asc":
        copia.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        copia.sort((a, b) => b.precio - a.precio);
        break;
      case "nombre-asc":
        copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nombre-desc":
        copia.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case "destacados":
      default:
        // por ahora no hacemos nada especial
        break;
    }

    return copia;
  }

  const productosOrdenados = ordenarProductos(productosBase);

  const totalItems = productosOrdenados.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // si cambio itemsPerPage y la página actual queda fuera de rango, la ajusto
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productos = productosOrdenados.slice(startIndex, endIndex);

  if (!datosLocal && !categoriaBD && !loading) {
    return (
      <main className={styles.page}>
        <div className={styles.inner}>
          <h1 style={{ padding: 50 }}>
            La categoría "{category}" no existe aún.
          </h1>
        </div>
      </main>
    );
  }

  // 🔹 lógica para pintar los números de página con "…"
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* BANNER */}
        <section className={styles.banner}>
          <div className={styles.breadcrumb}>
            <a href="/">Inicio</a> / <span>{titulo}</span>
          </div>
          <h2 className={styles.bannerTitle}>{titulo}</h2>
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
                  onClick={() =>
                    (window.location.href = `/categories/${cat.id}`)
                  }
                >
                  <div className={styles.itemLeft}>
                    <img src={cat.icono} width={24} height={24} alt={cat.nombre} />
                    {cat.nombre}
                  </div>
                  <span className={styles.itemCount}>{cat.count}</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* ZONA PRODUCTOS */}
          <div className={styles.productos}>
            {/* Barra superior: texto + filtros */}
            <div className={styles.topBar}>
              <p className={styles.topText}>
                Encontramos{" "}
                <span className={styles.topTextNumber}>{totalItems}</span>{" "}
                ítems para ti!
              </p>

              <div className={styles.filters}>
                {/* Mostrar: */}
                <div className={styles.filterButton}>
                  <span className={styles.filterIcon}>▦</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value={12}>Mostrar: 12</option>
                    <option value={24}>Mostrar: 24</option>
                    <option value={50}>Mostrar: 50</option>
                    <option value={100}>Mostrar: 100</option>
                  </select>
                </div>

                {/* Ordenar por: */}
                <div className={styles.filterButton}>
                  <span className={styles.filterIcon}>⇅</span>
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      setCurrentPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="destacados">Ordenar por: Destacados</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="nombre-asc">Nombre: A–Z</option>
                    <option value="nombre-desc">Nombre: Z–A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid de productos */}
            <div className={styles.grid}>
              {productos.map((p, i) => (
                <article key={i} className={styles.card}>
                  <img
                    src={p.img || "/images/pimiento.png"}
                    alt={p.nombre}
                    className={styles.cardImage}
                  />
                  <h4 className={styles.cardTitle}>{p.nombre}</h4>
                  <p className={styles.cardSubtitle}>1 kg</p>
                  <p className={styles.precio}>Bs. {p.precio.toFixed(2)}</p>
                  <button className={styles.btn}>🛒 Add</button>
                </article>
              ))}
            </div>

            {/* Paginación */}
            <div className={styles.paginacion}>
              <button
                className={styles.pageControl}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                &laquo;
              </button>

              {getPageNumbers().map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`e-${idx}`} className={styles.pageEllipsis}>
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    className={`${styles.pageDot} ${
                      item === currentPage ? styles.activo : ""
                    }`}
                    onClick={() => setCurrentPage(item as number)}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                className={styles.pageControl}
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                &raquo;
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
