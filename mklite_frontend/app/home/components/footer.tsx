import Link from 'next/link';
import Image from 'next/image';
import styles from './footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* --- SECCIÓN SUPERIOR --- */}
        <div className={styles.topSection}>
          
          {/* Columna 1: Contacto y Logo */}
          <div className={styles.column}>
            <div className={styles.logo}>
              <Image src="/footer/logoMKLiteFooter.png" alt="Merkado Lite Logo" width={200} height={50} />
            </div>
            <ul className={styles.contactList}>
              <li>
                <Image src="/footer/puntoLocalizacion.png" alt="Ubicación" width={16} height={16} />
                <span><strong>Ubicación:</strong> Julio Mendez Cercado, Cochabamba 0000 Bolivia</span>
              </li>
              <li>
                <Image src="/footer/audifonos.png" alt="Contacto" width={16} height={16} />
                <span><strong>Contáctate con nosotros:</strong> (+591)-69520024</span>
              </li>
              <li>
                <Image src="/footer/mailicono.png" alt="Email" width={16} height={16} />
                <span><strong>Email:</strong> sales@nest.com</span>
              </li>
              <li>
                <span><strong>Horarios de Atención:</strong> 10:00 - 18:00, Lunes - Domingo</span>
              </li>
            </ul>
          </div>

          {/* Columna 2: Compañía */}
          <div className={styles.column}>
            <h3>Compañía</h3>
            <ul>
              <li><Link href="/about">Sobre Nosotros</Link></li>
              <li><Link href="/delivery">Delivery</Link></li>
              <li><Link href="/privacy">Políticas de Privacidad</Link></li>
              <li><Link href="/terms">Terminos y Condiciones</Link></li>
              <li><Link href="/contact">Contáctanos</Link></li>
              <li><Link href="/support">Centro de Soporte</Link></li>
              <li><Link href="/jobs">Empleos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Cuenta */}
          <div className={styles.column}>
            <h3>Cuenta</h3>
            <ul>
              <li><Link href="/login">Iniciar Sesión</Link></li>
              <li><Link href="/cart">Ver Carrito</Link></li>
              <li><Link href="/wishlist">Lista de Deseos</Link></li>
              <li><Link href="/tracking">Seguir mi Pedido</Link></li>
              <li><Link href="/help">Ayuda</Link></li>
              <li><Link href="/shipping">Detalle del Envío</Link></li>
              <li><Link href="/compare">Compara Productos</Link></li>
            </ul>
          </div>

          {/* Columna 4: Popular */}
          <div className={styles.column}>
            <h3>Popular</h3>
            <ul>
              <li><Link href="/categories/leches">Leches</Link></li>
              <li><Link href="/categories/mantequilla">Mantequilla</Link></li>
              <li><Link href="/categories/huevo">Huevo</Link></li>
              <li><Link href="/categories/mermeladas">Mermeladas</Link></li>
              <li><Link href="/categories/cremas">Cremas</Link></li>
              <li><Link href="/categories/te">Té</Link></li>
              <li><Link href="/categories/quesos">Quesos</Link></li>
            </ul>
          </div>

          {/* Columna 5: Muy Pronto */}
          <div className={styles.column}>
            <h3>Muy Pronto</h3>
            <p>Desde App Store o Google Play</p>
            <div className={styles.storeButtons}>
              <Link href="#"><Image src="/footer/playStore.png" alt="Google Play" width={130} height={40} /></Link>
              <Link href="#"><Image src="/footer/appStore.png" alt="App Store" width={130} height={40} /></Link>
            </div>
            <p className={styles.paymentTitle}>Muy Pronto Pagos en línea</p>
            <div className={styles.paymentIcons}>
              <Image src="/footer/pagoTarjetas.png" alt="Métodos de Pago" width={150} height={25} />
            </div>
          </div>
        </div>

        {/* --- SECCIÓN INFERIOR (SUB-FOOTER) --- */}
        <div className={styles.subFooter}>
          <div className={styles.copyright}>
            <p>© 2025, Ucb - Cochabamba<br/>Todos los Derechos Reservados</p>
          </div>
          <div className={styles.footerContacts}>
            <div className={styles.contactItem}>
              <Image src="/footer/telefonoContacto.png" alt="Teléfono" width={40} height={40} />
              <div>
                <strong>(591)-44**569</strong>
                <span>Atención 8:00 - 22:00</span>
              </div>
            </div>
            <div className={styles.contactItem}>
              <Image src="/footer/telefonoContacto.png" alt="Teléfono" width={40} height={40} />
              <div>
                <strong>(591)-69520024</strong>
                <span>24/7 Centro de Soporte</span>
              </div>
            </div>
          </div>
          <div className={styles.socials}>
            <strong>Siguenos</strong>
            {/* Aquí irían los iconos de redes sociales, pero no estaban en la lista */ }
            <p>Hasta 15% de descuento en tu primera suscripción</p>
          </div>
        </div>
      </div>
    </footer>
  );
}