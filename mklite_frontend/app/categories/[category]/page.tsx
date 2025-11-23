"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

// Servicios
import { CategoryService } from "@/app/services/category.service";
import { CartItemService } from "@/app/services/cartItem.service";

// Componentes
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

// Modelo UI para productos
type UIProduct = {
  id: number;
  name: string;
  price: number;
  img: string;
};

type SortOption =
  | "destacados"
  | "precio-asc"
  | "precio-desc"
  | "nombre-asc"
  | "nombre-desc";

export default function CategoriaDinamica() {
  const { category } = useParams<{ category: string }>();

  const [categoryBD, setCategoryBD] = useState<{
    id: number;
    name: string;
    description?: string;
  } | null>(null);

  const [productsBD, setProductsBD] = useState<UIProduct[]>([]);
  const [sidebarCats, setSidebarCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortOption, setSortOption] = useState<SortOption>("destacados");

 //  Cargar categorías y productos reales
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        // 1. Todas las categorías
        const allCats = await CategoryService.getAll();

        const mappedSidebar = allCats.map((c: any) => ({
          id: c.id,
          nombre: c.name,
          descripcion: c.description,
          url: c.name.toLowerCase().replace(/ /g, "-"),
        }));

        setSidebarCats(mappedSidebar);

        // 2. Determinar categoría actual por URL
        const found = mappedSidebar.find(
          (c) => c.url === category.toLowerCase()
        );

        if (!found) {
          setCategoryBD(null);
          return;
        }

        setCategoryBD({
          id: found.id,
          name: found.nombre,
          description: found.descripcion,
        });

        // 3. Productos REALES del backend
        // Cuando exista ProductService, lo activas:
        //
        // const productos = await ProductService.getByCategory(found.id);
        // setProductsBD(productos);

        // Por ahora: VACÍO, pero ya conectado
        setProductsBD([]);

      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [category]);

  // Categoría NO existe
  if (!categoryBD && !loading) {
    return (
      <main className={styles.page}>
        <Header />
        <div className={styles.inner}>
          <h1 style={{ padding: 50 }}>
            La categoría "{category}" no existe aún.
          </h1>
        </div>
        <Footer />
      </main>
    );
  }

 // ORDENAMIENTO
 const sortProducts = (list: UIProduct[]) => {
    const copy = [...list];

    switch (sortOption) {
      case "precio-asc":
        return copy.sort((a, b) => a.price - b.price);
      case "precio-desc":
        return copy.sort((a, b) => b.price - a.price);
      case "nombre-asc":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "nombre-desc":
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return copy;
    }
  };

  const sortedProducts = sortProducts(productsBD);
  const totalItems = sortedProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const products = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");

      pages.push(totalPages);
    }

    return pages;
  };

  // RENDER
  return (
    <main className={styles.page}>
      <Header />

      <div className={styles.inner}>

        {/* BANNER */}
        <section className={styles.banner}>
          <div className={styles.breadcrumb}>
            <a href="/">Inicio</a> /{" "}
            <span>{categoryBD?.name}</span>
          </div>
          <h2 className={styles.bannerTitle}>{categoryBD?.name}</h2>
        </section>

        {/* MAIN */}
        <section className={styles.main}>

          {/* SIDEBAR */}
          <aside className={styles.sidebar}>
            <h3>Categorías</h3>
            <hr />

            <ul>
              {sidebarCats.map((cat) => (
                <li
                  key={cat.id}
                  className={styles.categoriaItem}
                  onClick={() =>
                    (window.location.href = `/categories/${cat.url}`)
                  }
                >
                  <div className={styles.itemLeft}>{cat.nombre}</div>
                  <span className={styles.itemCount}>—</span>
                </li>
              ))}
            </ul>
          </aside>

          {/* PRODUCTOS */}
          <div className={styles.productos}>
            <div className={styles.topBar}>
              <p className={styles.topText}>
                Encontramos{" "}
                <span className={styles.topTextNumber}>{totalItems}</span>{" "}
                ítems para ti!
              </p>

              {/* FILTROS */}
              <div className={styles.filters}>
                <div className={styles.filterButton}>
                  <span>▦</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div className={styles.filterButton}>
                  <span>⇅</span>
                  <select
                    value={sortOption}
                    onChange={(e) => {
                      setSortOption(e.target.value as SortOption);
                      setCurrentPage(1);
                    }}
                    className={styles.filterSelect}
                  >
                    <option value="destacados">Destacados</option>
                    <option value="precio-asc">Precio: menor a mayor</option>
                    <option value="precio-desc">Precio: mayor a menor</option>
                    <option value="nombre-asc">Nombre A–Z</option>
                    <option value="nombre-desc">Nombre Z–A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* GRID */}
            <div className={styles.grid}>
              {products.length === 0 && (
                <p style={{ padding: 20 }}>
                  No hay productos en esta categoría.
                </p>
              )}

              {products.map((p) => (
                <article key={p.id} className={styles.card}>
                  <img src={p.img} alt={p.name} className={styles.cardImage} />
                  <h4 className={styles.cardTitle}>{p.name}</h4>
                  <p className={styles.cardSubtitle}>1 kg</p>
                  <p className={styles.precio}>Bs. {p.price.toFixed(2)}</p>

                  <button
                    className={styles.btn}
                    onClick={async () => {
                      try {
                        await CartItemService.addToCart(1, p.id, 1);
                        alert("Añadido al carrito!");
                      } catch {
                        alert("Error al añadir.");
                      }
                    }}
                  >
                    🛒 Add
                  </button>
                </article>
              ))}
            </div>

            {/* PAGINACIÓN */}
            <div className={styles.paginacion}>
              <button
                className={styles.pageControl}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                «
              </button>

              {getPageNumbers().map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`e-${idx}`} className={styles.pageEllipsis}>…</span>
                ) : (
                  <button
                    key={item}
                    className={`${styles.pageDot} ${
                      currentPage === item ? styles.activo : ""
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                »
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
