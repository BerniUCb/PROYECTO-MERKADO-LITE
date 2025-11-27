"use client";

import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";

// Modelos y servicios
import type CategoryModel from "../../../models/categoryCard.model";
import type ProductModel from "../../../models/productCard.model";
import { ProductService } from "../../../services/product.service";
import { CategoryService } from "../../../services/category.service";

// =============================================================
// COMPONENTES INTERNOS
// =============================================================

interface ImageListItemProps {
  name: string;
  url: string;
  isUploaded: boolean;
  onRemove: () => void;
}

const ImageListItem: React.FC<ImageListItemProps> = ({ name, url, isUploaded, onRemove }) => (
  <div className={styles['image-list-item']}>
    <img src={url} alt={name} className={styles['image-placeholder-small']} />
    <span className={styles['image-name']}>{name}</span>
    {isUploaded ? (
      <FaCheckCircle className={styles['check-icon']} />
    ) : (
      <button type="button" onClick={onRemove} className={styles['remove-btn']}>X</button>
    )}
  </div>
);

// =============================================================
// FORMULARIO PRINCIPAL
// =============================================================

const ProductFormContent: React.FC = () => {
  
  const initialFormData: Partial<ProductModel> = {
    name: '',
    description: '',
    salePrice: 0,
    unitOfMeasure: 'Unidad',
    physicalStock: 0,
    reservedStock: 0,
    isActive: true,
    category: undefined,
  };

  const [formData, setFormData] = useState<Partial<ProductModel>>(initialFormData);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, url: string, isUploaded: boolean}[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await CategoryService.getAll();
        setCategories(cats);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategories();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      // Buscamos el objeto completo de la categoría para mostrarlo en la UI, pero NO lo enviaremos así al backend
      const selectedCat = categories.find(c => c.id === Number(value));
      setFormData(prev => ({ ...prev, category: selectedCat }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    setUploadedFiles(prev => prev.filter(file => file.url !== urlToRemove));
    if (previewImage === urlToRemove) setPreviewImage(null);
  };

  const handleImageUrl = (url: string) => {
    if (!url) return;
    setPreviewImage(url);
    setUploadedFiles([
      { name: "Imagen desde URL", url, isUploaded: true }
    ]);
    setMensaje("Imagen cargada desde URL correctamente.");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setPreviewImage(null);
    setUploadedFiles([]);
    setMensaje("Formulario reseteado.");
  };

  // --- VERSIÓN CORREGIDA DE HANDLESUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de Categoría
    if (!formData.category?.id) {
      alert("Por favor selecciona una categoría.");
      return;
    }

    // 2. Construcción Limpia del Payload (Sanitización de datos)
    const payload: any = {
      name: formData.name,
      // Enviamos undefined si está vacío para que el backend use su valor por defecto (null)
      description: formData.description ? formData.description : undefined, 
      salePrice: Number(formData.salePrice),
      unitOfMeasure: formData.unitOfMeasure || "Unidad",
      physicalStock: Number(formData.physicalStock),
      reservedStock: 0,
      isActive: true,
      // Enviamos undefined si no hay imagen
      imageUrl: uploadedFiles[0]?.url ? uploadedFiles[0].url : undefined, 
      
      // ENVIAMOS EL ID DE LA CATEGORÍA CON EL NOMBRE EXACTO DEL DTO
      category_id: Number(formData.category.id)
    };

    try {
        const created = await ProductService.create(payload);
        
        setMensaje(`✅ Producto "${created.name}" agregado correctamente.`);
        resetForm();

    } catch (error: any) {
      console.error("Error en creación:", error);
      // Intentamos mostrar el mensaje específico que devuelve el backend
      const errorMsg = error.response?.data?.message || error.message || "Error desconocido";
      setMensaje(`❌ Error al guardar: ${errorMsg}`);
    }
  };

  return (
    <div className={styles.content}>
      <form className={styles['form-container']} onSubmit={handleSubmit}>

        {/* COLUMNA IZQUIERDA */}
        <div className={styles['form-left']}>

          <div className={styles['input-group']}>
            <label>Nombre producto</label>
            <input type="text" name="name" value={formData.name || ""} onChange={handleChange} required />
          </div>

          <div className={styles['input-group']}>
            <label>Descripción</label>
            <textarea name="description" rows={4} value={formData.description || ""} onChange={handleChange}></textarea>
          </div>

          <div className={styles['input-group']}>
            <label>Categoría</label>
            <select
              name="categoryId" // Este name coincide con la lógica del handleChange
              value={formData.category?.id || ""}
              onChange={handleChange}
              required // Obligatorio HTML
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles['split-group']}>
            <div className={`${styles['input-group']} ${styles['half-width']}`}>
            <label>Codigo Producto</label>
              <p style={{ color: "#777", fontSize: '0.9rem', marginTop: '8px', background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                Automático
              </p>
            </div>
            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>Stock Quantity</label>
              <input
                type="number"
                name="physicalStock"
                value={formData.physicalStock || 0}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className={styles['split-group']}>

            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>Precio regular</label>
              <input
                type="number"
                step="0.01"
                name="salePrice"
                value={formData.salePrice || 0}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>Precio Oferta</label>
              <input 
                value=""
                disabled 
                placeholder="N/A"
                style={{background: '#eee', cursor: 'not-allowed'}}
              />
            </div>
          </div>

          {mensaje && (
            <div style={{
              marginTop: 15, 
              padding: 10, 
              borderRadius: 6, 
              backgroundColor: mensaje.includes("❌") ? "#ffe6e6" : "#e6ffea",
              color: mensaje.includes("❌") ? "#cc0000" : "#008000",
              fontWeight: "bold",
              textAlign: "center"
            }}>
              {mensaje}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA */}
        <div className={styles['form-right']}>
          <h3 className={styles['section-title']}>Imagen del Producto</h3>

          <div className={styles['image-preview-box']}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" className={styles['image-preview-large']} />
            ) : (
              <div className={styles['image-empty']}>
                <span className={styles['image-empty-text']}>Sin Imagen</span>
              </div>
            )}
          </div>

          <div className={styles['image-uploader-container']}>
            <div className={styles.dropzone}>
              <span className={styles['dropzone-text-label']}>URL de la imagen</span>
              <input
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                onChange={(e) => handleImageUrl(e.target.value)}
                className={styles['url-input']}
              />
            </div>

            <div className={styles['image-list']}>
              {uploadedFiles.map((img, index) => (
                <ImageListItem
                  key={index}
                  name={img.name}
                  url={img.url}
                  isUploaded={img.isUploaded}
                  onRemove={() => handleRemoveImage(img.url)}
                />
              ))}
            </div>
          </div>

          <div className={styles['form-actions']}>
            <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
              GUARDAR PRODUCTO
            </button>
                    
            <button type="button" onClick={resetForm} className={`${styles.btn} ${styles['btn-secondary']}`}>
              LIMPIAR
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

// =============================================================
// PÁGINA COMPLETA
// =============================================================

const AdminProductPage: React.FC = () => {
  return (
    <div className={styles['full-page-container']}>
      <div className={styles['main-content-wrapper']}>
        <div className={styles['app-layout']}>
          {/* <AdminSidebar /> */}
          <ProductFormContent />
        </div>
      </div>
    </div>
  );
};

export default AdminProductPage;