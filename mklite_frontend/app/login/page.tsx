"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { instance } from "@/app/utils/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    try {
      const res = await instance.post("/auth/login", { email, password });

      const token = res.data.access_token;
      const user = res.data.user;
      const role = user.role?.toLowerCase();

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/;`;

      if (role === "admin") {
        router.push("/admin");
        return;
      }

      if (role === "client") {
        router.push("/home");
        return;
      }

      if (role === "deliverydriver") {
        router.push("/rider");
        return;
      }
      

      router.push("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
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
  );
}
