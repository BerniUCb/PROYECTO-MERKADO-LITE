'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import AdminSidebar from '../../components/AdminSidebar'; // Asegúrate de tener el Sidebar

// Iconos (usamos lucide-react para compatibilidad)
import { Search, Plus, X, ShoppingCart, CheckCircle } from 'lucide-react';

// Services & Models
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import type ProductModel from '../../models/productCard.model';
import type Order from '../../models/order.model';

// Tipo local para el item del carrito (producto + cantidad de venta)
interface CartItem {
  product: ProductModel;
  quantity: number;
}

export default function VentasEnTienda() {
  // --- ESTADOS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ProductModel[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Estados de Pago
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash', 'qr', 'card'
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Referencia para debounce en búsqueda
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- BÚSQUEDA DE PRODUCTOS ---
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    // Debounce para no saturar el backend mientras escribe
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        // Como no tienes un endpoint específico de búsqueda por nombre en tu service,
        // usaremos getAll y filtraremos en cliente por ahora. 
        // (Idealmente deberías tener ProductService.search(term))
        const allProducts = await ProductService.getAll();
        
        const filtered = allProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.id.toString().includes(searchTerm) 
          // Si tuvieras código SKU en el modelo, también filtrarías por él
        );
        setSearchResults(filtered.slice(0, 5)); // Mostrar top 5 resultados
      } catch (error) {
        console.error("Error buscando productos:", error);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms delay

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm]);

  // --- MANEJO DEL CARRITO ---
  
  const addToCart = (product: ProductModel) => {
    if (product.physicalStock <= 0) {
        alert("Producto sin stock");
        return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Verificar si al sumar 1 no excedemos el stock
        if (existingItem.quantity + 1 > product.physicalStock) {
            alert("No hay suficiente stock disponible.");
            return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    // Limpiar búsqueda después de agregar (opcional)
    // setSearchTerm(""); 
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, newQty: number) => {
    if (newQty < 1) return;
    
    setCart(prev => prev.map(item => {
        if (item.product.id === productId) {
            // Validar stock máximo
            if (newQty > item.product.physicalStock) {
                alert(`Solo hay ${item.product.physicalStock} unidades disponibles.`);
                return item;
            }
            return { ...item, quantity: newQty };
        }
        return item;
    }));
  };

  // --- CÁLCULOS ---
  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  const discount = 0; // Puedes implementar lógica de descuento aquí si quieres
  const total = subtotal - discount;
  
  const received = parseFloat(receivedAmount) || 0;
  const change = received >= total ? received - total : 0;

  // --- REGISTRAR VENTA ---
  const handleRegisterSale = async () => {
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    if (paymentMethod === 'cash' && received < total) {
        alert("El monto recibido es menor al total.");
        return;
    }

    if (!confirm("¿Confirmar venta y actualizar stock?")) return;

    setIsProcessing(true);
    try {
      // Preparamos el objeto Order según tu CreateOrderDto
      const newOrderData = {
        user_id: 1, // ID del admin o usuario genérico "Venta Mostrador"
        paymentMethod: paymentMethod,
        status: 'delivered', // Venta en tienda se entrega inmediatamente
        items: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
        }))
      };

      // Enviamos al backend
      // Nota: 'create' en tu service usa Omit<Order...>, pero tu backend espera un DTO con user_id e items planos.
      // Necesitas ajustar tu OrderService.create para que acepte el formato que espera el backend si es diferente al modelo.
      // Aquí asumiremos que tu backend controller hace la magia o que ajustamos el service.
      
      // Opción 1: Usar el servicio tal cual si mapea bien
      await OrderService.create(newOrderData as any); 

      alert("✅ Venta registrada con éxito!");
      
      // Limpiar todo
      setCart([]);
      setReceivedAmount("");
      setSearchTerm("");
      setSearchResults([]);
      
      // Opcional: Recargar productos si quieres actualizar el stock visual en la búsqueda
      
    } catch (error) {
      console.error("Error registrando venta:", error);
      alert("Hubo un error al registrar la venta.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDER ---
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />

      <main className={styles.mainContent}>
        <div className={styles.wrapper}>
            <h1 className={styles.title}>Ventas en tienda</h1>
            <p className={styles.subtitle}>
                Registra ventas presenciales y descuenta stock en tiempo real.
            </p>

            <div className={styles.grid}>
                
                {/* COLUMNA IZQUIERDA: BUSCADOR */}
                <div className={styles.leftColumn}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Buscar productos</h2>
                        <p className={styles.cardSub}>Busca por nombre o código y agrégalos a la venta.</p>

                        <div className={styles.searchBox}>
                            <input
                                className={styles.searchInput}
                                placeholder="Ej: Leche Pil, Yogurt o Código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className={styles.searchBtn}>
                                {isSearching ? '...' : <Search size={16}/>}
                            </button>
                        </div>

                        <div className={styles.resultsList}>
                            {searchResults.length === 0 && searchTerm.length > 0 && !isSearching && (
                                <div className={styles.emptyState}>No se encontraron productos</div>
                            )}

                            {searchResults.map(product => (
                                <div key={product.id} className={styles.productItem}>
                                    <div className={styles.productInfo}>
                                        <div className={styles.productName}>{product.name}</div>
                                        <div className={styles.productCode}>
                                            ID: {product.id} · {product.category?.name || 'Sin categoría'}
                                        </div>
                                        {product.physicalStock > 0 ? (
                                            <span className={`${styles.stock} ${styles.stockLowGreen}`}>
                                                Stock: {product.physicalStock} uds
                                            </span>
                                        ) : (
                                            <span className={`${styles.stock} ${styles.stockZero}`}>
                                                Sin stock
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.productRight}>
                                        <span className={styles.price}>Bs. {Number(product.salePrice).toFixed(2)}</span>
                                        <button 
                                            className={product.physicalStock > 0 ? styles.addBtn : styles.addBtnDisabled}
                                            onClick={() => addToCart(product)}
                                            disabled={product.physicalStock <= 0}
                                        >
                                            {product.physicalStock > 0 ? <><Plus size={12} style={{marginRight:4}}/> Agregar</> : 'Agotado'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.card} style={{flex: 1}}>
                        <h2 className={styles.cardTitle}>Detalle de la venta</h2>
                        <p className={styles.cardSub}>Productos añadidos al carrito actual.</p>
                        
                        <div className={styles.scrollWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th style={{textAlign:'center'}}>Cant</th>
                                        <th style={{textAlign:'right'}}>Precio</th>
                                        <th style={{textAlign:'right'}}>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.length === 0 && (
                                        <tr><td colSpan={5} style={{textAlign:'center', padding: '20px', color: '#999'}}>Carrito vacío</td></tr>
                                    )}
                                    {cart.map((item) => (
                                        <tr key={item.product.id}>
                                            <td>{item.product.name}</td>
                                            <td style={{textAlign:'center'}}>
                                                <input
                                                    className={styles.qtyInput}
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                                                    min="1"
                                                />
                                            </td>
                                            <td style={{textAlign:'right'}}>Bs. {Number(item.product.salePrice).toFixed(2)}</td>
                                            <td style={{textAlign:'right'}}>Bs. {(item.product.salePrice * item.quantity).toFixed(2)}</td>
                                            <td style={{textAlign:'center'}}>
                                                <button className={styles.removeBtn} onClick={() => removeFromCart(item.product.id)}>
                                                    <X size={16}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.tableFooter}>
                            Productos en la venta: <strong>{cart.length}</strong>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: TOTALES Y PAGO */}
                <div className={styles.rightColumn}>
                    <div className={styles.cardFinal}>
                        <h2 className={styles.cardTitle}>Resumen</h2>
                        <p className={styles.cardSub}>Finalizar transacción</p>

                        <div className={styles.totalRow}>
                            <span>Subtotal</span> <strong>Bs. {subtotal.toFixed(2)}</strong>
                        </div>
                        <div className={styles.totalRow}>
                            <span>Descuento</span> <strong>Bs. {discount.toFixed(2)}</strong>
                        </div>
                        <div className={`${styles.totalRow} ${styles.totalFinal}`}>
                            <span>Total a pagar</span> <strong>Bs. {total.toFixed(2)}</strong>
                        </div>

                        <hr className={styles.divider}/>

                        <div className={styles.payForm}>
                            <div className={styles.formGroup}>
                                <label>Método de pago</label>
                                <select 
                                    className={styles.select}
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="cash">Efectivo</option>
                                    <option value="qr">QR</option>
                                    <option value="card">Tarjeta</option>
                                </select>
                            </div>

                            {paymentMethod === 'cash' && (
                                <div className={styles.formGroup}>
                                    <label>Monto recibido</label>
                                    <input 
                                        className={styles.input} 
                                        placeholder="0.00" 
                                        type="number"
                                        value={receivedAmount}
                                        onChange={(e) => setReceivedAmount(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {paymentMethod === 'cash' && (
                            <div className={styles.changeRow}>
                                Cambio: <strong>Bs. {change.toFixed(2)}</strong>
                            </div>
                        )}

                        <button 
                            className={styles.submitBtn} 
                            onClick={handleRegisterSale}
                            disabled={isProcessing || cart.length === 0}
                        >
                            {isProcessing ? 'Procesando...' : 'Registrar Venta'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </main>
    </div>
  );
}