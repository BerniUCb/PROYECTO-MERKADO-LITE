"use client";

import React, { useEffect, useState } from "react";
import { FaHome, FaShoppingBasket, FaUsers, FaTags, FaCheckCircle } from "react-icons/fa";
import styles from "./page.module.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

// Modelos y servicios
import type CategoryModel from "../models/categoryCard.model";
import type ProductModel from "../models/productCard.model";
import { createProduct, getProductById, updateProduct, deleteProduct } from "../services/product.service";
import { CategoryService } from "../services/category.service";

import { useParams, useRouter } from 'next/navigation';

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

interface SidebarProps {
  adminName: string;
}
const Sidebar: React.FC<SidebarProps> = ({adminName}) => (
  <div className={styles.sidebar}>
    <div className={styles['sidebar-header']}>Bienvenido {adminName}</div>
    <nav className={styles['sidebar-nav']}>
      <ul>
        <li className={styles['nav-item']}><FaHome /> Panel de Control</li>
        <li className={styles['nav-item']}><FaShoppingBasket /> Manejo de Pedidos</li>
        <li className={styles['nav-item']}><FaUsers /> Clientes</li>
        <li className={styles['nav-item']}><FaTags /> Categorías</li>
      </ul>
      <div className={styles['product-section']}>
        <p className={styles['product-title']}>Producto</p>
        <button className={`${styles['add-product-btn']} ${styles.active}`}>Añadir producto</button>
        <button className={styles['list-products-btn']}>Lista de productos</button>
      </div>
    </nav>
  </div>
);

// =============================================================
// FORMULARIO PRINCIPAL
// =============================================================

const ProductFormContent: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const idParam = params.id as string | undefined;
  const productId: number | undefined = idParam && !isNaN(Number(idParam)) ? Number(idParam) : undefined;
  const isEditMode = !!productId;

  const initialFormData: Partial<ProductModel> = {
    name: '',
    description: '',
    salePrice: 0,
    unitOfMeasure: 'Unidad',
    physicalStock: 0,
    reservedStock: 0,
    isActive: true,
  //  discount: 0,
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

  useEffect(() => {
    if (isEditMode && productId) {
      const fetchProductData = async () => {
        try {
          const productData = await getProductById(productId);

          setFormData(productData);

          if (productData.imageUrl) {
            setPreviewImage(productData.imageUrl);
            setUploadedFiles([{
              name: productData.name || "Existing Image",
              url: productData.imageUrl,
              isUploaded: true
            }]);
          }

          setMensaje(`Cargando datos para editar: ${productData.name}`);
        } catch (error) {
          console.error("Error al cargar producto:", error);
          setMensaje(`❌ Error al cargar producto con ID ${productId}.`);
        }
      };

      fetchProductData();
    } else {
      setFormData(initialFormData);
      setMensaje("Listo para añadir un nuevo producto.");
    }
  }, [productId, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
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

  const handleDelete = async () => {
    const idToDelete = formData.id || productId;
    if (!isEditMode || !idToDelete) return;

    if (!window.confirm(`¿Eliminar producto con ID ${idToDelete}?`)) return;

    try {
      await deleteProduct(idToDelete);
      setMensaje(`🗑️ Producto eliminado.`);
      router.push("/admin/products");
    } catch {
      setMensaje("❌ Error al eliminar el producto.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idToUse = formData.id || productId;

    const dataToSend: Partial<ProductModel> = {
      ...formData,
      id: undefined,
      salePrice: Number(formData.salePrice),
      physicalStock: Number(formData.physicalStock),
      //discount: Number(formData.discount),
      imageUrl: uploadedFiles[0]?.url || undefined,
      category: formData.category,
    };

    try {
      if (isEditMode && idToUse) {
        const updated = await updateProduct(idToUse, dataToSend);
        setMensaje(`🔄 Producto "${updated.name}" actualizado.`);
      } else {
        const created = await createProduct(dataToSend);
        setMensaje(`✅ Producto "${created.name}" agregado (ID: ${created.id}).`);
        resetForm();
      }
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al guardar el producto.");
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
              name="categoryId"
              value={formData.category?.id || ""}
              onChange={handleChange}
            >
              <option value="">Selecciona una categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles['split-group']}>

            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>ID Producto</label>

              {isEditMode ? (
                <p><b>{formData.id}</b></p>
              ) : (
                <p style={{ color: "#777" }}>Se generará automáticamente</p>
              )}

              {isEditMode && (
                <input type="hidden" name="id" value={formData.id} />
              )}
            </div>

            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>Stock Quantity</label>
              <input
                type="number"
                name="physicalStock"
                value={formData.physicalStock || 0}
                onChange={handleChange}
                required
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
              />
            </div>

            <div className={`${styles['input-group']} ${styles['half-width']}`}>
              <label>Precio Oferta</label>
              <input
                type="number"
                step="0.01"
                name="discount"
              //  value={formData.discount || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          {mensaje && <p className={styles.message}>{mensaje}</p>}
        </div>

        {/* COLUMNA DERECHA */}
        <div className={styles['form-right']}>
          <h3 className={styles['section-title']}>Producto</h3>

          <div className={styles['image-preview-box']}>
            {previewImage ? (
              <img src={previewImage} alt="Preview" className={styles['image-preview-large']} />
            ) : (
              <div className={styles['image-empty']}>
                <span className={styles['image-empty-text']}>Imagen</span>
              </div>
            )}
          </div>

          <div className={styles['image-uploader-container']}>
            <div className={styles.dropzone}>
              <span className={styles['dropzone-text-label']}>Ingresa el link de la imagen</span>
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
              {isEditMode ? "GUARDAR CAMBIOS" : "AGREGAR"}
            </button>

            {isEditMode && (
              <button type="button" onClick={handleDelete} className={`${styles.btn} ${styles['btn-delete']}`}>
                ELIMINAR
              </button>
            )}

            <button type="button" onClick={resetForm} className={`${styles.btn} ${styles['btn-secondary']}`}>
              CANCELAR
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
  const [currentAdminName, setCurrentAdminName] = useState("Admin de Pruebas");

  return (
    <div className={styles['full-page-container']}>
      <Header />

      <div className={styles['main-content-wrapper']}>
        <div className={styles['app-layout']}>
          <Sidebar adminName={currentAdminName} />
          <ProductFormContent />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProductPage;
