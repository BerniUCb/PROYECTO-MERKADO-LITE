"use client";

import { useState, useEffect } from "react";
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
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUserId(JSON.parse(stored).id);
  }, []);

  const [form, setForm] = useState({
    street: "",
    streetNumber: "",
    internalNumber: "",
    city: "",
    state: "",
    references: "",
    addressAlias: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const saved = await AddressService.create(userId, {
      ...form,
      postalCode: "0000",
      isDefault: false,
    });

    onSave(saved);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalLarge}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <h2>Nueva Dirección</h2>

        <form onSubmit={handleSubmit}>
          <input placeholder="Calle" onChange={e => setForm({ ...form, street: e.target.value })} />
          <input placeholder="Número" onChange={e => setForm({ ...form, streetNumber: e.target.value })} />
          <input placeholder="Ciudad" onChange={e => setForm({ ...form, city: e.target.value })} />
          <input placeholder="Alias" onChange={e => setForm({ ...form, addressAlias: e.target.value })} />

          <button className={styles.primaryBigBtn}>
            Guardar Dirección
          </button>
        </form>
      </div>
    </div>
  );
}
