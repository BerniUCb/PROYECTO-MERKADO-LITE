[1mdiff --git a/mklite_frontend/app/car/page.tsx b/mklite_frontend/app/car/page.tsx[m
[1mindex dfc30d5..d2e38ae 100644[m
[1m--- a/mklite_frontend/app/car/page.tsx[m
[1m+++ b/mklite_frontend/app/car/page.tsx[m
[36m@@ -2,6 +2,13 @@[m
 [m
 import { useState } from "react";[m
 import styles from "./page.module.css";[m
[32m+[m[32mimport Header from "@/app/components/Header";[m
[32m+[m[32mimport Footer from "@/app/components/Footer";[m
[32m+[m
[32m+[m[32mimport AddressEmpty from "./components/AddressEmpty";[m
[32m+[m[32mimport AddressForm from "./components/AddressForm";[m
[32m+[m[32mimport AddressList from "./components/AddressList";[m
[32m+[m[32mimport AddressConfirm from "./components/AddressConfirm";[m
 [m
 type Product = {[m
   id: number;[m
[36m@@ -38,6 +45,35 @@[m [mexport default function CarPage() {[m
 [m
   const [shipping, setShipping] = useState<number>(0);[m
 [m
[32m+[m[32m  // ESTADOS DE LOS MODALES[m
[32m+[m[32m  const [showEmpty, setShowEmpty] = useState(false);[m
[32m+[m[32m  const [showForm, setShowForm] = useState(false);[m
[32m+[m[32m  const [showList, setShowList] = useState(false);[m
[32m+[m[32m  const [showConfirm, setShowConfirm] = useState(false);[m
[32m+[m
[32m+[m[32m  const [addressList, setAddressList] = useState<string[]>([]);[m
[32m+[m[32m  const [selectedAddress, setSelectedAddress] = useState("");[m
[32m+[m
[32m+[m[32m  // FUNCIONES PARA DIRECCIONES[m
[32m+[m[32m  const saveAddress = (e: any) => {[m
[32m+[m[32m    e.preventDefault();[m
[32m+[m[32m    const form = e.target;[m
[32m+[m[32m    const newAddress = form[0].value;[m
[32m+[m
[32m+[m[32m    setAddressList([...addressList, newAddress]);[m
[32m+[m[32m    setSelectedAddress(newAddress);[m
[32m+[m
[32m+[m[32m    setShowForm(false);[m
[32m+[m[32m    setShowList(true);[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const selectAddress = (address: string) => {[m
[32m+[m[32m    setSelectedAddress(address);[m
[32m+[m[32m    setShowList(false);[m
[32m+[m[32m    setShowConfirm(true);[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  // FUNCIONES CARRITO[m
   const changeQty = (id: number, delta: number) => {[m
     setProducts(prev =>[m
       prev.map(p =>[m
[36m@@ -60,103 +96,145 @@[m [mexport default function CarPage() {[m
   const total = subtotal + shipping;[m
 [m
   return ([m
[31m-    <main>[m
[32m+[m[32m    <>[m
       {/* HEADER GLOBAL */}[m
[31m-      [m
[31m-      {/* CONTENIDO DEL CARRITO */}[m
[31m-      <div className={styles.container}>[m
[31m-        <section className={styles.cartBox}>[m
[31m-          <div className={styles.header}>[m
[31m-            <h1>Tu Carrito</h1>[m
[31m-            <p>Hay {products.length} productos en tu carrito!</p>[m
[31m-            <button className={styles.clear}>Limpiar Carrito</button>[m
[31m-          </div>[m
[31m-[m
[31m-          <table className={styles.table}>[m
[31m-            <thead>[m
[31m-              <tr>[m
[31m-                <th>Producto</th>[m
[31m-                <th>Cantidad</th>[m
[31m-                <th>Precio U.</th>[m
[31m-                <th>Subtotal</th>[m
[31m-              </tr>[m
[31m-            </thead>[m
[31m-[m
[31m-            <tbody>[m
[31m-              {products.map(p => ([m
[31m-                <tr key={p.id}>[m
[31m-                  {/* PRODUCTO */}[m
[31m-                  <td className={styles.productCell}>[m
[31m-                    <img src={p.img} alt={p.name} />[m
[31m-                    <div>[m
[31m-                      <p>{p.name}</p>[m
[31m-                      <button onClick={() => removeProduct(p.id)}>[m
[31m-                        × Eliminar[m
[31m-                      </button>[m
[31m-                    </div>[m
[31m-                  </td>[m
[31m-[m
[31m-                  {/* CANTIDAD */}[m
[31m-                  <td className={styles.qtyCell}>[m
[31m-                    <button onClick={() => changeQty(p.id, -1)}>-</button>[m
[31m-                    <span>{p.qty}</span>[m
[31m-                    <button onClick={() => changeQty(p.id, 1)}>+</button>[m
[31m-                  </td>[m
[31m-[m
[31m-                  {/* PRECIO */}[m
[31m-                  <td className={styles.price}>[m
[31m-                    Bs. {p.price.toFixed(2)}[m
[31m-                  </td>[m
[31m-[m
[31m-                  {/* SUBTOTAL */}[m
[31m-                  <td className={styles.subtotal}>[m
[31m-                    Bs. {(p.price * p.qty).toFixed(2)}[m
[31m-                  </td>[m
[32m+[m[32m      <Header />[m
[32m+[m
[32m+[m[32m      <main>[m
[32m+[m[32m        {/* CONTENIDO DEL CARRITO */}[m
[32m+[m[32m        <div className={styles.container}>[m
[32m+[m[32m          <section className={styles.cartBox}>[m
[32m+[m[32m            <div className={styles.header}>[m
[32m+[m[32m              <h1>Tu Carrito</h1>[m
[32m+[m[32m              <p>Hay {products.length} productos en tu carrito!</p>[m
[32m+[m[32m              <button className={styles.clear}>Limpiar Carrito</button>[m
[32m+[m[32m            </div>[m
[32m+[m
[32m+[m[32m            <table className={styles.table}>[m
[32m+[m[32m              <thead>[m
[32m+[m[32m                <tr>[m
[32m+[m[32m                  <th>Producto</th>[m
[32m+[m[32m                  <th>Cantidad</th>[m
[32m+[m[32m                  <th>Precio U.</th>[m
[32m+[m[32m                  <th>Subtotal</th>[m
                 </tr>[m
[31m-              ))}[m
[31m-            </tbody>[m
[31m-          </table>[m
[31m-        </section>[m
[31m-[m
[31m-        {/* RESUMEN LATERAL */}[m
[31m-        <aside className={styles.summary}>[m
[31m-          <h3>Resumen de compra</h3>[m
[31m-[m
[31m-          <div className={styles.shippingOptions}>[m
[31m-            <label>[m
[31m-              <input[m
[31m-                type="radio"[m
[31m-                name="shipping"[m
[31m-                onChange={() => setShipping(0)}[m
[31m-                defaultChecked[m
[31m-              />[m
[31m-              Envío Gratis[m
[31m-            </label>[m
[31m-            <span>Bs. 0.00</span>[m
[31m-[m
[31m-            <label>[m
[31m-              <input[m
[31m-                type="radio"[m
[31m-                name="shipping"[m
[31m-                onChange={() => setShipping(15)}[m
[31m-              />[m
[31m-              Envío Express[m
[31m-            </label>[m
[31m-            <span>Bs. 15.00</span>[m
[31m-          </div>[m
[31m-[m
[31m-          <div className={styles.totals}>[m
[31m-            <p>Subtotal: Bs. {subtotal.toFixed(2)}</p>[m
[31m-            <p>[m
[31m-              <strong>Total: Bs. {total.toFixed(2)}</strong>[m
[31m-            </p>[m
[31m-          </div>[m
[31m-[m
[31m-          <button className={styles.checkout}>Realizar envío</button>[m
[31m-        </aside>[m
[31m-      </div>[m
[32m+[m[32m              </thead>[m
[32m+[m
[32m+[m[32m              <tbody>[m
[32m+[m[32m                {products.map(p => ([m
[32m+[m[32m                  <tr key={p.id} id={`row-${p.id}`}>[m
[32m+[m[32m                    <td className={styles.productCell}>[m
[32m+[m[32m                      <img src={p.img} alt={p.name} />[m
[32m+[m[32m                      <div>[m
[32m+[m[32m                        <p>{p.name}</p>[m
[32m+[m[32m                        <button onClick={() => removeProduct(p.id)}>[m
[32m+[m[32m                          × Eliminar[m
[32m+[m[32m                        </button>[m
[32m+[m[32m                      </div>[m
[32m+[m[32m                    </td>[m
[32m+[m
[32m+[m[32m                    <td className={styles.qtyCell}>[m
[32m+[m[32m                      <button onClick={() => changeQty(p.id, -1)}>-</button>[m
[32m+[m[32m                      <span>{p.qty}</span>[m
[32m+[m[32m                      <button onClick={() => changeQty(p.id, 1)}>+</button>