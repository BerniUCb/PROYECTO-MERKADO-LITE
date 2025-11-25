"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  // Estado para saber si el usuario está logueado
  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    // Esto solo se ejecuta en el cliente → NO rompe SSR
    const token = localStorage.getItem("token");
    setIsLogged(!!token);
  }, []);

  // Mientras no sabemos si hay sesión, renderizamos una versión mínima
  if (isLogged === null) {
    return (
      <header className={styles.header}>
        {/* Cabecera mínima mientras cargan los estados del cliente */}
      </header>
    );
  }

  // Rutas dinámicas según sesión
  const goToUser = isLogged ? "/user" : "/signup";
  const goToCar = isLogged ? "/car" : "/signup";
  const goToWishlist = isLogged ? "/wishlist" : "/signup";

  return (
    <header className={styles.header}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        {/* Sección izquierda */}
        <div className={styles.topBarLeft}>
          <Link href="/about">Quiénes Somos</Link>
          <Link href={goToUser}>Mi Cuenta</Link>
          <Link href={goToWishlist}>Lista de Deseos</Link>
          <Link href="/tracking">Seguimiento de Pedido</Link>
        </div>

        {/* Sección central */}
        <div className={styles.topBarCenter}>
          <span>Pedidos protegidos y siempre a tiempo</span>
        </div>

        {/* Sección derecha */}
        <div className={styles.topBarRight}>
          <span>¿Necesitas ayuda? Llámanos: +591 7XXXXXXXX</span>
          <select>
            <option>BOB (Bs.)</option>
          </select>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/header/logoMKLite.png"
              alt="Merkado Lite Logo"
              width={300}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className={styles.searchBar}>
          <input type="text" placeholder="Buscar productos..." />
          <button>Buscar</button>
        </div>

        {/* Iconos de la derecha */}
        <div className={styles.mainHeaderIcons}>
          {/* Lista de deseos */}
          <Link href={goToWishlist}>
            <Image src="/header/corazonListaDeDeseos.png" alt="Lista de Deseos" width={24} height={24} />
            <span>Lista de Deseos</span>
          </Link>

          {/* Carrito */}
          <Link href={goToCar}>
            <Image src="/header/carrito.png" alt="Carrito" width={24} height={24} />
            <span className={styles.cartCount}>0</span>
            <span>Carrito</span>
          </Link>

          {/* Cuenta */}
          <Link href={goToUser}>
            <Image src="/header/iconoUsuario.png" alt="Cuenta" width={24} height={24} />
            <span>Cuenta</span>
          </Link>
        </div>
      </div>

      {/* Nav Bar Inferior */}
      <nav className={styles.bottomNav}>
        <div className={styles.categoriesDropdown}>
          <button>
            <Image src="/header/iconoCuadrosCategoriasHeader.png" alt="Categorías" width={20} height={20} />
            <span>Todas las Categorías</span>
            <Image src="/header/flechaSenalAbajo.png" alt="Flecha" width={16} height={16} />
          </button>
        </div>

        <div className={styles.bottomNavLinks}>
          <Link href="/offers">
            <Image src="/header/llamaDeFuego.png" alt="Ofertas" width={20} height={20} />
            Ofertas Destacadas
          </Link>
          <Link href="/">Inicio</Link>
          <Link href="/about">Quiénes Somos</Link>
          <Link href="/shop">Tienda</Link>
          <Link href="/categories/all">Categorías</Link>
          <Link href="/contact">Contacto</Link>
        </div>

        <div className={styles.contactInfo}>
          <Image src="/header/headphonesIcono.png" alt="Atención" width={32} height={32} />
          <div>
            <span>+591 69520024</span>
            <small>Atención al Cliente 24/7</small>
          </div>
        </div>
      </nav>
    </header>
  );
}
