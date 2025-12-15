'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import styles from './page.module.css';

// Componentes
import UserSidebar from '../components/UserSidebar';

// Services & Models
import { WishlistService } from '../services/wishlist.service';
import { CartItemService } from '../services/cartItem.service';
import type WishlistItem from '../models/wishlist.model';

const WishlistPage = () => {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // Para estados de carga al agregar al carrito
  
  // Estado de usuario (simulado o desde localStorage)
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUserId(parsed.id);
    } else {
      setLoading(false); // Si no hay usuario, dejamos de cargar para mostrar mensaje
    }
  }, []);

  // Cargar Wishlist
  const loadWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await WishlistService.getByUser(userId);
      setWishlist(data);
    } catch (error) {
      console.error("Error cargando wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadWishlist();
    }
  }, [userId]);

  // --- HANDLERS ---

  // Eliminar un item
  const handleRemove = async (id: number) => {
    if (!confirm("¿Quitar producto de la lista?")) return;
    try {
      await WishlistService.remove(id);
      // Actualización optimista
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  // Agregar uno al carrito
  const handleAddToCart = async (product: any) => {
    if (!userId) return;
    if (product.physicalStock <= 0) return alert("Producto sin stock");

    setProcessing(true);
    try {
      await CartItemService.addToCart(userId, product.id, 1);
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error(error);
      alert("Error al agregar al carrito");
    } finally {
      setProcessing(false);
    }
  };

  // Agregar TODOS al carrito
  const handleAddAllToCart = async () => {
    if (!userId || wishlist.length === 0) return;
    if (!confirm("¿Agregar todos los productos disponibles al carrito?")) return;

    setProcessing(true);
    try {
      // Filtramos solo los que tienen stock
      const availableItems = wishlist.filter(item => item.product.physicalStock > 0);
      
      if (availableItems.length === 0) {
        alert("Ningún producto tiene stock disponible.");
        return;
      }

      // Ejecutamos las promesas en paralelo
      await Promise.all(
        availableItems.map(item => CartItemService.addToCart(userId, item.product.id, 1))
      );

      alert(`${availableItems.length} productos agregados al carrito.`);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al agregar algunos productos.");
    } finally {
      setProcessing(false);
    }
  };

  // Calcular Total
  const totalValue = wishlist.reduce((acc, item) => acc + Number(item.product.salePrice), 0);

  if (!userId) {
     return (
        <div className={styles.layout}>
             <UserSidebar />
             <div className={styles.container}>
                 <div className={styles.emptyState}>Inicia sesión para ver tu lista de deseos.</div>
             </div>
        </div>
     );
  }

  return (
    <div className={styles.layout}>
      <UserSidebar />

      <main className={styles.container}>
        <h1 className={styles.title}>Mi Lista de Deseos</h1>
        <p className={styles.subtitle}>
            Tienes {wishlist.length} productos en tu lista de deseos
        </p>

        {loading ? (
            <div className={styles.loading}>Cargando lista...</div>
        ) : wishlist.length === 0 ? (
            <div className={styles.emptyState}>
                <p>Tu lista de deseos está vacía.</p>
                <Link href="/home" className={styles.btnSecondary} style={{marginTop: 10, display: 'inline-block'}}>
                    Explorar productos
                </Link>
            </div>
        ) : (
            <>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlist.map((item) => (
                                <tr key={item.id}>
                                    {/* Columna Producto */}
                                    <td className={styles.productCol}>
                                        <div className={styles.productInfo}>
                                            <div className={styles.imgWrapper}>
                                                <img 
                                                    src={item.product.imageUrl || '/placeholder.png'} 
                                                    alt={item.product.name} 
                                                />
                                            </div>
                                            <div className={styles.productText}>
                                                <span className={styles.productName}>{item.product.name}</span>
                                                <span className={styles.productCat}>
                                                    Categoría: {item.product.category?.name || 'General'}
                                                </span>
                                                <span className={styles.productSku}>SKU: PROD-{item.product.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Columna Precio */}
                                    <td className={styles.priceCol}>
                                        <span className={styles.price}>
                                            Bs. {Number(item.product.salePrice).toFixed(2)}
                                        </span>
                                        {/* Precio tachado simulado si hubiera promo */}
                                        {/* <span className={styles.oldPrice}>Bs. 40.00</span> */}
                                    </td>

                                    {/* Columna Stock */}
                                    <td className={styles.stockCol}>
                                        {item.product.physicalStock > 0 ? (
                                            <span className={styles.inStock}>● En Stock</span>
                                        ) : (
                                            <span className={styles.outStock}>● Agotado</span>
                                        )}
                                    </td>

                                    {/* Columna Acciones */}
                                    <td className={styles.actionsCol}>
                                        <div className={styles.actionGroup}>
                                            <button 
                                                className={styles.btnAddCart}
                                                onClick={() => handleAddToCart(item.product)}
                                                disabled={processing || item.product.physicalStock <= 0}
                                            >
                                                <ShoppingCart size={16} /> 
                                                {item.product.physicalStock <= 0 ? 'Agotado' : 'Agregar al Carrito'}
                                            </button>
                                            <button 
                                                className={styles.btnRemove} 
                                                onClick={() => handleRemove(item.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer de la lista */}
                <div className={styles.footer}>
                    <div className={styles.totalSection}>
                        <span className={styles.totalLabel}>Valor Total de la Lista</span>
                        <span className={styles.totalValue}>Bs. {totalValue.toFixed(2)}</span>
                    </div>
                    <div className={styles.footerButtons}>
                        <button 
                            className={styles.btnAddAll} 
                            onClick={handleAddAllToCart}
                            disabled={processing}
                        >
                            Agregar Todos al Carrito
                        </button>
                        <Link href="/" className={styles.btnContinue}>
                            Continuar Comprando
                        </Link>
                    </div>
                </div>
            </>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;