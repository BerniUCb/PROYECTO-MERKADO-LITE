"use client";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-red-800 to-red-600 flex items-center justify-center">
      {/* Contenedor central */}
      <div className="flex flex-col items-center p-8 bg-gradient-to-br from-red-700 to-red-900 rounded-2xl shadow-lg">
        <h1 className="text-white text-4xl font-bold mb-6">Bienvenido A</h1>

        {/* Carrito */}
        <div className="text-white mb-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="3 0 18 18"
            strokeWidth={2}
            stroke="none"
            className="w-18 h-20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0L6.75 14.25h10.5l2.25-9H5.106m0 0L4.5 6.75m2.25 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm9.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-white text-4xl font-bold mb-6">Merkado Lite</h1>

        {/* Botones centrales */}
        <div className="flex flex-col space-y-4 w-48">

          {/* Botón Principal */}
          <button
            onClick={() => router.push("/home")}
            className="bg-red-700 text-white font-semibold py-2 rounded-lg shadow hover:bg-red-800 transition"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
