import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";

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

@Entity('driver_applications')
export class DriverApplication {
    @PrimaryGeneratedColumn({ name: 'application_id' })
    id: number;

    // Cédula de Identidad (Requerimiento del Formulario)
    @Column({ name: 'identity_card', type: 'varchar', length: 20 })
    identityCard: string;

    // Tipo de Vehículo (Requerimiento del Formulario)
    @Column({
        type: 'enum',
        enum: VehicleType,
        name: 'vehicle_type'
    })
    vehicleType: VehicleType;

    // Estado de la solicitud (Control administrativo)
    @Column({
        type: 'enum',
        enum: DriverApplicationStatus,
        default: DriverApplicationStatus.PENDING
    })
    status: DriverApplicationStatus;

    // Fecha de solicitud
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    // Relación: Un usuario hace la solicitud
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user: User;
}