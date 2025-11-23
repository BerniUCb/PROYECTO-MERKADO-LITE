"use client";

import React, { useState } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import Link from "next/link";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Client");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          passwordHash: password,
          role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear cuenta");
      }

      setSuccess("Usuario creado correctamente. ¡Puedes iniciar sesión!");
      setFullName("");
      setEmail("");
      setPassword("");
      setCity("");
      setPhone("");
      setRole("Client");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.signupContainer}>
        <form className={styles.signupForm} onSubmit={handleSignup}>
          <h2>Crear cuenta</h2>

          {/* Campos del formulario */}
          <div>
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caracteres como mínimo"
              required
            />
          </div>

          <div>
            <label htmlFor="city">Ciudad</label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Cochabamba"
            />
          </div>

          <div>
            <label htmlFor="phone">Número de teléfono</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+591 7XXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="role">Tipo de usuario</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Client">Cliente</option>
              <option value="Seller">Vendedor</option>
              <option value="Warehouse">Almacén</option>
              <option value="DeliveryDriver">Repartidor</option>
              <option value="Admin">Administrador</option>
              <option value="Support">Soporte</option>
              <option value="Supplier">Proveedor</option>
            </select>
          </div>

          {/* Mensajes de error / éxito */}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" className={styles.button}>Crear cuenta</button>

          {/* Enlace para login */}
          <div className={styles.loginRedirect} style={{ marginTop: "15px", fontSize: "13px", textAlign: "center", color: "gray" }}>
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login">
              <b>Iniciar Sesión</b>
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}





