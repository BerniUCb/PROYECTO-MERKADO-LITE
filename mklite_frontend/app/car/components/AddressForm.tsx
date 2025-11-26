"use client";
import { useState } from "react";
import styles from "./modal.module.css";
import type AddressModel from "@/app/models/address.model";
import { AddressService } from "@/app/services/address.service";

export default function AddressForm({
  onSave,
  onClose,
}: {
  onSave: (address: AddressModel) => void;
  onClose: () => void;
}) {
  const [street, setStreet] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [internalNumber, setInternalNumber] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [references, setReferences] = useState("");
  const [pointRef, setPointRef] = useState("");
  const userId = 1;

  // Errores
  const [errors, setErrors] = useState({
    street: false,
    streetNumber: false,
    internalNumber: false,
    city: false,
    references: false,
    pointRef: false,
  });

  const validate = () => {
    const newErrors = {
      street: street.trim() === "",
      streetNumber: streetNumber.trim() === "",
      internalNumber: internalNumber.trim() === "",
      city: city.trim() === "",
      references: references.trim() === "",
      pointRef: pointRef.trim() === "",
    };

    setErrors(newErrors);

    return Object.values(newErrors).every((e) => e === false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const newAddress = {
      street,
      streetNumber,
      internalNumber: internalNumber || null,
      city,
      state,
      postalCode: "0000",
      references,
      addressAlias: pointRef,
      isDefault: false,
    };

    const saved = await AddressService.create(userId, newAddress);

    onSave(saved);
  };

  const errorText = (show: boolean) =>
    show ? <p className={styles.errorText}>⚠ Espacio obligatorio.</p> : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalLarge}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2>Ingresa la dirección de entrega</h2>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* CALLE */}
          <label>Dirección calle principal o avenida *</label>
          <input
            className={errors.street ? styles.errorInput : ""}
            placeholder="Ej: Av. Pardo / Calle 10"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
          {errorText(errors.street)}

          {/* Nº CASA + CIUDAD */}
          <div className={styles.row}>
            <div>
              <label>N° de casa/ Departamento</label>
              <input
                className={errors.streetNumber ? styles.errorInput : ""}
                placeholder="#######"
                value={streetNumber}
                onChange={(e) => setStreetNumber(e.target.value)}
              />
              {errorText(errors.streetNumber)}
            </div>
            {/*numero interno*/}
          <div>
              <label>Numero interno de casa</label>
              <input
                className={errors.internalNumber? styles.errorInput : ""}
                placeholder="###"
                value={internalNumber}
                onChange={(e) => setInternalNumber(e.target.value)}
              />
              {errorText(errors.city)}
            </div>
          </div>

            <div>
              <label>Ciudad / Localidad</label>
              <input
                className={errors.city ? styles.errorInput : ""}
                placeholder="Cercado"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              {errorText(errors.city)}
            </div>
          

          {/* INDICACIONES */}
          <label>Indicaciones para la entrega</label>
          <textarea
            className={errors.references ? styles.errorInput : ""}
            placeholder="Referencias / Indicaciones para la entrega"
            value={references}
            onChange={(e) => setReferences(e.target.value)}
          />
          {errorText(errors.references)}

          {/* PUNTO REFERENCIA */}
          <label>Punto de referencia visible</label>
          <textarea
            className={errors.pointRef ? styles.errorInput : ""}
            placeholder="Frente al Colegio San Patricio, Cerca de la farmacia"
            value={pointRef}
            onChange={(e) => setPointRef(e.target.value)}
          />
          {errorText(errors.pointRef)}

          <button className={styles.primaryBigBtn}>
            Añadir Dirección Y Enviar Mi Pedido
          </button>
          
        </form>
      </div>
    </div>
    
  );
}
