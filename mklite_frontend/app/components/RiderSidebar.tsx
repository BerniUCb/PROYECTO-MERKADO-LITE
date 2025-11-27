"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logout } from "@/app/utils/logout";
import styles from "./RiderSidebar.module.css";

type RiderMenuItem = {
  label: string;
  href: string;
  icon: string;
};

const riderItems: RiderMenuItem[] = [
  {
    label: "Pedidos disponibles",
    href: "/rider",
    icon: "/rider-menu/pedidosDisponibles.svg",
  },
  {
    label: "Historial de pedidos",
    href: "/rider/history",
    icon: "/rider-menu/historialdepedidos.svg",
  },
  {
    label: "Notificaciones",
    href: "/rider/notifications",
    icon: "/rider-menu/notification.svg",
  },
];

export default function RiderSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const renderItem = (item: RiderMenuItem) => {
    const isRootRider = item.href === "/rider";
    const isActive = isRootRider
      ? pathname === "/rider" || pathname === "/rider/"
      : pathname === item.href || pathname.startsWith(item.href + "/");

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
              width={22}
              height={22}
              className={styles.icon}
            />
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
      <nav className={styles.menuSection}>
        <ul className={styles.list}>{riderItems.map(renderItem)}</ul>
      </nav>

      <div className={styles.logoutSection}>
        <button
          type="button"
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          <span className={styles.iconWrapper}>
            <Image
              src="/rider-menu/logOut.svg"
              alt="Cerrar sesión"
              width={22}
              height={22}
              className={styles.icon}
            />
          </span>
          <span className={styles.label}>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
