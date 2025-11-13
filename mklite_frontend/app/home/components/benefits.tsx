"use client";

import React from "react";
import { FaTags, FaShippingFast, FaGift, FaThLarge, FaUndo } from "react-icons/fa";

const Benefits = () => {
  const benefits = [
    {
      id: 1,
      icon: <FaTags size={28} color="#d9534f" />,
      title: "Mejores precios y ofertas",
      desc: "En pedidos desde Bs. 50",
    },
    {
      id: 2,
      icon: <FaShippingFast size={28} color="#d9534f" />,
      title: "Envío gratis",
      desc: "Atención 24/7",
    },
    {
      id: 3,
      icon: <FaGift size={28} color="#d9534f" />,
      title: "Ofertas del día",
      desc: "Al registrarte",
    },
    {
      id: 4,
      icon: <FaThLarge size={28} color="#d9534f" />,
      title: "Amplia variedad",
      desc: "Descuentos increíbles",
    },
    {
      id: 5,
      icon: <FaUndo size={28} color="#d9534f" />,
      title: "Devoluciones fáciles",
      desc: "Dentro de 30 días",
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "#fff",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px",
      }}
    >
      {benefits.map((b) => (
        <div
          key={b.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            padding: "15px 20px",
            minWidth: "220px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            flex: "1 1 220px",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <div>{b.icon}</div>
          <div style={{ textAlign: "left" }}>
            <h4 style={{ margin: "0", fontSize: "15px", color: "#222" }}>{b.title}</h4>
            <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#666" }}>{b.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Benefits;



