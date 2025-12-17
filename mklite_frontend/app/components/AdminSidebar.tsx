"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/utils/logout";
import styles from "./AdminSidebar.module.css";

type AdminMenuItem = {
  label: string;
  href: string;
  icon: string;
};

const mainItems: AdminMenuItem[] = [
  { label: "Panel de Control", href: "/admin", icon: "/admin-menu/home.svg" },
  { label: "Manejo de Pedidos", href: "/admin/orders", icon: "/admin-menu/orders.svg" },
  { label: "Clientes", href: "/admin/customers", icon: "/admin-menu/customers.svg" },
  { label: "Ventas en tienda", href: "/admin/sellings", icon: "/admin-menu/ventaEnTienda.svg" },
  { label: "Repartidores", href: "/admin/riders", icon: "/admin-menu/repartidores.svg" },

  // ✅ NUEVOS
  {
    label: "Solicitud Repartidores",
    href: "/admin/driverApplications",
    icon: "/admin-menu/SolicitudRepartidores.svg",
  },
  {
    label: "Atención al Cliente",
    href: "/admin/customerSupport",
    icon: "/admin-menu/AtencionCliente.svg",
  },

  { label: "Gestión de usuarios", href: "/admin/userDetail", icon: "/admin-menu/gestiondeUsuarios.svg" },
  { label: "Categorias", href: "/admin/categories", icon: "/admin-menu/categories.svg" },
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

  const isActiveRoute = (href: string) => {
    const isRootAdmin = href === "/admin";
    return isRootAdmin
      ? pathname === "/admin" || pathname === "/admin/"
      : pathname === href || pathname.startsWith(href + "/");
  };

  const renderItem = (item: AdminMenuItem) => {
    const isActive = isActiveRoute(item.href);

    return (
      <li key={item.href} className={isActive ? styles.itemActive : styles.item}>
        <Link href={item.href} className={styles.link}>
          <span className={styles.iconWrapper}>
            <Image src={item.icon} alt={item.label} width={18} height={18} />
          </span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      </li>
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuSection}>
        <ul className={styles.list}>{mainItems.map(renderItem)}</ul>

        <div className={styles.sectionTitle}>Product</div>
        <ul className={styles.list}>{productItems.map(renderItem)}</ul>
      </div>

      <div className={styles.logoutSection}>
        <button type="button" onClick={handleLogout} className={styles.logoutButton}>
          <span className={styles.iconWrapper}>
            <Image src="/admin-menu/logOut.svg" alt="Cerrar sesión" width={18} height={18} />
          </span>
          <span className={styles.label}>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
