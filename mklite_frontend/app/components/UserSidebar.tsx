"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/utils/logout";
import styles from "./UserSidebar.module.css";

type UserMenuItem = {
  label: string;
  href: string;
  icon: string;
};

const menuItems: UserMenuItem[] = [
  { label: "Detalles de la Cuenta", href: "/user/account_details", icon: "/user-menu/account.svg" },
  { label: "Mis Pedidos", href: "/user/orders", icon: "/user-menu/orders.svg" },
  { label: "Mi Carrito", href: "/car", icon: "/user-menu/cart.svg" },
  { label: "Mis Direcciones", href: "/user/address", icon: "/user-menu/addresses.svg" },
  { label: "Notificaciones", href: "/user/notification", icon: "/user-menu/notifications.svg" },
  { label: "Cupones", href: "/user/coupons", icon: "/user-menu/coupons.svg" },
  { label: "Recibos", href: "/user/receipts", icon: "/user-menu/receipts.svg" },
  { label: "Configuración", href: "/user/settings", icon: "/user-menu/settings.svg" },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [userName, setUserName] = useState("Usuario");

  useEffect(() => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;

      const user = JSON.parse(userString);
      setUserName(user.fullName || "Usuario");
    } catch {
      console.error("Error al leer usuario");
    }
  }, []);

  const renderItem = (item: UserMenuItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

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
      <div className={styles.header}>
        <span className={styles.userName}>{userName}</span>
      </div>

      <nav className={styles.menu}>
        <ul className={styles.list}>{menuItems.map(renderItem)}</ul>
      </nav>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <span className={styles.iconWrapper}>
          <Image src="/user-menu/logOut.svg" alt="Cerrar sesión" width={18} height={18} />
        </span>
        <span className={styles.logoutLabel}>Cerrar Sesión</span>
      </button>
    </aside>
  );
}
