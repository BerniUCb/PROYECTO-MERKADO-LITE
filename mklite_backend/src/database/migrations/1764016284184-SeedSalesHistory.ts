// src/database/migrations/TIMESTAMP-SeedSalesHistory.ts

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
        // 1. Obtengo tus 2 clientes 
        const client1 = await queryRunner.manager.findOne(User, { where: { email: 'client1@merkadolite.com' } });
        const client2 = await queryRunner.manager.findOne(User, { where: { email: 'client2@merkadolite.com' } });
        
        // 2. Obtener algunos productos variados (Coca Cola, Leche, etc.)
        // Asumimos que existen porque corriste SeedDataProductos
        const products = await queryRunner.manager.findByIds(Product, [1, 2, 3, 4, 5]);

        if (!client1 || !client2 || products.length === 0) {
            console.log(" Skipping SeedHistory: Clients or Products missing. Run previous seeds first.");
            return;
        }

        // 3. Asegurar direcciones (Si no tienen, les creamos una al vuelo para que el pedido no falle)
        const getOrCreateAddress = async (user: User, alias: string) => {
            let addr = await queryRunner.manager.findOne(Address, { where: { user: { id: user.id } } });
            if (!addr) {
                addr = await queryRunner.manager.save(Address, { 
                    street: 'Calle Seed Histórico', 
                    streetNumber: '123', 
                    city: 'La Paz', 
                    state: 'LP', 
                    postalCode: '0000', 
                    addressAlias: alias,
                    user: user 
                });
            }
            return addr;
        };

        const addr1 = await getOrCreateAddress(client1, 'Casa Cliente 1');
        const addr2 = await getOrCreateAddress(client2, 'Casa Cliente 2');

        // --- FUNCIÓN HELPER PARA CREAR PEDIDOS ---
        const createOrder = async (user: User, address: Address, daysAgo: number, prodItems: any[], status: any = 'delivered') => {
            // Calcular fecha
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);

            // Calcular total
            let total = 0;
            prodItems.forEach(item => total += (item.product.salePrice * item.qty));

            // 1. Crear Orden
            const order = await queryRunner.manager.save(Order, {
                user,
                status,
                paymentMethod: 'cash',
                orderTotal: total,
                createdAt: date // <--- Fecha manipulada
            });

            // 2. Crear Items
            for (const item of prodItems) {
                await queryRunner.manager.save(OrderItem, {
                    order,
                    product: item.product,
                    quantity: item.qty,
                    unitPrice: item.product.salePrice
                });
            }

            // 3. Crear Pago y Envío
            await queryRunner.manager.save(Payment, { order, amount: total, method: 'cash', status: status === 'cancelled' ? 'failed' : 'completed', paidAt: date });
            await queryRunner.manager.save(Shipment, { order, deliveryAddress: address, status: status, deliveredAt: status === 'delivered' ? date : null });
        };

        // --- GENERAR HISTORIAL (Usando solo tus 2 clientes) ---

        // Pedido 1: Cliente 1, Hace 5 días (Completado)
        await createOrder(client1, addr1, 5, [
            { product: products[0], qty: 2 }, // 2x Coca Cola 3L
            { product: products[1], qty: 1 }  // 1x Coca Cola 2L
        ]);

        // Pedido 2: Cliente 2, Hace 3 días (Completado - Venta grande)
        await createOrder(client2, addr2, 3, [
            { product: products[2], qty: 6 }, // 6x Coca Zero
            { product: products[0], qty: 2 }  // 2x Coca Cola 3L
        ]);

        // Pedido 3: Cliente 1, AYER (Cancelado - Para probar filtros de estado)
        await createOrder(client1, addr1, 1, [
            { product: products[3], qty: 1 }
        ], 'cancelled');

        // Pedido 4: Cliente 2, HOY (En proceso - Para el dashboard en tiempo real)
        await createOrder(client2, addr2, 0, [
            { product: products[4], qty: 3 },
            { product: products[1], qty: 2 }
        ], 'processing');

        console.log(" Sales History Seeded: 4 orders created across different dates for Client 1 and Client 2.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        const emails = ['client1@merkadolite.com', 'client2@merkadolite.com'];

    }
}