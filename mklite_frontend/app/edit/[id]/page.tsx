'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Para volver atrás
import styles from './page.module.css';
import { ArrowLeft, X, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

// Importamos el Sidebar 
import AdminSidebar from '../../components/AdminSidebar';

// Services & Models
import { ProductService } from '../../services/product.service';
import { PromotionService } from '../../services/promotion.service';
import { CategoryService } from '../../services/category.service';
import type ProductModel from '../../models/productCard.model';
import type Promotion from '../../models/promotion.model';
import type CategoryModel from '../../models/categoryCard.model';

// --- TIPOS PARA EL FORMULARIO DE PROMOCIÓN ---
type PromoType = 'PERCENTAGE' | 'FIXED_PRICE' | 'QUANTITY';

interface PromoFormState {
  type: PromoType;
  percentage: number;
  fixedPrice: number;
  buyX: number;
  payY: number;
  comboUnits: number;
  comboPrice: number;
  startDate: string;
  endDate: string;
}

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Estado del Administrador
  const adminName = "Juan Pérez"; // Reemplazo de "Pepe"

  // Estados del Producto
  const [product, setProduct] = useState<Partial<ProductModel>>({});
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  
  // Estados del Modal de Promoción
  const [showPromoModal, setShowPromoModal] = useState<boolean>(false);
  const [promoForm, setPromoForm] = useState<PromoFormState>({
    type: 'FIXED_PRICE', // Default 
    percentage: 0,
    fixedPrice: 0,
    buyX: 0,
    payY: 0,
    comboUnits: 0,
    comboPrice: 0,
    startDate: '',
    endDate: ''
  });

  // --- CARGA DE DATOS ---
  useEffect(() => {
  if (!id) return; // <-- evita que corra con undefined

  const initData = async () => {
    try {
      setLoading(true);

      // 1. categorías
      const cats = await CategoryService.getAll();
      setCategories(cats);

      // 2. producto real por id dinámico
      const prod = await ProductService.getById(Number(id));
      setProduct(prod);

    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  initData();
}, [id]);   


  // --- HANDLERS PRODUCTO ---
  const handleProductChange = (field: keyof ProductModel, value: any) => {
    setProduct(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async () => {
    if (!product.id) return;
    setSaving(true);
    try {
      await ProductService.update(product.id, product);
      alert('Producto actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar producto');
    } finally {
      setSaving(false);
    }
  };

  // --- HANDLERS PROMOCIÓN ---
  const handleOpenPromoModal = () => {
    setShowPromoModal(true);
  };

  const handleClosePromoModal = () => {
    setShowPromoModal(false);
  };

  const handlePromoChange = (field: keyof PromoFormState, value: any) => {
    setPromoForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePromotion = async () => {
    if (!product.id) return;
    
    // Mapeamos el estado local del formulario al modelo del Backend
    const newPromo: Partial<Promotion> = {
      description: `Promoción para ${product.name}`,
      startsAt: promoForm.startDate,
      endsAt: promoForm.endDate,
      // Aquí adaptas la lógica según cómo tu backend espere recibir los tipos
      // Ejemplo: Usamos discountType para el tipo y discountValue para el valor principal
    };

    if (promoForm.type === 'PERCENTAGE') {
      newPromo.discountType = 'PERCENTAGE';
      newPromo.discountValue = promoForm.percentage;
    } else if (promoForm.type === 'FIXED_PRICE') {
      newPromo.discountType = 'FIXED_PRICE';
      newPromo.discountValue = promoForm.fixedPrice;
    } else {
      newPromo.discountType = 'QUANTITY';
      // Para cantidad compleja, podrías guardar un JSON string o usar descripción
      newPromo.description = `Lleva ${promoForm.buyX} Paga ${promoForm.payY}`;
    }

    try {
      // Opción A: Si tu backend espera el objeto producto completo
      // Enviamos el objeto 'product' que ya tenemos en el estado.
      // Al tener el ID, el ORM sabrá enlazarlo.
      const promotionPayload = {
        ...newPromo,
        product: { id: product.id } // Solo necesitamos enviar el ID para la relación
      };
      // NOTA: Asegúrate de que 'product.id' exista antes de enviar.
      if (!product.id) {
        alert("Error: No se puede asignar promoción a un producto sin ID");
        return;
      }
      await PromotionService.create(promotionPayload as any);
      // Actualizamos la UI del producto para mostrar la nueva promo
      // (Esto es visual, depende de si tu producto tiene campo 'promotion' anidado)
      // Actualizar datos del producto desde backend
      const updated = await ProductService.getById(product.id);
      setProduct(updated);

      alert('Promoción guardada exitosamente');
      setShowPromoModal(false);

    } catch (error) {
      console.error(error);
      alert('Error guardando promoción');
    }
  };

  // Cálculo estimado para la vista de Descuento Porcentual
  const estimatedFinalPrice = product.salePrice 
    ? (product.salePrice * (1 - promoForm.percentage / 100)).toFixed(2) 
    : '0.00';

  if (loading) return <div className={styles.loadingScreen}>Cargando producto...</div>;

  return (
    <div className={styles.adminLayout}>
      {/* 1. SIDEBAR (Listo para descomentar) */}
      <AdminSidebar />

      {/* 2. CONTENIDO PRINCIPAL */}
      <main className={styles.mainContent}>
        
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.welcomeTitle}>Bienvenido {adminName}</h1>
        </header>

        {/* Breadcrumb / Back */}
        <div className={styles.backNav}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Formulario de Edición */}
        <div className={styles.editContainer}>
          
          {/* Columna Izquierda: Imagen */}
          <div className={styles.imageColumn}>
            <div className={styles.imagePreview}>
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className={styles.noImage}>Sin Imagen</div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Campos */}
          <div className={styles.formColumn}>
            
            <div className={styles.formGroup}>
              <label>Nombre producto</label>
              <input 
                type="text" 
                value={product.name || ''} 
                onChange={(e) => handleProductChange('name', e.target.value)}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descripcion</label>
              <textarea 
                value={product.description || ''} 
                onChange={(e) => handleProductChange('description', e.target.value)}
                className={styles.textarea}
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría</label>
              <select 
                className={styles.select}
                value={product.category?.id || ''}
                // Lógica simple para cambiar categoría (requiere objeto completo en realidad)
                onChange={(e) => {
                    const cat = categories.find(c => c.id === Number(e.target.value));
                    if(cat) handleProductChange('category', cat);
                }}
              >
                <option value="">Seleccionar...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label>SKU</label>
                <input type="text" value="#32A53" disabled className={`${styles.input} ${styles.disabled}`} />
              </div>
              <div className={styles.formGroup}>
                <label>Stock Quantity</label>
                <input 
                  type="number" 
                  value={product.physicalStock || 0} 
                  onChange={(e) => handleProductChange('physicalStock', Number(e.target.value))}
                  className={styles.input} 
                />
              </div>
            </div>

            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label>Precio regular</label>
                <input 
                  type="text" 
                  value={`Bs. ${product.salePrice || 0}`} 
                  disabled 
                  className={`${styles.input} ${styles.disabled}`} 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Promoción</label>
                <input 
                  type="text" 
                  value={(() => {
                    if (!product.promotions || product.promotions.length === 0) return "null";
                    const activePromo = product.promotions[product.promotions.length - 1];
                    const basePrice = Number(product.salePrice) || 0;
                    const discountVal = Number(activePromo.discountValue) || 0;
                    let nuevoPrecio = basePrice;

                    if (activePromo.discountType === 'PERCENTAGE') {
                        nuevoPrecio = basePrice * (1 - (discountVal / 100));
                    } else if (activePromo.discountType === 'FIXED_PRICE') {
                        nuevoPrecio = discountVal;
                    }
                    
                    if (activePromo.discountType === 'QUANTITY') {
                        return `${activePromo.description || 'Promoción por cantidad'}`;
                    }
                    return `${activePromo.description || 'Oferta'} (Bs. ${nuevoPrecio.toFixed(2)})`;
                 
                  })()}
                  disabled 
                  className={`${styles.input} ${styles.disabled}`} 
                />
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button 
                className={styles.btnPrimary} 
                onClick={handleSaveProduct} 
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'EDITAR PRODUCTO'}
              </button>
              <button 
                className={styles.btnSecondary} 
                onClick={handleOpenPromoModal}
              >
                AÑADIR PROMOCIÓN
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* --- MODAL DE PROMOCIONES --- */}
      {showPromoModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button className={styles.closeBtn} onClick={handleClosePromoModal}>
              <X size={24} />
            </button>
            
            <h2 className={styles.modalTitle}>Añadir promoción</h2>
            
            <div className={styles.formGroup}>
              <label>Tipo de promoción *</label>
              <select 
                className={styles.select}
                value={promoForm.type}
                onChange={(e) => handlePromoChange('type', e.target.value as PromoType)}
              >
                <option value="FIXED_PRICE">Precio promocional</option>
                <option value="PERCENTAGE">Descuento porcentual</option>
                <option value="QUANTITY">Promoción por cantidad</option>
              </select>
              <p className={styles.helperText}>
                {promoForm.type === 'FIXED_PRICE' && "Elige cómo quieres aplicar la promoción a este producto."}
                {promoForm.type === 'PERCENTAGE' && "Aplica un porcentaje de descuento sobre el precio regular."}
                {promoForm.type === 'QUANTITY' && "Configura promociones del tipo 2x1, 3x2 o combo."}
              </p>
            </div>

            <hr className={styles.divider} />

            {/* --- CONTENIDO DINÁMICO DEL MODAL --- */}
            
            {/* 1. PRECIO PROMOCIONAL (FIXED) */}
            {promoForm.type === 'FIXED_PRICE' && (
              <div className={styles.promoSection}>
                <h3>Precio promocional</h3>
                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label>Precio anterior</label>
                    <input type="text" value={`Bs. ${product.salePrice || 0}`} disabled className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio nuevo *</label>
                    <input 
                        type="number" 
                        placeholder="Ej. Bs. 8.50" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('fixedPrice', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. DESCUENTO PORCENTUAL */}
            {promoForm.type === 'PERCENTAGE' && (
              <div className={styles.promoSection}>
                <h3>Descuento porcentual</h3>
                <span className={styles.subLabel}>CÁLCULO DEL PRECIO</span>
                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label>Precio base</label>
                    <input type="text" value={`Bs. ${product.salePrice || 0}`} disabled className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Descuento (%) *</label>
                    <input 
                        type="number" 
                        placeholder="Ej. 15" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('percentage', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label>Precio final (estimado)</label>
                    <input type="text" value={`Bs. ${estimatedFinalPrice}`} disabled className={styles.input} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Etiqueta en la tienda</label>
                    <input type="text" value={`-${promoForm.percentage}% OFF`} disabled className={styles.input} />
                  </div>
                </div>
              </div>
            )}

            {/* 3. PROMOCIÓN POR CANTIDAD */}
            {promoForm.type === 'QUANTITY' && (
              <div className={styles.promoSection}>
                <h3>Promoción por cantidad</h3>
                <span className={styles.subLabel}>COMPRA X Y PAGA Y</span>
                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label>Compra (unidades)</label>
                    <input 
                        type="number" 
                        placeholder="Bs. 10.50" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('buyX', Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Paga (unidades)</label>
                    <input 
                        type="number" 
                        placeholder="Ej. 15" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('payY', Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className={styles.helperText}>Ejemplos: 2x1, 3x2. Si no quieres usar este formato, deja estos campos vacíos.</p>
                
                <div style={{marginTop: '1rem'}}></div>
                <span className={styles.subLabel}>LLEVA N POR UN PRECIO FIJO</span>
                <div className={styles.rowGroup}>
                  <div className={styles.formGroup}>
                    <label>Lleva (Unidades)</label>
                    <input 
                        type="number" 
                        placeholder="Ej. 3" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('comboUnits', Number(e.target.value))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Precio total del combo</label>
                    <input 
                        type="number" 
                        placeholder="Ej. Bs. 25.00" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('comboPrice', Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* VIGENCIA (Común para todos) */}
            <div className={styles.promoSection}>
              <h3>Vigencia</h3>
              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label>Fecha de inicio</label>
                  <div className={styles.dateInputWrapper}>
                    <input 
                        type="date" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('startDate', e.target.value)}
                    />
                    {/* <Calendar size={18} className={styles.calendarIcon} /> */}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Fecha de fin</label>
                  <div className={styles.dateInputWrapper}>
                    <input 
                        type="date" 
                        className={styles.input}
                        onChange={(e) => handlePromoChange('endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <p className={styles.helperText} style={{marginTop: '1rem'}}>
                La promoción se mostrará en la tienda y solo será válida dentro del rango de fechas configurado.
              </p>
            </div>

            {/* Footer Modal */}
            <div className={styles.modalFooter}>
              <button className={styles.btnCancel} onClick={handleClosePromoModal}>Cancelar</button>
              <button className={styles.btnSavePromo} onClick={handleSavePromotion}>Guardar Promoción</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EditProductPage;