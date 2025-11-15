
"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export default function SignupPage() {
  return (
    <>
    <Header />
      <div className={styles.loginContainer}>
        <form className={styles.loginForm}>
          <div>
            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="text"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="••••••••"
            />
            <p className={styles.reset}>
              ¿Olvidaste tu contraseña?{" "}
              <a href="#">
                <b>Restablécela aquí</b>
              </a>
            </p>
          </div>

          <div className={styles.divider}>— O —</div>

          <div className={styles.google}>
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              width="18"
              alt="Google"
            />
            <a href="#">Continuar con Google</a>
          </div>

          <button type="submit" className={styles.button}>
             Continuar
            </button>


          <div className={styles.crearCuenta}>
            ¿No tienes una cuenta?{" "}
            <a href="#">
              <b>Crea una cuenta</b>
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

