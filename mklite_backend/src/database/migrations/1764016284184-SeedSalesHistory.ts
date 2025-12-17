// src/database/migrations/1764016284184-SeedSalesHistory.ts

import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../../entity/user.entity";
import { Product } from "../../entity/product.entity";
import { Order } from "../../entity/order.entity";
import { OrderItem } from "../../entity/order-item.entity";
import { Payment } from "../../entity/payment.entity";
import { Shipment } from "../../entity/shipment.entity";
import { Address } from "../../entity/address.entity";

export class SeedSalesHistory1764016284184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Obtener clientes
        const client1 = await queryRunner.manager.findOne(User, { where: { email: 'client1@merkadolite.com' } });
        const client2 = await queryRunner.manager.findOne(User, { where: { email: 'client2@merkadolite.com' } });
        
        // 2. Obtener productos
        const products = await queryRunner.manager.findByIds(Product, [1, 2, 3, 4, 5]);

        if (!client1 || !client2 || products.length === 0) {
            console.log("⚠️ Skipping SeedHistory: Clients or Products missing.");
            return;
        }

        // 3. Asegurar direcciones (USANDO SQL PURO PARA EVITAR ERROR DE COORDINATES)
        const getOrCreateAddress = async (user: User, alias: string): Promise<Address> => {
            // A. Intentar buscar con SQL directo
            const existing = await queryRunner.query(
                `SELECT address_id FROM addresses WHERE user_id = ${user.id} LIMIT 1`
            );

            if (existing.length > 0) {
                // Si existe, devolvemos un objeto "falso" que solo tiene el ID.
                // A TypeORM le basta con el ID para relacionarlo después en el Shipment.
                return { id: existing[0].address_id } as Address;
            }

            // B. Si no existe, INSERTAR con SQL directo (sin tocar la columna coordinates)
            // Usamos RETURNING address_id para obtener el ID generado
            const insertResult = await queryRunner.query(`
                INSERT INTO addresses (street, street_number, city, state, postal_code, address_alias, user_id, is_default)
                VALUES ('Calle Seed Histórico', '123', 'La Paz', 'LP', '0000', '${alias}', ${user.id}, true)
                RETURNING address_id
            `);

            // Devolvemos el objeto con el nuevo ID
            return { id: insertResult[0].address_id } as Address;
        };

        const addr1 = await getOrCreateAddress(client1, 'Casa Cliente 1');
        const addr2 = await getOrCreateAddress(client2, 'Casa Cliente 2');

        // --- FUNCIÓN HELPER PARA CREAR PEDIDOS (ESTO SIGUE IGUAL) ---
        const createOrder = async (user: User, address: Address, daysAgo: number, prodItems: any[], status: any = 'delivered') => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            let total = 0;
            prodItems.forEach(item => total += (item.product.salePrice * item.qty));

            // Crear Orden
            const order = await queryRunner.manager.save(Order, {
                user,
                status,
                paymentMethod: 'cash',
                orderTotal: total,
                createdAt: date
            });

            // Crear Items
            for (const item of prodItems) {
                await queryRunner.manager.save(OrderItem, {
                    order,
                    product: item.product,
                    quantity: item.qty,
                    unitPrice: item.product.salePrice
                });
            }

            // Crear Pago y Envío
            // TypeORM usará address.id aquí, así que nuestro truco de arriba funciona
            await queryRunner.manager.save(Payment, { order, amount: total, method: 'cash', status: status === 'cancelled' ? 'failed' : 'completed', paidAt: date });
            await queryRunner.manager.save(Shipment, { order, deliveryAddress: address, status: status, deliveredAt: status === 'delivered' ? date : null });
        };

        // --- GENERAR HISTORIAL ---
        await createOrder(client1, addr1, 5, [{ product: products[0], qty: 2 }, { product: products[1], qty: 1 }]);
        await createOrder(client2, addr2, 3, [{ product: products[2], qty: 6 }, { product: products[0], qty: 2 }]);
        await createOrder(client1, addr1, 1, [{ product: products[3], qty: 1 }], 'cancelled');
        await createOrder(client2, addr2, 0, [{ product: products[4], qty: 3 }, { product: products[1], qty: 2 }], 'processing');

        console.log("✅ Sales History Seeded successfully.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       // No hace falta lógica compleja aquí para dev
    }
}