"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role?.toLowerCase());
        setIsLogged(true);
      } catch {
        setIsLogged(false);
        setRole(null);
      }
    } else {
      setIsLogged(false);
      setRole(null);
    }

    setLoading(false);
  }, []);

  // Mientras carga el estado → NO mostramos redirecciones erróneas
  if (loading) {
    return <header className={styles.header}></header>;
  }

  // 🔥 Ruta del botón de cuenta según estado REAL
  let goToAccount = "/signup";

  if (isLogged) {
    if (role === "admin") {
      goToAccount = "/admin";
    } else {
      goToAccount = "/user/account_details";
    }
  }

  const goToCar = isLogged ? "/car" : "/signup";
  const goToWishlist = isLogged ? "/wishlist" : "/signup";

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/about">Quiénes Somos</Link>
          <Link href={goToAccount}>Mi Cuenta</Link>
          <Link href={goToWishlist}>Lista de Deseos</Link>
          <Link href="/tracking">Seguimiento de Pedido</Link>
        </div>

        <div className={styles.topBarCenter}>
          <span>Pedidos protegidos y siempre a tiempo</span>
        </div>

        <div className={styles.topBarRight}>
          <span>¿Necesitas ayuda? Llámanos: +591 7XXXXXXXX</span>
          <select>
            <option>BOB (Bs.)</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/header/logoMKLite.png"
              alt="Logo"
              width={300}
              height={100}
              priority
            />
          </Link>
        </div>

        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar productos..." />
          <button>Buscar</button>
        </div>

        <div className={styles.mainHeaderIcons}>
          <Link href={goToWishlist}>
            <Image
              src="/header/corazonListaDeDeseos.png"
              alt=""
              width={24}
              height={24}
            />
            <span>Lista de Deseos</span>
          </Link>

          <Link href={goToCar}>
            <Image
              src="/header/carrito.png"
              alt=""
              width={24}
              height={24}
            />
            <span className={styles.cartCount}>0</span>
            <span>Carrito</span>
          </Link>

          {/* 🔥 ESTE YA FUNCIONA PERFECTO */}
          <Link href={goToAccount}>
            <Image
              src="/header/iconoUsuario.png"
              alt=""
              width={24}
              height={24}
            />
            <span>Cuenta</span>
          </Link>
        </div>
      </div>

      {/* Nav Inferior */}
      <nav className={styles.bottomNav}>
        <div className={styles.categoriesDropdown}>
          <button>
            <Image
              src="/header/iconoCuadrosCategoriasHeader.png"
              alt=""
              width={20}
              height={20}
            />
            <span>Todas las Categorías</span>
            <Image
              src="/header/flechaSenalAbajo.png"
              alt=""
              width={16}
              height={16}
            />
          </button>
        </div>

        <div className={styles.bottomNavLinks}>
          <Link href="/offers">
            <Image
              src="/header/llamaDeFuego.png"
              alt="Ofertas"
              width={20}
              height={20}
            />
            Ofertas Destacadas
          </Link>
          <Link href="/">Inicio</Link>
          <Link href="/about">Quiénes Somos</Link>
          <Link href="/shop">Tienda</Link>
          <Link href="/categories/lácteos-y-derivados">Categorías</Link>
          <Link href="/contact">Contacto</Link>
        </div>

        <div className={styles.contactInfo}>
          <Image
            src="/header/headphonesIcono.png"
            alt="Atención"
            width={32}
            height={32}
          />
          <div>
            <span>+591 69520024</span>
            <small>Atención al Cliente 24/7</small>
          </div>
        </div>
      </nav>
    </header>
  );
}
