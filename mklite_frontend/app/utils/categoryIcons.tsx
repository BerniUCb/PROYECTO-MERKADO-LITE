import { GiWorld, GiMilkCarton, GiMeat, GiChipsBag, GiDrinkMe, GiBroom, GiShoppingBag } from "react-icons/gi";

// Mapa de nombreCategoria → Icono
export const categoryIcons: Record<string, any> = {
  "Despensa y Abarrotes": GiShoppingBag, // nuevo icono
  "Lácteos y Derivados": GiMilkCarton,
  "Carnes y Embutidos": GiMeat,
  "Snacks y Golosinas": GiChipsBag,
  "Bebidas": GiDrinkMe,
  "Limpieza del Hogar": GiBroom,
};

// Si no hay un ícono definido, se usa este
export const defaultIcon = GiWorld;

