"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { CartItemService } from "@/app/services/cartItem.service";

// MODALES
import AddressEmpty from "./components/AddressEmpty";
import AddressForm from "./components/AddressForm";
import AddressList from "./components/AddressList";
import AddressConfirm from "./components/AddressConfirm";

import type AddressModel from "@/app/models/address.model";
import UserSidebar from "../components/UserSidebar";

type ProductRow = {
  id: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  img: string;
};

export default function CarPage() {
  // userId REAL
  const [userId, setUserId] = useState<number>(0);

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [shipping, setShipping] = useState(0);

  // Modales
  const [showEmpty, setShowEmpty] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [addressList, setAddressList] = useState<AddressModel[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);

  // ============================================================
  // 1) OBTENER USER DESDE LOCALSTORAGE
  // ============================================================
  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.id); // SIEMPRE será número → NO null
    }
  }, []);

  // ============================================================
  // 2) CARGAR CARRITO CUANDO userId YA ESTÁ LISTO
  // ============================================================
  useEffect(() => {
    if (!userId) return; // si userId == 0, aún no está listo.

    async function load() {
      const cart = await CartItemService.getCartByUser(userId);

      const mapped = cart.map((item) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: Number(item.product.salePrice),
        qty: item.quantity,
        img: item.product.imageUrl || "/img/default.png",
      }));

      setProducts(mapped);
    }

    load();
  }, [userId]);

  // ============================================================
  // CAMBIAR CANTIDAD
  // ============================================================
  const changeQty = async (id: number, delta: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.qty + delta);

    await CartItemService.updateQuantityById(id, newQty);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: newQty } : p))
    );
  };

  // ============================================================
  // ELIMINAR PRODUCTO
  // ============================================================
  const removeProduct = async (id: number) => {
    await CartItemService.deleteById(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // TOTAL
  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const total = subtotal + shipping;

  // ============================================================
  // MOSTRAR ANTES DE CARGAR USER
  // ============================================================
  if (userId === 0) return <p>Cargando carrito...</p>;

return (
  <div className={styles.layoutWrapper}>
    
    {/* SIDEBAR */}
    <UserSidebar />

    {/* CONTENIDO PRINCIPAL */}
    <div className={styles.mainWrapper}>
      <main className={styles.page}>
        <div className={styles.container}>
          
          {/* CARRITO */}
          <section className={styles.cartBox}>
            <div className={styles.header}>
              <h1>Tu Carrito</h1>
              <p>Hay {products.length} productos en tu carrito!</p>

              <button
                className={styles.clear}
                onClick={() => setProducts([])}
              >
                Limpiar Carrito
              </button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio U.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.productCell}>
                      <img src={p.img} alt={p.name} />
                      <div>
                        <p>{p.name}</p>
                        <button onClick={() => removeProduct(p.id)}>
                          × Eliminar
                        </button>
                      </div>
                    </td>

                    <td className={styles.qtyCell}>
                      <button onClick={() => changeQty(p.id, -1)}>-</button>
                      <span>{p.qty}</span>
                      <button onClick={() => changeQty(p.id, 1)}>+</button>
                    </td>

                    <td className={styles.price}>
                      Bs. {p.price.toFixed(2)}
                    </td>

                    <td className={styles.subtotal}>
                      Bs. {(p.price * p.qty).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* RESUMEN */}
          <aside className={styles.summary}>
            <h3>Resumen de compra</h3>

            <div className={styles.shippingOptions}>
              <label>
                <input
                  type="radio"
                  name="shipping"
                  onChange={() => setShipping(0)}
                  defaultChecked
                />
                Envío Gratis
              </label>
              <span>Bs. 0.00</span>

              <label>
                <input
                  type="radio"
                  name="shipping"
                  onChange={() => setShipping(15)}
                />
                Envío Express
              </label>
              <span>Bs. 15.00</span>
            </div>

            <div className={styles.totals}>
              <p>Subtotal: Bs. {subtotal.toFixed(2)}</p>
              <p>
                <strong>Total: Bs. {total.toFixed(2)}</strong>
              </p>
            </div>

            <button
              className={styles.checkout}
              onClick={() => {
                if (addressList.length === 0) setShowEmpty(true);
                else setShowList(true);
              }}
            >
              Realizar envío
            </button>
          </aside>
        </div>

        {/* MODALES */}
        {showEmpty && (
          <AddressEmpty
            onClose={() => setShowEmpty(false)}
            onAdd={() => {
              setShowEmpty(false);
              setShowForm(true);
            }}
          />
        )}

        {showForm && (
          <AddressForm
            onClose={() => setShowForm(false)}
            onSave={(address) => {
              setAddressList((prev) => [...prev, address]);
              setShowForm(false);
              setShowList(true);
            }}
          />
        )}

        {showList && (
          <AddressList
            addresses={addressList}
            onClose={() => setShowList(false)}
            onAdd={() => {
              setShowList(false);
              setShowForm(true);
            }}
            onSelect={(addr) => {
              setSelectedAddress(addr);
              setShowList(false);
              setShowConfirm(true);
            }}
          />
        )}

        {showConfirm && selectedAddress && (
          <AddressConfirm
            address={selectedAddress}
            onClose={() => setShowConfirm(false)}
          />
        )}
      </main>
    </div>
  </div>
);




}
