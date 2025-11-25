"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import styles from "./RiderModal.module.css";

interface RiderModalProps {
  onClose: () => void;
}

type Step = "intro" | "form";

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIntroContinue = () => {
    setStep("form");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Aquí luego puedes hacer fetch() a tu backend
    console.log("Datos rider:", form);

    // Por ahora solo cerramos el modal
    onClose();
  };

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
      </div>
    </div>
  );
}
