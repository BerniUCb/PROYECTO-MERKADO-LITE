"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { CartItemService } from "@/app/services/cartItem.service";
import { AddressService } from "@/app/services/address.service";
import { OrderService } from "@/app/services/order.service";
import UserSidebar from "../components/UserSidebar";

import AddressEmpty from "./components/AddressEmpty";
import AddressList from "./components/AddressList";
import AddressConfirm from "./components/AddressConfirm";

import type AddressModel from "@/app/models/address.model";

type ProductRow = {
  id: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  img: string;
};

export default function CarPage() {
  const router = useRouter();

  const [userId, setUserId] = useState<number>(0);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [addresses, setAddresses] = useState<AddressModel[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressModel | null>(null);

  const [shipping, setShipping] = useState(0);

  const [showEmpty, setShowEmpty] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ================= USER =================
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    setUserId(JSON.parse(stored).id);
  }, []);

  // ================= CARRITO =================
  useEffect(() => {
    if (!userId) return;

    async function loadCart() {
      const cart = await CartItemService.getCartByUser(userId);
      setProducts(
        cart.map((item) => ({
          id: item.id,
          productId: item.product.id,
          name: item.product.name,
          price: Number(item.product.salePrice),
          qty: item.quantity,
          img: item.product.imageUrl || "/img/default.png",
        }))
      );
    }

    loadCart();
  }, [userId]);

  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const total = subtotal + shipping;

  // ================= DIRECCIONES =================
  const loadAddresses = async () => {
    const data = await AddressService.getAll(userId);
    setAddresses(data);
    data.length === 0 ? setShowEmpty(true) : setShowList(true);
  };

  // ================= CONFIRMAR PEDIDO =================
  const confirmOrder = async () => {
    if (!selectedAddress) return;

    const order = await OrderService.create({
      user_id: userId,
      paymentMethod: "cash",
      status: "pending",
      items: products.map((p) => ({
        productId: p.productId,
        quantity: p.qty,
      })),
    });

    // 🔥 VACIAR CARRITO DESPUÉS DE CONFIRMAR
    await Promise.all(
      products.map((p) => CartItemService.deleteById(p.id))
    );

    router.push(`/user/confirmation?orderId=${order.id}`);
  };

  if (!userId) return <p>Cargando...</p>;

  return (
    <div className={styles.layoutWrapper}>
      <UserSidebar />

      <div className={styles.mainWrapper}>
        <main className={styles.page}>
          <div className={styles.container}>
            {/* CARRITO */}
            <section className={styles.cartBox}>
              <div className={styles.header}>
                <h1>Tu Carrito</h1>
                <p>Hay {products.length} productos en tu carrito!</p>
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
                        </div>
                      </td>

                      <td className={styles.qtyCell}>
                        <span>{p.qty}</span>
                      </td>

                      <td>Bs. {p.price.toFixed(2)}</td>
                      <td>Bs. {(p.price * p.qty).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            {/* RESUMEN */}
            <aside className={styles.summary}>
              <h3>Resumen de compra</h3>

              <div className={styles.totals}>
                <p>Subtotal: Bs. {subtotal.toFixed(2)}</p>
                <p>
                  <strong>Total: Bs. {total.toFixed(2)}</strong>
                </p>
              </div>

              <button className={styles.checkout} onClick={loadAddresses}>
                Realizar envío
              </button>
            </aside>
          </div>

          {/* MODALES */}
          {showEmpty && (
            <AddressEmpty
              onClose={() => setShowEmpty(false)}
              onAdd={() => router.push("/user/addresses")}
            />
          )}

          {showList && (
            <AddressList
              addresses={addresses}
              onClose={() => setShowList(false)}
              onAdd={() => router.push("/user/addresses")}
              onSelect={(addr) => {
                setSelectedAddress(addr);
                setShowList(false);
                setShowConfirm(true);
              }}
            />
          )}

          {showConfirm && selectedAddress && (
            <AddressConfirm address={selectedAddress} onClose={confirmOrder} />
          )}
        </main>
      </div>
    </div>
  );
}
