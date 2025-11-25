import Link from "next/link";
import Image from "next/image";
import styles from "./HeaderAdmin.module.css";

export default function HeaderAdmin() {
  return (
    <header className={styles.header}>
      {/* BARRA SUPERIOR OSCURA */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/about">Quiénes Somos</Link>
          <Link href="/account">Mi Cuenta</Link>
        </div>

        <div className={styles.topBarCenter}>
          <span>Pedidos protegidos y siempre a tiempo</span>
        </div>

        <div className={styles.topBarRight}>
          <span>¿Necesitás ayuda? Llámanos: +591 7XX-XX-XXX</span>
        </div>
      </div>

      {/* BARRA ROJA PRINCIPAL */}
      <div className={styles.mainHeader}>
        {/* LOGO */}
        <div className={styles.logo}>
          <Link href="/admin">
            <Image
              src="/header/logoMKLite.png"
              alt="Merkado Lite Logo"
              width={260}
              height={90}
              priority
            />
          </Link>
        </div>

        {/* ICONOS DERECHA */}
        <div className={styles.rightSection}>
          
          {/* NOTIFICACIONES */}
          <button
            className={styles.iconButton}
            aria-label="Notificaciones"
            type="button"
          >
            <Image
              src="/header/notification.svg"   
              alt="Notificaciones"
              width={24}
              height={24}
            />
          </button>

          {/* CUENTA */}
          <Link href="/admin/account" className={styles.account}>
            <Image
              src="/header/iconoUsuario.png"
              alt="Cuenta"
              width={24}
              height={24}
            />
            <span>Cuenta</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
