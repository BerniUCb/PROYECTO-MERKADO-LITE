"use client";

import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  const handleEnter = () => {
    const userRaw = localStorage.getItem("user");

    // 🟢 Si no hay sesión → home
    if (!userRaw) {
      router.push("/home");
      return;
    }

    try {
      const user = JSON.parse(userRaw);
      const role = user.role?.toLowerCase();

      // 🔥 Redirección por rol
      if (role === "deliverydriver") {
        router.push("/rider");
        return;
      }

      if (role === "admin") {
        router.push("/admin");
        return;
      }

      // 👤 Cualquier otro rol
      router.push("/home");
    } catch {
      // Si el user está corrupto
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-800 to-red-600">
      <div className="flex flex-col items-center justify-center px-10 py-12 bg-gradient-to-br from-red-700 to-red-900 rounded-3xl shadow-2xl max-w-sm w-full text-center">
        <h1 className="text-white text-3xl font-bold mb-2">
          Bienvenido a
        </h1>

        <div className="my-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            className="w-20 h-20"
          >
            <path d="M3 3h1.5l2.4 9h10.5l2.3-7H6.1" />
            <circle cx="9" cy="19" r="1.5" />
            <circle cx="17" cy="19" r="1.5" />
          </svg>
        </div>

        <h2 className="text-white text-4xl font-extrabold mb-8 tracking-wide">
          Merkado Lite
        </h2>

        <button
          onClick={handleEnter}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
