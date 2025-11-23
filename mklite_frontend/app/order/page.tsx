import React from "react";
import styles from "./page.module.css";

export default function Pedidos() {
    return (
        <div className={styles.layout}>

            <div className={styles.container}>
                <div className={styles["table-container"]}>
                    <table>
                        <thead>
                            <tr>
                                <th>Código_Cliente</th>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Nº Pedidos</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>#CUST001</td>
                                <td>Pepe Ramírez</td>
                                <td>+591 69520824</td>
                                <td>25</td>
                            </tr>

                            <tr className={styles.selected}>
                                <td>#CUST002</td>
                                <td>Ana Pérez</td>
                                <td>+591 69845712</td>
                                <td>18</td>
                            </tr>

                            <tr>
                                <td>#CUST003</td>
                                <td>Carlos López</td>
                                <td>+591 72035690</td>
                                <td>30</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className={styles.card}>
                    <h2>Pedidos del Cliente</h2>

                    <div className={styles.detalle}>
                        <p><strong>Cliente:</strong> Ana Pérez</p>
                        <p><strong>Teléfono:</strong> +591 69845712</p>
                        <p><strong>Total de Pedidos:</strong> 18</p>
                    </div>

                    <button className={styles["btn-verde"]}>Ver Detalles</button>
                </div>
            </div>

        </div>
    );
}
