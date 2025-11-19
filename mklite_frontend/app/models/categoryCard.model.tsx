import { IconType } from "react-icons";

export default interface CategoryModel {
  id: number;
  name: string;
  description?: string;
  IconComponent?: IconType;
}
