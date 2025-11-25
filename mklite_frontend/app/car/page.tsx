"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { CartItemService } from "@/app/services/cartItem.service";

// HEADER & FOOTER
///import Header from "@/app/components/Header";
///import Footer from "@/app/components/Footer";

// MODALES DE DIRECCIONES
import AddressEmpty from "./components/AddressEmpty";
import AddressForm from "./components/AddressForm";
import AddressList from "./components/AddressList";
import AddressConfirm from "./components/AddressConfirm";

type ProductRow = {
  id: number;          // id del cart-item
  productId: number;   // id del producto real
  name: string;
  price: number;
  qty: number;
  img: string;
};

export default function CarPage() {
  const userId = 1; // TEMPORAL hasta login
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [shipping, setShipping] = useState<number>(0);

  // Estados de modales
  const [showEmpty, setShowEmpty] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [addressList, setAddressList] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  // --- Cargar carrito desde backend ---
  useEffect(() => {
    async function load() {
      const cart = await CartItemService.getCartByUser(userId);

      const mapped = cart.map((item) => ({
        id: item.id,
        productId: item.product.id,
        name: item.product.name,
        price: item.product.salePrice,
        qty: item.quantity,
        img: item.product.imageUrl || "/img/default.png",
      }));

      setProducts(mapped);
    }
    load();
  }, []);

  // --- Cambiar cantidad ---
  const changeQty = async (id: number, delta: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.qty + delta);

    await CartItemService.updateQuantityById(id, newQty);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: newQty } : p))
    );
  };

  // --- Eliminar producto ---
  const removeProduct = async (id: number) => {
    await CartItemService.deleteById(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const subtotal = products.reduce((sum, p) => sum + p.price * p.qty, 0);
  const total = subtotal + shipping;

  return (
    <>
      {/* HEADER */}

      <main className={styles.page}>
        <div className={styles.container}>
          {/*  Caja principal */}
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

          {/*  RESUMEN */}
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

        {/* MODALES ACTIVOS */}
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

        {showConfirm && (
          <AddressConfirm
            address={selectedAddress}
            onClose={() => setShowConfirm(false)}
          />
        )}
      </main>

      {/* FOOTER */}
      
    </>
  );
}