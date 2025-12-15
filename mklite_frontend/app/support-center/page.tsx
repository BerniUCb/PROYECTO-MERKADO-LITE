"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { SupportTicketService } from "@/app/services/support-ticket.service";
import { SupportMessageService } from "@/app/services/supportMessage.service";
import { OrderService } from "@/app/services/order.service";
import type Order from "@/app/models/order.model";


export default function SupportPage() {
  // Campos visuales
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Campos reales
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
   // ===== RECIBO =====
const [receiptCode, setReceiptCode] = useState("");
const [orders, setOrders] = useState<Order[]>([]);
const [receiptLoading, setReceiptLoading] = useState(false);

  // MOCK (luego viene del auth / pedidos)
  const clientId = 1;
  const orderId = 1;

  const handleSubmit = async () => {
    if (!subject || !message) {
      alert("Completa el asunto y el mensaje");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Crear ticket
      const ticket = await SupportTicketService.create({
        reason: subject,
        clientId,
        orderId,
      });

      // 2️⃣ Crear mensaje
      await SupportMessageService.create({
        content: message,
        ticketId: ticket.id,
      });

      alert("Mensaje enviado correctamente");

      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error(error);
      alert("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };
  const handleSearchReceipt = async () => {
  if (!receiptCode) {
    alert("Ingresa un código de pedido");
    return;
  }

  try {
    setReceiptLoading(true);

    const orderId = Number(receiptCode.replace("#", ""));
    if (isNaN(orderId)) {
      alert("Código inválido");
      return;
    }

    const order = await OrderService.getById(orderId);
    setOrders([order]);
  } catch (error) {
    console.error(error);
    alert("Pedido no encontrado");
    setOrders([]);
  } finally {
    setReceiptLoading(false);
  }
};

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
  <input
    placeholder="Ej: #455554 o #465554"
    value={receiptCode}
    onChange={(e) => setReceiptCode(e.target.value)}
  />
  <button onClick={handleSearchReceipt} disabled={receiptLoading}>
    {receiptLoading ? "Buscando..." : "Buscar"}
  </button>
</div>


          <h4 className={styles.subTitle}>Recibos Recientes</h4>

          <div className={styles.receiptGrid}>
  {orders.length === 0 && <p>No hay recibos para mostrar</p>}

  {orders.map((order) => (
    <ReceiptCard
      key={order.id}
      id={`#${order.id}`}
      price={order.orderTotal.toFixed(2)}
      status={
        order.status === "delivered"
          ? "Entregado"
          : order.status === "shipped"
          ? "En Camino"
          : "Pendiente"
      }
    />
  ))}
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
          <Faq q="¿Cómo puedo rastrear mi pedido?" a="Puedes rastrear tu pedido iniciando sesión en tu cuenta." />
          <Faq q="¿Cuál es el tiempo de entrega?" a="El tiempo estándar es de 2-4 horas." />
          <Faq q="¿Puedo cancelar mi pedido?" a="Sí, antes de que sea procesado." />
          <Faq q="¿Qué métodos de pago aceptan?" a="Efectivo contra entrega." />
        </section>

        {/* ===== FORMULARIO (CONECTADO) ===== */}
        <section className={styles.form}>
          <h2>¿No encontraste lo que buscabas?</h2>
          <p>Completa el formulario y nos pondremos en contacto contigo.</p>

          <div className={styles.formGrid}>
            <input placeholder="Tu nombre" value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <input placeholder="+591 XXX-XXX-XXX" value={phone} onChange={e => setPhone(e.target.value)} />
            <input placeholder="Asunto" value={subject} onChange={e => setSubject(e.target.value)} />
            <textarea placeholder="Describe tu consulta..." value={message} onChange={e => setMessage(e.target.value)} />
          </div>

          <button className={styles.send} onClick={handleSubmit} disabled={loading}>
            {loading ? "Enviando..." : "Enviar mensaje"}
          </button>
        </section>

        {/* ===== INFO FINAL ===== */}
        <section className={styles.info}>
          <div className={`${styles.infoCard} ${styles.redBg}`}>
            ⏰<p>Atención<br />10:00 - 18:00</p>
          </div>
          <div className={`${styles.infoCard} ${styles.greenBg}`}>
            💬<p>Respuesta en<br />menos de 24h</p>
          </div>
          <div className={`${styles.infoCard} ${styles.blueBg}`}>
            🎧<p>Soporte dedicado</p>
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
