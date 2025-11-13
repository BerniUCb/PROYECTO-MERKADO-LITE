import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css'; 

import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full bg-red-600 text-white py-4 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-wide">MERKADO LITE</h1>

      <nav className="space-x-6">
        <a href="#productos" className="hover:underline">
          Productos
        </a>
        <a href="#categorias" className="hover:underline">
          Categorías
        </a>
        <a href="#beneficios" className="hover:underline">
          Beneficios
        </a>
      </nav>

      <button className="bg-white text-red-600 rounded-full p-2 hover:bg-red-100 transition">
        <ShoppingCart size={22} />
      </button>
    </header>
  );
}