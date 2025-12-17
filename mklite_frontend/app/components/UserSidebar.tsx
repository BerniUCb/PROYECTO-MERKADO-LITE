"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./UserSidebar.module.css";

type UserSidebarProps = {
  userName?: string;
};

const menuItems = [
  { label: "Detalles de la Cuenta", href: "/user/account", icon: "/user-menu/account.svg" },
  { label: "Mis Pedidos", href: "/user/orders", icon: "/user-menu/orders.svg" },
  { label: "Mi Carrito", href: "/car", icon: "/user-menu/cart.svg" },
  { label: "Mis Direcciones", href: "/user/addresses", icon: "/user-menu/addresses.svg" },
  { label: "Notificaciones", href: "/user/notifications", icon: "/user-menu/notifications.svg" },
  { label: "Cupones", href: "/user/coupons", icon: "/user-menu/coupons.svg" },
  { label: "Recibos", href: "/user/receipts", icon: "/user-menu/receipts.svg" },
  { label: "Configuración de la cuenta", href: "/user/settings", icon: "/user-menu/settings.svg" },
  { label: "Centro de Soporte", href: "/user/support-center", icon: "/user-menu/support.svg" },
];

export default function UserSidebar({ userName = "Pepe" }: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.userName}>{userName}</span>
      </div>

      <ul className={styles.menu}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li
              key={item.href}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <Link href={item.href} className={styles.link}>
                <span className={styles.icon}>
                  <Image src={item.icon} alt={item.label} width={20} height={20} />
                </span>
                <span className={styles.label}>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <span className={styles.icon}>
          <Image src="/user-menu/logOut.svg" alt="Cerrar sesión" width={20} height={20} />
        </span>
        <span className={styles.logoutLabel}>Cerrar sesión</span>
      </button>
    </aside>
  );
}
