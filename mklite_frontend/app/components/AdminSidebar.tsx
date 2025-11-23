"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const renderItem = (item: AdminMenuItem) => {
    // 👇 lógica de activación
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

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.list}>{mainItems.map(renderItem)}</ul>

      <div className={styles.sectionTitle}>Product</div>
      <ul className={styles.list}>{productItems.map(renderItem)}</ul>
    </aside>
  );
}
