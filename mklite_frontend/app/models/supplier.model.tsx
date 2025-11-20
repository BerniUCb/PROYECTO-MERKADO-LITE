import Lot from "./lot.model";

export default interface Supplier {
  id: number;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  createdAt: string;
  lots: Lot[];
}
