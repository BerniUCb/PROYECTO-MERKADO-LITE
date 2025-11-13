'use client';

import React, { useState } from 'react';
import { FaHome, FaShoppingBasket, FaUsers, FaTags, FaCheckCircle } from 'react-icons/fa';
import styles from './page.module.css';
// NOTA: Asegúrate de instalar react-icons: npm install react-icons

interface ProductData {
  nombre: string;
  descripcion: string;
  categoria: string;
  sku: string;
  stockQuantity: string;
  precioRegular: string;
  precioOferta: string;
}

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
  const [formData, setFormData] = useState<ProductData>({
    nombre: '',
    descripcion: '',
    categoria: '',
    sku: '#32A53',
    stockQuantity: '211',
    precioRegular: 'Bs. ###',
    precioOferta: 'Bs. ###',
  });

  const uploadedImages = [
    { name: 'Cerveza_Budweiser_lata_269_ml_CBN(1).png', uploaded: true },
    { name: 'Cerveza_Budweiser_lata_269_ml_CBN(2).png', uploaded: true },
    // ... más imágenes
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos del Producto:', formData);
    // Lógica para enviar el formulario a la API
  };

  return (
    <div className={styles['app-layout']}>
      <Sidebar />
      <main className={styles.content}>
        <form className={styles['form-container']} onSubmit={handleSubmit}>
          
          <div className={styles['form-left']}>
            {/* Campo Nombre Producto */}
            <div className={styles['input-group']}>
              <label>Nombre producto</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
            </div>

            {/* Campo Descripción */}
            <div className={styles['input-group']}>
              <label>Descripcion</label>
              <textarea name="descripcion" rows={4} value={formData.descripcion} onChange={handleChange}></textarea>
            </div>

            {/* Campo Categoría */}
            <div className={styles['input-group']}>
              <label>Categoría</label>
              <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} />
            </div>
            
            <div className={styles['split-group']}>
              {/* Campo SKU */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>SKU</label>
                <input type="text" name="sku" value={formData.sku} onChange={handleChange} />
              </div>
              {/* Campo Stock Quantity */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Stock Quantity</label>
                <input type="text" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} />
              </div>
            </div>
            
            <div className={styles['split-group']}>
              {/* Campo Precio Regular */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Precio regular</label>
                <input type="text" name="precioRegular" value={formData.precioRegular} onChange={handleChange} />
              </div>
              {/* Campo Precio Oferta */}
              <div className={`${styles['input-group']} ${styles['half-width']}`}>
                <label>Precio Oferta</label>
                <input type="text" name="precioOferta" value={formData.precioOferta} onChange={handleChange} />
              </div>
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

// NOTA: Para usar este componente, impórtalo y renderízalo en tu App.tsx o index.tsx principal.
// Ejemplo: import './ProductoForm.css';
// Ejemplo: <ProductForm />