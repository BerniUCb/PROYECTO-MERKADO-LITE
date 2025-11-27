"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Image from "next/image";
import styles from "./RiderModal.module.css";

interface RiderModalProps {
  onClose: () => void;
}

type Step = "intro" | "form" | "confirm" | "success";

interface RiderFormState {
  mobility: string;
  ci: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export default function RiderModal({ onClose }: RiderModalProps) {
  const [step, setStep] = useState<Step>("intro");

  const [form, setForm] = useState<RiderFormState>({
    mobility: "moto",
    ci: "",
    firstName: "",
    lastName: "",
    phone: "+591",
    email: "",
  });

  // Para mostrar la fecha en la pantalla de éxito
  const [requestDate] = useState<Date>(() => new Date());
  const formattedDate = requestDate.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIntroContinue = () => {
    setStep("form");
  };

  // Paso 2 -> Paso 3 (confirmación)
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setStep("confirm");
  };

  // Paso 3 -> Paso 4 (éxito)
  const handleConfirmAndSend = () => {
    // Aquí harías el fetch/axios a tu backend
    console.log("Datos rider enviados:", form);

    setStep("success");
  };

  const handleEdit = () => {
    setStep("form");
  };

  const mobilityLabel: Record<string, string> = {
    moto: "Moto",
    bicicleta: "Bicicleta",
    auto: "Auto",
  };

  // Código de solicitud fake por ahora
  const requestCode = "#R-2025-0012";

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Botón cerrar (X) */}
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Cerrar"
          onClick={onClose}
        >
          ×
        </button>

        {/* PASO 1: INTRO */}
        {step === "intro" && (
          <>
            <h2 className={styles.title}>Quiero ser rider de Merkado Lite</h2>

            <p className={styles.text}>
              Si quieres ser un rider en Merkado Lite solo tienes que crear tu
              perfil y llenarlo con tus datos para empezar a hacer pedidos.
            </p>

            <button
              type="button"
              className={styles.continueButton}
              onClick={handleIntroContinue}
            >
              Continuar
            </button>
          </>
        )}

        {/* PASO 2: FORMULARIO */}
        {step === "form" && (
          <>
            <h2 className={styles.title}>Conviértete en repartidor</h2>
            <p className={styles.textForm}>Crea tu perfil</p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="mobility">Selecciona tu movilidad</label>
                  <select
                    id="mobility"
                    name="mobility"
                    value={form.mobility}
                    onChange={handleChange}
                  >
                    <option value="moto">Moto</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="ci">Cédula de identidad</label>
                  <input
                    id="ci"
                    name="ci"
                    type="text"
                    value={form.ci}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="firstName">Primer Nombre</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="lastName">Primer Apellido</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="phone">Número de teléfono</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className={styles.continueButton}>
                Continuar
              </button>
            </form>
          </>
        )}

        {/* PASO 3: CONFIRMACIÓN */}
        {step === "confirm" && (
          <>
            <h2 className={styles.title}>Confirma tu información</h2>
            <p className={styles.textForm}>
              Verifica que todo esté correcto antes de enviar tu solicitud.
            </p>

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tipo de movilidad:</span>
                <span className={styles.summaryValue}>
                  {mobilityLabel[form.mobility] ?? form.mobility}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Cédula:</span>
                <span className={styles.summaryValue}>{form.ci}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Nombre:</span>
                <span className={styles.summaryValue}>
                  {form.firstName} {form.lastName}
                </span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Teléfono:</span>
                <span className={styles.summaryValue}>{form.phone}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Email:</span>
                <span className={styles.summaryValue}>{form.email}</span>
              </div>
            </div>

            <p className={styles.confirmText}>
              Al confirmar, tu solicitud será enviada a nuestro equipo para
              revisión. Te notificaremos en un plazo de 24 a 48 horas.
            </p>

            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleEdit}
              >
                Editar Datos
              </button>

              <button
                type="button"
                className={styles.confirmButton}
                onClick={handleConfirmAndSend}
              >
                Confirmar y Enviar
              </button>
            </div>
          </>
        )}

        {/* PASO 4: SOLICITUD ENVIADA */}
        {step === "success" && (
  <>
    <h2 className={`${styles.title} ${styles.successTitle}`}>
      Solicitud enviada
    </h2>

    {/* Icono + texto corto */}
    <div className={styles.successHeaderRow}>
      <div className={styles.successIconWrapper}>
        <Image
          src="/footer/check.svg"
          alt="Solicitud enviada"
          width={40}
          height={40}
        />
      </div>
      <p className={styles.successLead}>
        Tu solicitud para convertirte en repartidor fue enviada con éxito.
      </p>
    </div>

    {/* Grid: código / estado / movilidad / fecha */}
    <div className={styles.successGrid}>
      <div className={styles.successRow}>
        <span className={styles.successLabel}>Código de solicitud:</span>
        <span className={styles.successValue}>#R-2025-0012</span>
      </div>

      <div className={styles.successRow}>
        <span className={styles.successLabel}>Estado:</span>
        <span className={styles.statusBadge}>En revisión</span>
      </div>

      <div className={styles.successRow}>
        <span className={styles.successLabel}>Tipo de movilidad:</span>
        <span className={styles.successValue}>
          {mobilityLabel[form.mobility] ?? form.mobility}
        </span>
      </div>

      <div className={styles.successRow}>
        <span className={styles.successLabel}>Fecha:</span>
        <span className={styles.successValue}>{formattedDate}</span>
      </div>
    </div>

    {/* Texto largo */}
    <p className={styles.successText}>
      Nuestro equipo revisará tus datos y te contactará por WhatsApp o correo
      electrónico en un plazo aproximado de <strong>24 a 48 horas</strong>.
      Mientras tanto, puedes seguir comprando normalmente en Merkado Lite.
    </p>

    {/* Botón rojo abajo a la derecha */}
    <div className={styles.successActions}>
      <button
        type="button"
        className={styles.backHomeButton}
        onClick={onClose}
      >
        Volver al inicio
      </button>
    </div>
  </>
)}

      </div>
    </div>
  );
}
