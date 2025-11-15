"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "./page.module.css"; 

export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="login-container">
        <form className="login-form">
          <div>
            <label htmlFor="nombre">Nombres</label>
            <input type="text" id="nombre" name="nombre" placeholder="Nombres" />
          </div>

          <div>
            <label htmlFor="apellido">Apellidos</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Apellidos"
            />
          </div>

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
            <label htmlFor="ciudad">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              placeholder="Cochabamba*"
            />
          </div>

          <div>
            <label htmlFor="telefono">Número de teléfono</label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              placeholder="+591 *******"
            />
          </div>

          <div>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="8 caracteres como mínimo"
            />
            <p className="terms">
              Al continuar, aceptas los Términos de servicio y la Política de
              privacidad de Merkado Lite
            </p>
          </div>

          <div className="divider">— O —</div>

          <div className="google">
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              width="18"
              alt="Google"
            />
            <a href="#">Continuar con Google</a>
          </div>

          <button type="submit">Continuar</button>

          <div className="crearcuenta">
            ¿Ya estás registrado?{" "}
            <a href="#">
              <b>Iniciar Sesión</b>
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
