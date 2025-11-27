"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

import { AddressService } from "@/app/services/address.service";
import type AddressModel from "@/app/models/address.model";

import UserSidebar from "../../components/UserSidebar";

export default function Direcciones() {
  // User real
  const [userId, setUserId] = useState<number | null>(null);

  // Data
  const [addresses, setAddresses] = useState<AddressModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [form, setForm] = useState({
    street: "",
    streetNumber: "",
    internalNumber: "",
    postalCode: "",
    city: "",
    state: "",
    references: "",
    addressAlias: "",
  });

  // ============================================================
  // 1) Obtener USER ID desde localStorage
  // ============================================================
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const user = JSON.parse(stored);
      setUserId(user.id); // ← ahora se usa el usuario real
    }
  }, []);

  // ============================================================
  // 2) Cargar direcciones cuando userId ya está listo
  // ============================================================
  useEffect(() => {
    if (!userId) return;
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    if (!userId) return;

    try {
      const data = await AddressService.getAll(userId);
      setAddresses(data);
    } catch (err) {
      console.error("❌ Error cargando direcciones:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CREAR DIRECCIÓN
  // ============================================================
  const handleCreate = async () => {
    if (!userId) return;

    try {
      await AddressService.create(userId, {
        ...form,
        internalNumber: form.internalNumber || null,
        references: form.references || null,
        isDefault: false,
      });

      setShowModal(false);

      setForm({
        street: "",
        streetNumber: "",
        internalNumber: "",
        postalCode: "",
        city: "",
        state: "",
        references: "",
        addressAlias: "",
      });

      fetchAddresses();
    } catch (error) {
      console.error("❌ Error creating address:", error);
      alert("Hubo un problema al crear la dirección.");
    }
  };

  // ============================================================
  // ELIMINAR DIRECCIÓN
  // ============================================================
  const handleDelete = async (addressId: number) => {
    if (!userId) return;

    if (!confirm("¿Eliminar esta dirección?")) return;

    try {
      await AddressService.delete(userId, addressId);
      fetchAddresses();
    } catch (error) {
      console.error("❌ Error deleting:", error);
      alert("No se pudo eliminar.");
    }
  };

  // ============================================================
  // LOADING SI userId aún no está cargado
  // ============================================================
  if (userId === null) return <p>Cargando...</p>;

  return (
    <div style={{ display: "flex", width: "100%" }}>
      

      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h2>Mis Direcciones</h2>
            <button
              className={styles["add-btn"]}
              onClick={() => setShowModal(true)}
            >
              Añadir Dirección
            </button>
          </div>

          {loading && <p>Cargando direcciones...</p>}
          {!loading && addresses.length === 0 && <p>No hay direcciones.</p>}

          {addresses.map((address) => (
            <div key={address.id} className={styles["address-card"]}>
              <div className={styles.left}>
                <div className={styles.icon}>📍</div>

                <div className={styles.text}>
                  <p className={styles.title}>
                    {address.street} {address.streetNumber}, {address.city}
                  </p>

                  {address.references && (
                    <p className={styles.desc}>{address.references}</p>
                  )}
                </div>
              </div>

              <button
                className={styles["delete-btn"]}
                onClick={() => handleDelete(address.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Nueva Dirección</h3>

            <div className={styles.formGroup}>
              <label>Calle</label>
              <input
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número</label>
              <input
                value={form.streetNumber}
                onChange={(e) =>
                  setForm({ ...form, streetNumber: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Departamento / Interno</label>
              <input
                value={form.internalNumber}
                onChange={(e) =>
                  setForm({ ...form, internalNumber: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Código Postal</label>
              <input
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Ciudad</label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Estado</label>
              <input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Alias (Casa, Trabajo...)</label>
              <input
                value={form.addressAlias}
                onChange={(e) =>
                  setForm({ ...form, addressAlias: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>Referencias</label>
              <textarea
                value={form.references}
                onChange={(e) =>
                  setForm({ ...form, references: e.target.value })
                }
              ></textarea>
            </div>

            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>

              <button className={styles.save} onClick={handleCreate}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
