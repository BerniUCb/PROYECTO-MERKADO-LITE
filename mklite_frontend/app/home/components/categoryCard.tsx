import styles from "./categoryCard.module.css";
import { IconType } from "react-icons";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  slug: string;
  IconComponent: IconType;
}

export default function CategoryCard({ name, slug, IconComponent }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`} className={styles.card}>
      <div className={styles.iconContainer}>
        <IconComponent className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h3>{name}</h3>
      </div>
    </Link>
  );
}






