"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import styles from "./page.module.css";
import { instance } from "@/app/utils/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // limpiar tokens viejos
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; Max-Age=0; path=/;";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await instance.post("/auth/login", { email, password });

    const token = res.data.access_token;
    const user = res.data.user;

    // Guardar primero
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/;`;

    // 🔥 Redirect basado en rol ANTES de esperar que React recargue estados
    if (user.role === "Admin") {
      router.replace("/admin"); // ⬅ replace evita volver atrás
      return;
    }

    if (user.role === "Client") {
      router.replace("/home");
      return;
    }

  } catch (err: any) {
    setError(err.response?.data?.message || "Error al iniciar sesión");
  }
};


  return (
    <>
      <Header />

      <div className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h2 className={styles.formTitle}>Iniciar Sesión</h2>

          <div>
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" className={styles.button}>
            Continuar
          </button>

          <p className={styles.crearCuenta}>
            ¿No tienes cuenta?{" "}
            <a href="/signup">
              <b>Crear cuenta</b>
            </a>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
}
