import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header() {
  // Simulación de sesión (tu equipo luego puede reemplazar esto con su auth real)
  const isLogged = typeof window !== "undefined" && localStorage.getItem("token");

  // Decide a qué ruta ir según login
  const goToUser = isLogged ? "/user" : "/signup";
  const goToCar = isLogged ? "/car" : "/signup";
  const goToWishlist = isLogged ? "/wishlist" : "/signup";

  return (
    <header className={styles.header}>
      
      {/* Top Bar */}
      <div className={styles.topBar}>
        
        {/* 1. SECCIÓN IZQUIERDA */}
        <div className={styles.topBarLeft}>
          <Link href="/about">Quiénes Somos</Link>

          {/* MI CUENTA (CON LÓGICA) */}
          <Link href={goToUser}>Mi Cuenta</Link>

          {/* LISTA DE DESEOS (CON LÓGICA) */}
          <Link href={goToWishlist}>Lista de Deseos</Link>

          <Link href="/tracking">Seguimiento de Pedido</Link>
        </div>
        
        {/* 2. SECCIÓN CENTRAL */}
        <div className={styles.topBarCenter}>
          <span>Pedidos protegidos y siempre a tiempo</span>
        </div>

        {/* 3. SECCIÓN DERECHA */}
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

        {/* ICONOS DE LA DERECHA (CON LÓGICA) */}
        <div className={styles.mainHeaderIcons}>

          {/* LISTA DE DESEOS */}
          <Link href={goToWishlist}>
            <Image src="/header/corazonListaDeDeseos.png" alt="Lista de Deseos" width={24} height={24} />
            <span>Lista de Deseos</span>
          </Link>

          {/* CARRITO */}
          <Link href={goToCar}>
            <Image src="/header/carrito.png" alt="Carrito" width={24} height={24} />
            <span className={styles.cartCount}>0</span>
            <span>Carrito</span>
          </Link>

          {/* CUENTA */}
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

        {/* LINKS INFERIORES */}
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
