"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./UserSidebar.module.css";

type UserSidebarProps = {
  userName?: string;
};

const menuItems = [
  { label: "Detalles de la Cuenta", href: "/user/account", icon: "/user-menu/account.svg" },
  { label: "Mis Pedidos", href: "/user/orders", icon: "/user-menu/orders.svg" },
  { label: "Mi Carrito", href: "/cart", icon: "/user-menu/cart.svg" },
  { label: "Mis Direcciones", href: "/user/addresses", icon: "/user-menu/addresses.svg" },
  { label: "Notificaciones", href: "/user/notifications", icon: "/user-menu/notifications.svg" },
  { label: "Cupones", href: "/user/coupons", icon: "/user-menu/coupons.svg" },
  { label: "Recibos", href: "/user/receipts", icon: "/user-menu/receipts.svg" },
  { label: "Configuración de la cuenta", href: "/user/settings", icon: "/user-menu/settings.svg" },
];

export default function UserSidebar({
  userName = "Pepe",
}: UserSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.userName}>{userName}</span>
      </div>

      <ul className={styles.menu}>
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href} className={isActive ? styles.active : styles.item}>
              <Link href={item.href} className={styles.link}>
                <Image src={item.icon} alt={item.label} width={20} height={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
