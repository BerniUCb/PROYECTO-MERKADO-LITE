"use client";
import styles from "./page.module.css";
export default function SupportPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>

        {/* ===== TÍTULO ===== */}
        <section className={styles.header}>
          <h1>Centro de Soporte</h1>
          <p>
            Estamos aquí para ayudarte. Encuentra respuestas rápidas a tus
            preguntas o contáctanos directamente.
          </p>
        </section>

        {/* ===== CONTACTO ===== */}
        <section className={styles.contactCards}>
          <div className={styles.contactCard}>
            <div className={`${styles.icon} ${styles.red}`}>📞</div>
            <h3>Llámanos</h3>
            <p>Lunes a Domingo</p>
            <span>10:00 - 18:00</span>
            <strong>(+591) 69520024</strong>
            <strong>(+591) 444-569</strong>
          </div>

          <div className={styles.contactCard}>
            <div className={`${styles.icon} ${styles.green}`}>✉️</div>
            <h3>Escríbenos</h3>
            <p>Respuesta en menos de 24 horas</p>
            <strong className={styles.link}>sale@Nest.com</strong>
          </div>

          <div className={styles.contactCard}>
            <div className={`${styles.icon} ${styles.blue}`}>📍</div>
            <h3>Visítanos</h3>
            <p>Julio Méndez</p>
            <span>Cercado, Cochabamba 0000</span>
            <span>Bolivia</span>
          </div>
        </section>

        {/* ===== RECIBO ===== */}
        <section className={styles.receipt}>
          <div className={styles.receiptHeader}>
            <div className={`${styles.icon} ${styles.red}`}>🧾</div>
            <h2>Consulta tu Recibo</h2>
            <p>
              Ingresa el código de tu pedido para ver los detalles y el recibo
              completo
            </p>
          </div>

          <div className={styles.receiptSearch}>
            <input placeholder="Ej: #455554 o #465554" />
            <button>Buscar</button>
          </div>

          <h4 className={styles.subTitle}>Recibos Recientes</h4>

          <div className={styles.receiptGrid}>
            <ReceiptCard id="#465554" price="15.00" status="Entregado" />
            <ReceiptCard id="#465553" price="25.00" status="En Camino" />
            <ReceiptCard id="#465552" price="42.50" status="Entregado" />
          </div>
        </section>

        {/* ===== AYUDA ===== */}
        <section className={styles.help}>
          <h2>¿Cómo podemos ayudarte?</h2>

          <div className={styles.helpGrid}>
            <HelpItem title="Pedidos y Entregas" text="Rastrea tu pedido, cambios y devoluciones" />
            <HelpItem title="Pagos y Facturación" text="Métodos de pago, facturas y reembolsos" />
            <HelpItem title="Mi Cuenta" text="Gestiona tu perfil y configuración" />
            <HelpItem title="Productos" text="Información sobre productos y disponibilidad" />
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className={styles.faq}>
          <h2>Preguntas Frecuentes</h2>

          <Faq q="¿Cómo puedo rastrear mi pedido?" a="Puedes rastrear tu pedido iniciando sesión en tu cuenta y accediendo a la sección 'Mis Pedidos'. También recibirás actualizaciones por email y SMS." />
          <Faq q="¿Cuál es el tiempo de entrega?" a="Nuestro tiempo de entrega estándar es de 2-4 horas dentro de la zona de cobertura. Trabajamos de 10:00 - 18:00, Lunes a Domingo." />
          <Faq q="¿Puedo cancelar mi pedido?" a="Sí, puedes cancelar tu pedido antes de que sea procesado." />
          <Faq q="¿Qué métodos de pago aceptan?" a="Aceptamos efectivo contra entrega. Muy pronto aceptaremos Visa, Mastercard y pagos en línea." />
          <Faq q="¿Cómo solicito una factura?" a="Las facturas se envían automáticamente a tu correo después de cada compra." />
          <Faq q="¿Olvidé mi contraseña, qué hago?" a="Haz clic en 'Olvidé mi contraseña' y sigue los pasos." />
          <Faq q="¿Cómo sé si un producto está disponible?" a="Los productos disponibles muestran el botón 'Agregar al carrito'." />
        </section>

        {/* ===== FORMULARIO ===== */}
        <section className={styles.form}>
          <h2>¿No encontraste lo que buscabas?</h2>
          <p>Completa el formulario y nos pondremos en contacto contigo lo antes posible.</p>

          <div className={styles.formGrid}>
            <input placeholder="Tu nombre" />
            <input placeholder="tu@email.com" />
            <input placeholder="+591 XXX-XXX-XXX" />
            <input placeholder="Asunto" />
            <textarea placeholder="Describe tu consulta..." />
          </div>

          <button className={styles.send}>Enviar mensaje</button>
        </section>

        {/* ===== INFO FINAL ===== */}
        <section className={styles.info}>
          <div className={`${styles.infoCard} ${styles.redBg}`}>
            ⏰<p>Horarios de Atención<br />Lunes a Domingo<br />10:00 AM - 6:00 PM</p>
          </div>

          <div className={`${styles.infoCard} ${styles.greenBg}`}>
            💬<p>Tiempo de Respuesta<br />Respondemos consultas<br />en menos de 24 horas</p>
          </div>

          <div className={`${styles.infoCard} ${styles.blueBg}`}>
            🎧<p>Soporte Dedicado<br />Equipo especializado<br />para ayudarte</p>
          </div>
        </section>

      </div>
    </main>
  );
}

/* ===== COMPONENTES ===== */

function ReceiptCard({ id, price, status }: any) {
  return (
    <div className={styles.receiptCard}>
      <strong>{id}</strong>
      <span>Bs. {price}</span>
      <small className={status === "Entregado" ? styles.ok : styles.warn}>
        {status}
      </small>
      <a>Ver detalles →</a>
    </div>
  );
}

function HelpItem({ title, text }: any) {
  return (
    <div className={styles.helpItem}>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

function Faq({ q, a }: any) {
  return (
    <div className={styles.faqItem}>
      <strong>{q}</strong>
      <p>{a}</p>
    </div>
  );
}
