import { GiFruitBowl, GiCarrot, GiMilkCarton, GiMeat, GiChipsBag, GiDrinkMe, GiBroom } from "react-icons/gi";

//  Mapa de nombreCategoria → Icono
export const categoryIcons: Record<string, any> = {
  "Frutas": GiFruitBowl,
  "Verduras": GiCarrot,
  "Lácteos": GiMilkCarton,
  "Carnes": GiMeat,
  "Snacks": GiChipsBag,
  "Bebidas": GiDrinkMe,
  "Limpieza": GiBroom,
};

// Si no hay un ícono definido, se usa este
export const defaultIcon = GiFruitBowl;
