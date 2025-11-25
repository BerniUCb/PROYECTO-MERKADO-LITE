"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AddressService } from "@/app/services/address.service";
import type AddressModel from "@/app/models/address.model";

export default function Direcciones() {
  const [addresses, setAddresses] = useState<AddressModel[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Modal state ---
  const [showModal, setShowModal] = useState(false);

  // --- Form state ---
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

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await AddressService.getAll(1);
      setAddresses(data);
    } catch (err) {
      console.error("Error cargando direcciones:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Crear dirección ---
  const handleCreate = async () => {
    try {
      await AddressService.create(1, {
        ...form,
        internalNumber: form.internalNumber || null,
        references: form.references || null,
        isDefault: false,
        userId: 1, // Temporal, cambiar cuando tengas auth
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

      fetchAddresses(); // refrescar lista
    } catch (error) {
      console.error("Error creating address:", error);
      alert("Hubo un problema al crear la dirección.");
    }
  };

  // --- Eliminar dirección ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta dirección?")) return;

    try {
      await AddressService.delete(1, addresses.find(addr => addr.id === id)!.id);
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("No se pudo eliminar.");
    }
  };

  return (
    <>
      <Header />

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

      {/* ------------ MODAL ------------ */}
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
              <button className={styles.cancel} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={styles.save} onClick={handleCreate}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
