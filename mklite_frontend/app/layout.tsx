import type { Metadata } from 'next';
// 1. IMPORTAMOS QUICKSAND (en lugar de Inter o Geist)
import { Quicksand } from 'next/font/google'; 
import './globals.css';

import Header from './components/Header'; 
import Footer from './components/Footer';

// 2. CONFIGURAMOS QUICKSAND
const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Normal, Semi-bold, Bold
});

export const metadata: Metadata = {
  title: 'Merkado Lite',
  description: 'Tu mercado de confianza',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* 3. APLICAMOS LA FUENTE A TODA LA PÁGINA */}
      <body className={quicksand.className}> 
        
        <Header />

        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        
        <Footer />

      </body>
    </html>
  );
}