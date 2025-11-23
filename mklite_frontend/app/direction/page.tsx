import React from "react";
import styles from "./page.module.css";

export default function Direcciones() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Mis Direcciones</h2>
                <button className={styles["add-btn"]}>Añadir Dirección</button>
            </div>

            <div className={styles["address-card"]}>
                <div className={styles.left}>
                    <div className={styles.text}>
                        <p className={styles.title}>Julio Méndez 1250, Cochabamba</p>
                        <p className={styles.desc}>casa de 3 pisos con 3 arboles en la acera</p>
                    </div>
                </div>

                <button className={styles["edit-btn"]}>Editar</button>
            </div>
        </div>
    );
}
