// models/address.model.ts

export default interface AddressModel {
  id: number;
  street: string;
  streetNumber: string;
  internalNumber?: string | null;
  postalCode: string;
  city: string;
  state: string;
  references?: string | null;
  addressAlias: string;
  isDefault: boolean;
  latitude?: number;
longitude?: number;


  userId: number;
}
