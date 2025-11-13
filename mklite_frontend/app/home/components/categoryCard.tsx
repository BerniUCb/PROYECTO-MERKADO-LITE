// categoryCard.tsx
import styles from './categoryCard.module.css';
import { IconType } from 'react-icons';

interface CategoryCardProps {
  name: string;
  IconComponent: IconType; // Tipo del componente de icono
}

export default function CategoryCard({ name, IconComponent }: CategoryCardProps) {
  return (
    <div className={styles.card}>
      {/* Contenedor para el icono */}
      <div className={styles.iconContainer}>
        {/* Renderiza el icono */}
        <IconComponent className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3>{name}</h3>
      </div>
    </div>
  );
}




