// src/utils/notificationIcons.tsx
import { MdPendingActions, MdLocalOffer } from "react-icons/md";
import { FaTruck, FaCheckCircle } from "react-icons/fa";

export const notificationIcons: any = {
  ORDER_RECEIVED: MdPendingActions,
  ORDER_SHIPPED: FaTruck,
  ORDER_DELIVERED: FaCheckCircle,
  NEW_PROMOTION: MdLocalOffer,
};
