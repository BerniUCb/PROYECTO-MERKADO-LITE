// Copia y pega este código completo en:
// src/database/migrations/1763854213406-SeedUsersByRole.ts

import { MigrationInterface, QueryRunner, In } from "typeorm";
import { User } from "../../entity/user.entity"; // Verificamos que la ruta al User entity sea correcta
import * as bcrypt from 'bcrypt';

// ¡CRÍTICO! El nombre de la clase debe coincidir exactamente con el del archivo.
export class SeedUsersByRole1763854213406 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // --- Seguridad: Hashear la contraseña antes de guardarla ---
        const password = 'Password123!';
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // --- Definimos los usuarios a crear ---
        const usersToSeed: Partial<User>[] = [
            // 1. Un usuario por cada rol principal
            {
                fullName: 'Admin User',
                email: 'admin@merkadolite.com',
                passwordHash,
                role: 'Admin',
                isActive: true,
            },
            {
                fullName: 'Warehouse User',
                email: 'warehouse@merkadolite.com',
                passwordHash,
                role: 'Warehouse',
                isActive: true,
            },
            {
                fullName: 'Delivery Driver User',
                email: 'delivery@merkadolite.com',
                passwordHash,
                role: 'DeliveryDriver',
                isActive: true,
            },
            {
                fullName: 'Support User',
                email: 'support@merkadolite.com',
                passwordHash,
                role: 'Support',
                isActive: true,
            },
            {
                fullName: 'Supplier User',
                email: 'supplier@merkadolite.com',
                passwordHash,
                role: 'Supplier',
                isActive: true,
            },
            // 2. Dos "Cajeros" (rol 'Seller')
            {
                fullName: 'Seller User 1 (Cajero)',
                email: 'seller1@merkadolite.com',
                passwordHash,
                role: 'Seller',
                isActive: true,
            },
            {
                fullName: 'Seller User 2 (Cajero)',
                email: 'seller2@merkadolite.com',
                passwordHash,
                role: 'Seller',
                isActive: true,
            },
            // 3. Dos Clientes
            {
                fullName: 'Client User 1',
                email: 'client1@merkadolite.com',
                passwordHash,
                role: 'Client',
                isActive: true,
            },
            {
                fullName: 'Client User 2',
                email: 'client2@merkadolite.com',
                passwordHash,
                role: 'Client',
                isActive: true,
            },
        ];

        // --- Insertamos los usuarios en la base de datos ---
        await queryRunner.manager.getRepository(User).save(usersToSeed);
        console.log('✅ Users seeded successfully.');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // --- Método para revertir: eliminamos los usuarios creados por su email ---
        const userEmails = [
            'admin@merkadolite.com',
            'warehouse@merkadolite.com',
            'delivery@merkadolite.com',
            'support@merkadolite.com',
            'supplier@merkadolite.com',
            'seller1@merkadolite.com',
            'seller2@merkadolite.com',
            'client1@merkadolite.com',
            'client2@merkadolite.com',
        ];

        await queryRunner.manager.getRepository(User).delete({ email: In(userEmails) });
        console.log('🔥 Seeded users removed successfully.');
    }

}