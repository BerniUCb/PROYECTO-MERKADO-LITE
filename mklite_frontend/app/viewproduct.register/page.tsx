'use client';

import React, { useState } from 'react';
import { FaHome, FaShoppingBasket, FaUsers, FaTags, FaCheckCircle } from 'react-icons/fa';
import styles from './page.module.css';
// NOTA: Asegúrate de instalar react-icons: npm install react-icons

// --- INTERFACE MODIFICADA BASADA EN LA ENTIDAD PRODUCTO ---
interface ProductData {
  nombre: string;
  descripcion: string;
  precioVenta: number | string; 
  unidadMedida: string;
  stockDisponible: number | string; 
  // categoriaId es la llave foránea (categoria_id)
  categoriaId: number | string; 
}
// Los campos 'sku', 'precioRegular', 'precioOferta' de tu formulario original se han eliminado
// o se han mapeado a la estructura de la entidad Producto.

const ImageListItem: React.FC<{ name: string; isUploaded: boolean }> = ({ name, isUploaded }) => (
  <div className={styles['image-list-item']}>
    <div className={styles['image-placeholder']}></div>
    <span className={styles['image-name']}>{name}</span>
    {isUploaded && <FaCheckCircle className={styles['check-icon']} />}
  </div>
);

const Sidebar: React.FC = () => (
  <div className={styles.sidebar}>
    <div className={styles['sidebar-header']}>Bienvenido Pepe</div>
    <nav className={styles['sidebar-nav']}>
      <ul>
        <li className={styles['nav-item']}><FaHome /> Panel de Control</li>
        <li className={styles['nav-item']}><FaShoppingBasket /> Manejo de Pedidos</li>
        <li className={styles['nav-item']}><FaUsers /> Clientes</li>
        <li className={styles['nav-item']}><FaTags /> Categorías</li>
      </ul>
      <div className={styles['product-section']}>
        <p className={styles['product-title']}>Product</p>
        <button className={`${styles['add-product-btn']} ${styles.active}`}>Añadir producto</button>
        <button className={styles['list-products-btn']}>Lista de productos</button>
      </div>
    </nav>
  </div>
);

const ProductForm: React.FC = () => {
  // --- ESTADO INICIAL MODIFICADO ---
  const [formData, setFormData] = useState<ProductData>({
    nombre: '',
    descripcion: '',
    // Mapeo de campos de la entidad
    precioVenta: '', // Corresponde al campo precio_venta
    unidadMedida: 'Unidad', // Nuevo campo requerido por la entidad
    stockDisponible: '', // Corresponde al campo stock_disponible
    categoriaId: '', // Corresponde a la llave foránea categoria_id
  });

  // El campo SKU y PRECIO OFERTA del diseño original NO se envían a la entidad Producto.
  const [sku, setSku] = useState('#32A53');
  const [precioOferta, setPrecioOferta] = useState('Bs. ###');
  

  const uploadedImages = [
    { name: 'Cerveza_Budweiser_lata_269_ml_CBN(1).png', uploaded: true },
    { name: 'Cerveza_Budweiser_lata_269_ml_CBN(2).png', uploaded: true },
    // ... más imágenes
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // El tipo de dato para 'precioVenta', 'stockDisponible', y 'categoriaId'
    // se maneja como string en el input y se convierte al enviarse.
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === 'sku') setSku(value);
      if (name === 'precioOferta') setPrecioOferta(value);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara los datos para que coincidan con los tipos de la entidad TypeORM (number)
    const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precioVenta: parseFloat(String(formData.precioVenta)),
        unidadMedida: formData.unidadMedida,
        stockDisponible: parseInt(String(formData.stockDisponible), 10),
        categoriaId: parseInt(String(formData.categoriaId), 10),
    };

    console.log('Datos del Producto para API (TypeORM):', dataToSend);
    // Lógica para enviar el formulario a la API
  };

  return (
    <div className={styles['app-layout']}>
      <Sidebar />
      <main className={styles.content}>
        <form className={styles['form-container']} onSubmit={handleSubmit}>
          
          <div className={styles['form-left']}>
            
            {/* 1. Campo Nombre Producto (nombre) */}
            <div className={styles['input-group']}>
              <label>Nombre producto</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>

            {/* 2. Campo Descripción (descripcion) */}
            <div className={styles['input-group']}>
              <label>Descripcion</label>
              <textarea name="descripcion" rows={4} value={formData.descripcion} onChange={handleChange}></textarea>
            </div>

            {/* 3. Campo Categoría (categoriaId - FK) */}
            {/* Nota: En una app real, esto sería un <select> */}
            <div className={styles['input-group']}>
              <label>ID Categoría (categoria_id)</label>
              <input 
                  type="text" 
                  name="categoriaId" 
                  value={formData.categoriaId} 
                  onChange={handleChange} 
                  placeholder="ID de la Categoría"
              />
            </div>
            
            <div className={styles['split-group']}>
              
              {/* CAMPO NO MAPPED: SKU (Se mantiene como extra) */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>SKU (No persistido)</label>
                <input type="text" name="sku" value={sku} onChange={handleExtraChange} />
              </div>

              {/* 4. Campo Stock Quantity (stockDisponible) */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Stock Quantity ({'stockDisponible'})</label>
                <input 
                    type="number" 
                    name="stockDisponible" 
                    value={formData.stockDisponible} 
                    onChange={handleChange} 
                    placeholder="Stock"
                />
              </div>
            </div>
            
            <div className={styles['split-group']}>
              
              {/* 5. Campo Precio regular (precioVenta) */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Precio Venta ({'precioVenta'})</label>
                <input 
                    type="number" 
                    step="0.01"
                    name="precioVenta" 
                    value={formData.precioVenta} 
                    onChange={handleChange} 
                    placeholder="0.00" 
                />
              </div>
              
              {/* CAMPO NO MAPPED: Precio Oferta (Se mantiene como extra) */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Precio Oferta (No persistido)</label>
                <input type="text" name="precioOferta" value={precioOferta} onChange={handleExtraChange} />
              </div>
            </div>

            {/* Nuevo campo para unidad_medida (Unidad de Medida) */}
            <div className={styles['input-group']}>
              <label>Unidad de Medida</label>
              <input 
                  type="text" 
                  name="unidadMedida" 
                  value={formData.unidadMedida} 
                  onChange={handleChange} 
                  placeholder="Ej: Kg, Lb, Unidad"
              />
            </div>

          </div>
          
          <div className={styles['form-right']}>
            <h3 className={styles['section-title']}>Producto</h3>
            <div className={styles['image-preview-placeholder']}></div>
            
            <div className={styles['image-uploader-container']}>
              <div className={styles.dropzone}>
                Arrastra tu imagen o haz clic para subirla.
              </div>
              <div className={styles['image-list']}>
                {uploadedImages.map((img, index) => (
                  <ImageListItem key={index} name={img.name} isUploaded={img.uploaded} />
                ))}
              </div>
            </div>
            
            <div className={styles['form-actions']}>
              <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>AGREGAR</button>
              <button type="button" className={`${styles.btn} ${styles['btn-secondary']}`}>CANCELAR</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProductForm;