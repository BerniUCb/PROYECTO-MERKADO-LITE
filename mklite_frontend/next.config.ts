import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Permitir todos los dominios para imágenes remotas
      { 
        protocol: "https", 
        hostname: "**" 
      },
      { 
        protocol: "http", 
        hostname: "**" 
      },
    ],
  },
};

export default nextConfig;
