export class CreateAddressDto {
    street: string;
    streetNumber: string;
    internalNumber?: string;
    postalCode: string;
    city: string;
    state: string;
    references?: string;
    addressAlias?: string;
    latitude?: number;
    longitude?: number;
    // Ya no necesitamos 'userId' aquí
}