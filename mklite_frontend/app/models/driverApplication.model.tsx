import User from "./user.model";

// Enums idénticos al backend para mantener consistencia
export enum DriverApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum VehicleType {
    MOTO = 'moto',
    AUTO = 'auto',
    BICICLETA = 'bicicleta'
}

export default interface DriverApplication {
    id: number;
    identityCard: string;
    vehicleType: VehicleType;
    status: DriverApplicationStatus;
    createdAt: string; // Las fechas suelen llegar como string ISO desde la API

    // Relación
    user: User;
}