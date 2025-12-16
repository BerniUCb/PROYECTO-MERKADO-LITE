import { IconType } from "react-icons";
import { MdPendingActions, MdLocalOffer } from "react-icons/md";
import { FaTruck, FaCheckCircle, FaCommentDots } from "react-icons/fa";
import { HiExclamation } from "react-icons/hi";

export const notificationIcons: Record<string, IconType> = {
  ORDER_RECEIVED: MdPendingActions,
  ORDER_SHIPPED: FaTruck,
  ORDER_DELIVERED: FaCheckCircle,
  NEW_PROMOTION: MdLocalOffer,

  // Extras para tu pantalla 
  MESSAGE: FaCommentDots,
  URGENT: HiExclamation,
};
