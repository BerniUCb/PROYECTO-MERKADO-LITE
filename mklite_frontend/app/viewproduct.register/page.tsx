"use client";

import React, { useEffect, useState } from "react";
import { FaHome, FaShoppingBasket, FaUsers, FaTags, FaCheckCircle } from "react-icons/fa"; 
import styles from "./page.module.css";

import Header from "../components/Header"; 
import Footer from "../components/Footer"; 

// Importar modelos y servicios reales 
import type CategoryCardModel from "../models/categoryCard.model";
import type ProductoCardModel from "../models/productCard.model";
import { createProduct, getProductById, updateProduct, deleteProduct } from "../services/product.service";
import { CategoryService } from "../services/category.service"; 
// Asumimos que estás en una página dinámica de Next.js: /admin/add-product/[id]
import { useParams, useRouter } from 'next/navigation'; 

// ====================================================================
// --- COMPONENTES INTERNOS ---
// ====================================================================

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

// La lógica del formulario (ProductForm content)
const ProductFormContent: React.FC = () => {
    const params = useParams(); // Obtener los parámetros de la URL
    const router = useRouter();
    
    // Captura el ID de la ruta
    const idParam = params.id as string | undefined; 
    
    // Convertimos el ID de la ruta a número, si existe
    const productId: number | undefined = idParam && !isNaN(Number(idParam)) ? Number(idParam) : undefined;
    
    // Si hay un ID numérico, estamos en modo edición.
    const isEditMode = !!productId;

    const initialFormData: Partial<ProductoCardModel> = {
        nombre: '',
        descripcion: '',
        precioVenta: 0,
        unidadMedida: 'Unidad', 
        stockFisico: 0, 
        stockReservado: 0, 
        isActive: true,
        discount: 0,
        categoria: undefined,
    };
    
    const [formData, setFormData] = useState<Partial<ProductoCardModel>>(initialFormData);
    const [categories, setCategories] = useState<CategoryCardModel[]>([]);
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

    // 2. Carga de Datos del Producto Existente (Modo Edición por ID)
    useEffect(() => {
        if (isEditMode && productId) {
            const fetchProductData = async () => {
                try {
                    // LLAMADA AL SERVICIO USANDO ID NUMÉRICO
                    const productData = await getProductById(productId); 
                    
                    // Precargar el formulario con los datos
                    setFormData(productData);
                    
                    if (productData.urlImagen) {
                        setPreviewImage(productData.urlImagen);
                        setUploadedFiles([{ 
                            name: productData.nombre || 'Existing Image', 
                            url: productData.urlImagen, 
                            isUploaded: true 
                        }]);
                    }
                    setMensaje(`Cargando datos para editar: ${productData.nombre}`);
                } catch (error) {
                    console.error("Error al cargar datos del producto:", error);
                    setMensaje(`❌ Error al cargar producto con ID ${productId}. ¿Existe?`);
                }
            };
            fetchProductData();
        } else if (!isEditMode) {
             // Modo Creación
             setFormData(initialFormData);
             setMensaje("Listo para añadir un nuevo producto.");
        }
    }, [productId, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "categoriaId") {
            const selectedCat = categories.find(c => c.id === Number(value));
            setFormData(prev => ({ ...prev, categoria: selectedCat }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewImage(url); 
            
            const newFile = { name: file.name, url: url, isUploaded: true };
            setUploadedFiles(prev => [...prev, newFile]);
            setMensaje(`Imagen ${file.name} lista para enviar.`);
        }
    };
    
    const handleRemoveImage = (urlToRemove: string) => {
        setUploadedFiles(prev => prev.filter(file => file.url !== urlToRemove));
        if (previewImage === urlToRemove) {
            setPreviewImage(null);
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setPreviewImage(null);
        setUploadedFiles([]);
        setMensaje("Formulario reseteado. Listo para añadir producto.");
    }
    // 4. Función de Eliminación
    const handleDelete = async () => {
        const idToDelete = formData.id || productId;
        if (!isEditMode || !idToDelete) return;
        
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto con ID ${idToDelete}? Esta acción es irreversible.`)) return;

        try {
            await deleteProduct(idToDelete); 
            setMensaje(`🗑️ Producto con ID ${idToDelete} eliminado con éxito.`);
            router.push('/admin/products'); // Redirigir a la lista de productos
        } catch (error) {
            setMensaje("❌ Error al eliminar el producto.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const idToUse = formData.id || productId;
        const dataToSend: Partial<ProductoCardModel> = {
            ...formData,
            id: undefined,
            precioVenta: Number(formData.precioVenta),
            stockFisico: Number(formData.stockFisico),
            discount: Number(formData.discount),
            urlImagen: uploadedFiles[0]?.url || undefined, 
            categoria: formData.categoria, 
        };

        try {
          if (isEditMode && idToUse) {
                // Modo Edición: Usamos el ID para la actualización
                const updated = await updateProduct(idToUse, dataToSend); 
                setMensaje(`🔄 Producto "${updated.nombre}" (ID: ${idToUse}) actualizado con éxito.`);
            } else {
            const created = await createProduct(dataToSend);
            setMensaje(`✅ Producto "${created.nombre}" agregado con éxito (ID: ${created.id}).`);
            resetForm();
            }
        } catch (error) {
            console.error("Error al crear producto:", error);
            setMensaje("❌ Error al agregar producto. Revisa la consola.");
        }
    };


    return (
        <div className={styles.content}>
            
            <form className={styles['form-container']} onSubmit={handleSubmit}>
            
            {/* Columna Izquierda: Inputs del Formulario */}
            <div className={styles['form-left']}>
                
                <div className={styles['input-group']}>
                <label>Nombre producto</label>
                <input type="text" name="nombre" value={formData.nombre || ""} onChange={handleChange} required />
                </div>

                <div className={styles['input-group']}>
                <label>Descripcion</label>
                <textarea name="descripcion" rows={4} value={formData.descripcion || ""} onChange={handleChange}></textarea>
                </div>

                <div className={styles['input-group']}>
                <label>Categoría</label>
                <select 
                    name="categoriaId" 
                    value={formData.categoria?.id || ""} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                </div>
                
                <div className={styles['split-group']}>
                
                <div className={`${styles['input-group']} ${styles['half-width']}`}>
                    <label>Codigo</label>
                      <input 
                        type="number" 
                        name="id" 
                        value={formData.id || ''} 
                        onChange={handleChange} 
                        // El ID solo es visible/no editable si estamos editando
                        readOnly={isEditMode} 
                        required={isEditMode} 
                      />                
                    </div>

                <div className={`${styles['input-group']} ${styles['half-width']}`}>
                    <label>Stock Quantity</label>
                    <input 
                    type="number" 
                    name="stockFisico" 
                    value={formData.stockFisico || 0} 
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
                    name="precioVenta" 
                    value={formData.precioVenta || 0} 
                    onChange={handleChange} 
                    placeholder="Bs. ###" 
                    required
                    />
                </div>
                
                <div className={`${styles['input-group']} ${styles['half-width']}`}>
                    <label>Precio Oferta</label>
                    <input 
                    type="number" 
                    step="0.01"
                    name="discount" 
                    value={formData.discount || ''} 
                    onChange={handleChange} 
                    placeholder="Bs. ###"
                    />
                </div>
                </div>

                {mensaje && <p className={styles.message}>{mensaje}</p>}
            </div>
            
            {/* Columna Derecha: Previsualización y Carga de Imágenes */}
            <div className={styles['form-right']}>
                <h3 className={styles['section-title']}>Producto</h3>
                
                <div className={styles['image-preview-box']}>
                    {previewImage ? (
                        <img src={previewImage} alt="Preview principal" className={styles['image-preview-large']} />
                    ) : (
                        <div className={styles['image-empty']}>
                            <span className={styles['image-empty-text']}>Arrastra tu imagen o haz clic para subirla.</span>
                        </div>
                    )}
                </div>
                
                <div className={styles['image-uploader-container']}>
                    <label htmlFor="file-upload" className={styles.dropzone}>
                        {/* El texto del dropzone */}
                        <span className={styles['dropzone-text-label']}>Arrastra tu imagen o haz clic para subirla.</span>
                        <input 
                            id="file-upload" 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            style={{ display: 'none' }}
                        />
                    </label>
                    
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
                      {isEditMode ? 'GUARDAR CAMBIOS' : 'AGREGAR'}</button>
                      {isEditMode && (
                        <button type="button" onClick={handleDelete} className={`${styles.btn} ${styles['btn-delete']}`}>
                            ELIMINAR
                        </button>
                    )}
                    <button type="button" onClick={resetForm} className={`${styles.btn} ${styles['btn-secondary']}`}>
                      {isEditMode ? 'CANCELAR' : 'CANCELAR'}</button>
                </div>
            </div>
            </form>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL QUE INCLUYE HEADER Y FOOTER ---
const AdminProductPage: React.FC = () => {
    const [currentAdminName, setCurrentAdminName] = useState("Admin de Pruebas");
    return (
        <div className={styles['full-page-container']}>
            <Header /> 
            
            <div className={styles['main-content-wrapper']}>
                <div className={styles['app-layout']}>
                    <Sidebar adminName={currentAdminName}/>
                    <ProductFormContent />
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default AdminProductPage;