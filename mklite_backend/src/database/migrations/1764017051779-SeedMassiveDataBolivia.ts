// src/database/migrations/1764017051779-SeedMassiveDataBolivia.ts

import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../../entity/user.entity";
import { Supplier } from "../../entity/supplier.entity";
import { Product } from "../../entity/product.entity";
import { Lot } from "../../entity/lot.entity";
import { StockMovement } from "../../entity/stock-movement.entity";
import { Promotion } from "../../entity/promotion.entity";
import { Notification } from "../../entity/notification.entity";
import { SupportTicket } from "../../entity/support-ticket.entity";
import { Rating } from "../../entity/rating.entity";
import { Order } from "../../entity/order.entity";

export class SeeSeedMassiveDataBolivia1764017051779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🇧🇴 INICIANDO POBLADO DE DATOS CONTEXTUALES DE BOLIVIA...");

        // 1. ACTUALIZAR USUARIOS (Poner Teléfonos y Direcciones Reales)
        console.log("🔄 Actualizando usuarios con teléfonos y direcciones...");
        
        const usersToUpdate = [
            { email: 'admin@merkadolite.com', phone: '77700001', address: { street: 'Av. Arce', number: '2500', city: 'La Paz', zone: 'Sopocachi' } },
            { email: 'warehouse@merkadolite.com', phone: '60500002', address: { street: 'Calle Innominada', number: 'S/N', city: 'El Alto', zone: 'Villa Adela' } },
            { email: 'delivery@merkadolite.com', phone: '72000003', address: { street: 'Av. Petrolera', number: 'Km 4', city: 'Cochabamba', zone: 'Zona Sur' } },
            { email: 'client1@merkadolite.com', phone: '71500004', address: { street: 'Calle René Moreno', number: '123', city: 'Santa Cruz', zone: 'Equipetrol' } },
            { email: 'client2@merkadolite.com', phone: '76400005', address: { street: 'Av. Salamanca', number: '550', city: 'Cochabamba', zone: 'Quintanilla' } },
            { email: 'seller1@merkadolite.com', phone: '69000006', address: { street: 'Calle Comercio', number: '10', city: 'La Paz', zone: 'Centro' } },
        ];

        for (const data of usersToUpdate) {
            const user = await queryRunner.manager.findOne(User, { where: { email: data.email } });
            if (user) {
                // Actualizar teléfono
                user.phone = data.phone;
                await queryRunner.manager.save(user);

                // CORRECCIÓN: Usar SQL Puro para direcciones para evitar error de 'coordinates'
                const existingAddr = await queryRunner.query(
                    `SELECT address_id FROM addresses WHERE user_id = ${user.id} LIMIT 1`
                );

                if (existingAddr.length === 0) {
                    await queryRunner.query(`
                        INSERT INTO addresses (street, street_number, city, state, postal_code, address_alias, user_id, is_default)
                        VALUES ('${data.address.street}', '${data.address.number}', '${data.address.city}', '${data.address.city}', '0000', '${data.address.zone}', ${user.id}, true)
                    `);
                }
            }
        }

        // =================================================================================
        // 2. CREAR PROVEEDORES REALES
        // =================================================================================
        console.log("🏭 Creando Proveedores Nacionales...");

        const suppliersConfig = [
            { name: "PIL Andina S.A.", contact: "Dpto Ventas", email: "pedidos@pil.bo", phone: "800104444", categoryIds: [1] },
            { name: "Alicorp Bolivia (Fino/Don Vittorio)", contact: "Juan Distribuidor", email: "ventas@alicorp.com.bo", phone: "77299999", categoryIds: [2] },
            { name: "EMBOL S.A. (Coca-Cola)", contact: "Preventa", email: "preventa@embol.com", phone: "800102653", categoryIds: [3] },
            { name: "Unilever Andina", contact: "Gerente Regional", email: "info@unilever.bo", phone: "22114455", categoryIds: [4] },
            { name: "Avícola Sofía", contact: "Ventas Mayorista", email: "ventas@sofia.com.bo", phone: "71544444", categoryIds: [5] },
            { name: "Arcor / Arcor", contact: "Distribuidora Dulce", email: "arcor@dist.bo", phone: "65050505", categoryIds: [6] },
            { name: "Cervecería Boliviana Nacional", contact: "Agencia Central", email: "ventas@cbn.bo", phone: "800102222", categoryIds: [3] }
        ];

        const suppliersMap = new Map();

        for (const conf of suppliersConfig) {
            // Verificar si ya existe para no duplicar en re-runs
            let savedSupplier = await queryRunner.manager.findOne(Supplier, { where: { companyName: conf.name } });
            
            if (!savedSupplier) {
                const supplier = queryRunner.manager.create(Supplier, {
                    companyName: conf.name,
                    contactName: conf.contact,
                    email: conf.email,
                    phone: conf.phone
                });
                savedSupplier = await queryRunner.manager.save(supplier);
            }
            
            conf.categoryIds.forEach(catId => suppliersMap.set(catId, savedSupplier));
            if (conf.name.includes("Cervecería")) suppliersMap.set("CBN", savedSupplier);
        }

        // =================================================================================
        // 3. CREAR LOTES Y STOCK
        // =================================================================================
        console.log("📦 Llenando almacén con Lotes...");

        const products = await queryRunner.manager.find(Product, { relations: ['category'] });
        const adminUser = await queryRunner.manager.findOne(User, { where: { role: 'Admin' } });

        if (adminUser) {
            for (const product of products) {
                // Evitar crear lotes si ya tiene stock (para re-runs)
                if (product.physicalStock > 0) continue;

                let supplier = suppliersMap.get(product.category.id);
                if (product.category.id === 3 && (product.name.includes("Paceña") || product.name.includes("Huari"))) {
                    supplier = suppliersMap.get("CBN");
                }
                if (!supplier) continue;

                const lot1 = queryRunner.manager.create(Lot, {
                    product: product,
                    supplier: supplier,
                    receivedQuantity: 100,
                    currentQuantity: 100,
                    supplierCost: Number((product.salePrice * 0.75).toFixed(2)),
                    receivedAt: new Date('2024-01-15'),
                    expiresAt: new Date('2024-12-31')
                });
                const savedLot1 = await queryRunner.manager.save(lot1);

                await queryRunner.manager.save(StockMovement, {
                    product, lot: savedLot1, quantity: 100, type: 'purchase_entry', user: adminUser
                });
                
                // Actualizar stock físico del producto
                product.physicalStock += 100;
                await queryRunner.manager.save(product);
            }
        }

        // =================================================================================
        // 4. PROMOCIONES
        // =================================================================================
        const findProd = (namePart: string) => products.find(p => p.name.includes(namePart));
        const promos = [
            { name: "Coca Cola", discount: 10, desc: "Descuento refrescante" },
            { name: "Fernet Branca", discount: 15, desc: "Pack Jueves" },
        ];

        for (const promoData of promos) {
            const product = findProd(promoData.name);
            if (product) {
                 // Verificar duplicados
                 const existingPromo = await queryRunner.manager.findOne(Promotion, { where: { description: promoData.desc } });
                 if (!existingPromo) {
                    const promo = queryRunner.manager.create(Promotion, {
                        description: promoData.desc,
                        discountType: 'percentage',
                        discountValue: promoData.discount,
                        startsAt: new Date(),
                        endsAt: new Date(new Date().setDate(new Date().getDate() + 7)),
                        product: product
                    });
                    await queryRunner.manager.save(promo);
                 }
            }
        }
        
        console.log("✅ SEED MASIVO COMPLETADO.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // No hacemos nada en down para no romper integridad en dev
    }
}