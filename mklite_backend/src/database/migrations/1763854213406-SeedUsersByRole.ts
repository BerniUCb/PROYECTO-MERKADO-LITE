// src/database/migrations/1763854213406-SeedUsersByRole.ts

import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class SeedUsersByRole1763854213406 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Generar el hash de la contraseña una sola vez
        const password = 'Password123!';
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 2. Definir la lista de usuarios a crear
        // Formato: [Nombre Completo, Email, Rol]
        const usersData = [
            ['Admin User', 'admin@merkadolite.com', 'Admin'],
            ['Warehouse User', 'warehouse@merkadolite.com', 'Warehouse'],
            ['Delivery Driver User', 'delivery@merkadolite.com', 'DeliveryDriver'],
            ['Support User', 'support@merkadolite.com', 'Support'],
            ['Supplier User', 'supplier@merkadolite.com', 'Supplier'],
            ['Seller User 1 (Cajero)', 'seller1@merkadolite.com', 'Seller'],
            ['Seller User 2 (Cajero)', 'seller2@merkadolite.com', 'Seller'],
            ['Client User 1', 'client1@merkadolite.com', 'Client'],
            ['Client User 2', 'client2@merkadolite.com', 'Client'],
        ];

        // 3. Insertar usando SQL PURO
        // Esto evita errores si la entidad User cambia en el futuro (ej. se agrega 'phone')
        for (const user of usersData) {
            // Verificamos si existe antes de insertar para evitar errores de duplicados
            const exists = await queryRunner.query(`SELECT 1 FROM "users" WHERE "email" = $1`, [user[1]]);
            
            if (exists.length === 0) {
                await queryRunner.query(
                    `INSERT INTO "users" ("full_name", "email", "password_hash", "role", "is_active") 
                     VALUES ($1, $2, $3, $4, true)`,
                    [user[0], user[1], passwordHash, user[2]]
                );
            }
        }

        console.log('✅ Users seeded successfully using Raw SQL (Safe Mode).');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Borrar los usuarios creados
        await queryRunner.query(`
            DELETE FROM "users" WHERE "email" IN (
                'admin@merkadolite.com', 
                'warehouse@merkadolite.com', 
                'delivery@merkadolite.com',
                'support@merkadolite.com', 
                'supplier@merkadolite.com', 
                'seller1@merkadolite.com',
                'seller2@merkadolite.com', 
                'client1@merkadolite.com', 
                'client2@merkadolite.com'
            )
        `);
        console.log('🔥 Seeded users removed successfully.');
    }
}