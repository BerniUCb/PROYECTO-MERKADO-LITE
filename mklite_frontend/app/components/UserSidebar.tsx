"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./UserSidebar.module.css";

type UserMenuItem = {
  label: string;
  href: string;
  icon: string;
};

const menuItems: UserMenuItem[] = [
  { label: "Detalles de la Cuenta", href: "/user/account", icon: "/user-menu/account.svg" },
  { label: "Mis Pedidos", href: "/user/orders", icon: "/user-menu/orders.svg" },
  { label: "Mi Carrito", href: "/car", icon: "/user-menu/cart.svg" },
  { label: "Mis Direcciones", href: "/user/addresses", icon: "/user-menu/addresses.svg" },
  { label: "Notificaciones", href: "/user/notifications", icon: "/user-menu/notifications.svg" },
  { label: "Cupones", href: "/user/coupons", icon: "/user-menu/coupons.svg" },
  { label: "Recibos", href: "/user/receipts", icon: "/user-menu/receipts.svg" },
  { label: "Configuración de la cuenta", href: "/user/settings", icon: "/user-menu/settings.svg" },
];

type UserSidebarProps = {
  userName?: string;
  // onLogout?: () => void; // si luego quieres manejar logout desde props
};

export default function UserSidebar({ userName = "Juan Pablo" }: UserSidebarProps) {
  const pathname = usePathname();

  const renderItem = (item: UserMenuItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <li
        key={item.href}
        className={isActive ? styles.itemActive : styles.item}
      >
        <Link href={item.href} className={styles.link}>
          <span className={styles.iconWrapper}>
            <Image
              src={item.icon}
              alt={item.label}
              width={18}
              height={18}
            />
          </span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      </li>
    );
  };

  const handleLogout = () => {
    // TODO: aquí luego conectan con el sistema real de logout
    console.log("Cerrar sesión");
  };

  return (
    <aside className={styles.sidebar}>
      {/* Cabecera con nombre */}
      <div className={styles.header}>
        <span className={styles.userName}>{userName}</span>
      </div>

      {/* Menú principal */}
      <nav className={styles.menu}>
        <ul className={styles.list}>{menuItems.map(renderItem)}</ul>
      </nav>

      {/* Cerrar sesión al fondo */}
      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <span className={styles.iconWrapper}>
          <Image
            src="/user-menu/logOut.svg"
            alt="Cerrar sesión"
            width={18}
            height={18}
          />
        </span>
        <span className={styles.logoutLabel}>Cerrar Sesión</span>
      </button>
    </aside>
  );
}
