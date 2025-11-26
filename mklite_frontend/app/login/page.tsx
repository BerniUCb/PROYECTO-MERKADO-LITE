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

  // Mantén tu validación original
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  console.log("🔵 ENVIANDO LOGIN...");

  try {
    const res = await instance.post("/auth/login", { email, password });

    console.log("🟢 LOGIN OK:", res.data);

    const token = res.data.access_token;
    const user = res.data.user;

    const role = user.role?.toLowerCase();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/;`;

    console.log("🟢 ROLE DETECTADO:", role);

    if (role === "admin") {
      console.log("➡ REDIRIGIENDO A /admin");
      router.push("/admin");
      return;
    }

    if (role === "client") {
      console.log("➡ REDIRIGIENDO A /home");
      router.push("/home");
      return;
    }

    console.log("⚠ Rol no reconocido, enviando a /home");
    router.push("/home");

  } catch (err: any) {
    console.log("🔴 ERROR LOGIN:", err);
    console.log("🔴 RESPONSE DATA:", err.response?.data);
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
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
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
