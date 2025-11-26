"use client";

import styles from "./modal.module.css";
import type AddressModel from "@/app/models/address.model";

export default function AddressList({
  addresses,
  onSelect,
  onAdd,
  onClose,
}: {
  addresses: AddressModel[];
  onSelect: (addr: AddressModel) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        
        {/* BOTÓN PARA CERRAR */}
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Direcciones de envío</h3>

        <div className={styles.addressList}>

          {/* Si NO HAY direcciones */}
          {addresses.length === 0 && (
            <p style={{ textAlign: "center", color: "#777" }}>
              No tienes direcciones aún. Añade una nueva.
            </p>
          )}

          {/* LISTA DE DIRECCIONES */}
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={styles.addressItem}
              onClick={() => onSelect(addr)}
            >
              <strong>
                {addr.addressAlias} {addr.isDefault && "⭐"}
              </strong>

              <br />

              {addr.street} {addr.streetNumber}
              {addr.internalNumber ? `, Int. ${addr.internalNumber}` : ""}

              <br />

              {addr.city}, {addr.state}

              <br />

              CP: {addr.postalCode}

              {addr.references && (
                <>
                  <br />
                  <small style={{ color: "#666" }}>
                    Ref: {addr.references}
                  </small>
                </>
              )}
            </div>
          ))}

        </div>

        {/* BOTÓN PARA AGREGAR OTRA DIRECCIÓN */}
        <button className={styles.addLink} onClick={onAdd}>
          + Añadir dirección
        </button>

        {/* BOTÓN CONTINUAR */}
        <button className={styles.primaryBtn} onClick={onClose}>
          Continuar
        </button>
      </div>
    </div>
  );
}
