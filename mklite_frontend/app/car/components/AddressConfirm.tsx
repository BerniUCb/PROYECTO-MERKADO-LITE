"use client";

import styles from "./modal.module.css";
import type AddressModel from "@/app/models/address.model";

export default function AddressConfirm({
  address,
  onClose,
}: {
  address: AddressModel;
  onClose: () => void;
}) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modalSmall}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h3>Confirmar envío</h3>

        <p>
          <strong>{address.addressAlias}</strong> <br />
          {address.street} {address.streetNumber}
          {address.internalNumber ? `, Int. ${address.internalNumber}` : ""}
          <br />
          {address.city}, {address.state} <br />
          CP: {address.postalCode}
          {address.references && (
            <>
              <br />
              <small>Ref: {address.references}</small>
            </>
          )}
        </p>

        <button className={styles.primaryBtn} onClick={onClose}>
          Confirmar Envío
        </button>
      </div>
    </div>
  );
}
