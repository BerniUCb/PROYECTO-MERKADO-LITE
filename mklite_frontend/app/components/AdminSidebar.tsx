"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./AdminSidebar.module.css";

type AdminMenuItem = {
  label: string;
  href: string;
  icon: string;
};

const mainItems: AdminMenuItem[] = [
  {
    label: "Panel de Control",
    href: "/admin",
    icon: "/admin-menu/home.svg",
  },
  {
    label: "Manejo de Pedidos",
    href: "/admin/orders",
    icon: "/admin-menu/orders.svg",
  },
  {
    label: "Clientes",
    href: "/admin/customers",
    icon: "/admin-menu/customers.svg",
  },
  {
    label: "Ventas en tienda",
    href: "/admin/pos", // ← ruta sugerida para el módulo de ventas físicas
    icon: "/admin-menu/ventaEnTienda.svg",
  },
  {
    label: "Repartidores",
    href: "/admin/riders",
    icon: "/admin-menu/repartidores.svg",
  },
  {
    label: "Gestión de usuarios",
    href: "/admin/userDetail", 
    icon: "/admin-menu/gestiondeUsuarios.svg",
  },
  {
    label: "Categorias",
    href: "/admin/categories",
    icon: "/admin-menu/categories.svg",
  },
];

const productItems: AdminMenuItem[] = [
  {
    label: "Añadir Producto",
    href: "/admin/products/new",
    icon: "/admin-menu/add-product.svg",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const renderItem = (item: AdminMenuItem) => {
    const isRootAdmin = item.href === "/admin";
    const isActive = isRootAdmin
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <li
        key={item.href}
        className={isActive ? styles.itemActive : styles.item}
      >
        <Link href={item.href} className={styles.link}>
          <span className={styles.iconWrapper}>
            <Image src={item.icon} alt={item.label} width={18} height={18} />
          </span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      </li>
    );
  };

  // LOGOUT
  const handleLogout = () => {
    // Por ahora solo redirigimos (luego lo conectamos con auth real)
    router.push("/home");
  };

  return (
    <aside className={styles.sidebar}>
      {/* Parte superior: menús */}
      <div className={styles.menuSection}>
        <ul className={styles.list}>{mainItems.map(renderItem)}</ul>

        <div className={styles.sectionTitle}>Product</div>
        <ul className={styles.list}>{productItems.map(renderItem)}</ul>
      </div>

      {/* Logout abajo */}
      <div className={styles.logoutSection}>
        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <span className={styles.iconWrapper}>
            <Image
              src="/admin-menu/logOut.svg"
              alt="Cerrar sesión"
              width={18}
              height={18}
            />
          </span>
          <span className={styles.label}>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
