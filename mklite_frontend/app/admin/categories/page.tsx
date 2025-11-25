"use client";

import { useEffect, useState } from "react";
import HeaderAdmin from "../../components/HeaderAdmin";
import styles from "./page.module.css";

import { CategoryService } from "@/app/services/category.service";
import { categoryIcons, defaultIcon } from "@/app/utils/categoryIcons";
import { ProductService } from "@/app/services/product.service";


export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStock, setFilterStock] = useState("all");
  const [loadingDelete, setLoadingDelete] = useState<number | null>(null);

  // Cargar categorías
  useEffect(() => {
    async function loadCats() {
      const res = await CategoryService.getAll();
      setCategories(res);
    }
    loadCats();
  }, []);

  // Cargar productos según categoría
  useEffect(() => {
    if (selectedCategory === null) return;

    async function loadProducts() {
      const res = await ProductService.getByCategory(Number(selectedCategory));

      const mapped = res.map((p: any) => ({
        id: p.id,
        name: p.name,
        date: p.createdAt?.slice(0, 10) || "—",
        stock: p.physicalStock,
        img: p.imageUrl || "/productos/default.png",
      }));

      setProducts(mapped);
    }

    loadProducts();
  }, [selectedCategory]);

  // ELIMINAR PRODUCTO
  const handleDelete = async (id: number) => {
    const ok = confirm("¿Seguro que deseas eliminar este producto?");
    if (!ok) return;

    try {
      setLoadingDelete(id);

      await ProductService.delete(id);

      // Quitar de tabla
      setProducts(prev => prev.filter(p => p.id !== id));

      alert("Producto eliminado correctamente.");
    } catch (err) {
      alert("Error al eliminar el producto.");
      console.error(err);
    } finally {
      setLoadingDelete(null);
    }
  };

  // FILTROS
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const finalProducts =
    filterStock === "out"
      ? filteredProducts.filter(p => p.stock <= 0)
      : filteredProducts;

  const renderCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName] || defaultIcon;
    return <IconComponent size={32} />;
  };

  return (
    <div className={styles.wrapper}>
      {/*<HeaderAdmin />*/}

      <main className={styles.main}>
        <h1 className={styles.welcome}>Bienvenido Pepe</h1>
        <h2 className={styles.subtitle}>Explorar</h2>

        {/* CATEGORÍAS */}
        <section className={styles.categories}>
          {categories.map(cat => (
            <div
              key={cat.id}
              className={styles.card}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                border:
                  selectedCategory === cat.id
                    ? "2px solid red"
                    : "1px solid transparent",
              }}
            >
              <div className={styles.iconContainer}>
                {renderCategoryIcon(cat.name)}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </section>

        {/* TABLA */}
        <section className={styles.tableBox}>
          <div className={styles.tabs}>
            <button
              className={filterStock === "all" ? styles.active : ""}
              onClick={() => setFilterStock("all")}
            >
              Todos ({products.length})
            </button>

            <button
              className={filterStock === "out" ? styles.active : ""}
              onClick={() => setFilterStock("out")}
            >
              Fuera de Stock
            </button>
          </div>

          <div className={styles.search}>
            <input
              placeholder="Buscar Producto"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Fecha de Registro</th>
                <th>Stock</th>
                <th>Acción</th>
              </tr>
            </thead>

            <tbody>
              {finalProducts.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 20 }}>
                    No hay productos en esta categoría.
                  </td>
                </tr>
              )}

              {finalProducts.map(p => (
                <tr key={p.id}>
                  <td>#{p.id}</td>

                  <td>
                    <div className={styles.product}>
                      <img src={p.img} />
                      <span>{p.name}</span>
                    </div>
                  </td>

                  <td>{p.date}</td>
                  <td>{p.stock}</td>

                  <td>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        cursor: "pointer",
                        background: "none",
                        border: "none",
                        fontSize: "18px",
                      }}
                    >
                      {loadingDelete === p.id ? "⏳" : "🗑️"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
