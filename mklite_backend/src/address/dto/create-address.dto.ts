export class CreateAddressDto {
    calle: string;
    numeroExterior: string;
    numeroInterior?: string;
    codigoPostal: string;
    ciudad: string;
    estado: string;
    referencias?: string;
    aliasDireccion?: string;
    // El usuario_id lo obtendremos del usuario autenticado, no lo pedimos aquí.
}

