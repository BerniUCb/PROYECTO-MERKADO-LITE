// src/database/migrations/TIMESTAMP-SeedMassiveDataBolivia.ts

import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../../entity/user.entity";
import { Address } from "../../entity/address.entity";
import { Supplier } from "../../entity/supplier.entity";
import { Product } from "../../entity/product.entity";
import { Lot } from "../../entity/lot.entity";
import { StockMovement } from "../../entity/stock-movement.entity";
import { Promotion } from "../../entity/promotion.entity";
import { Notification } from "../../entity/notification.entity";

// RECUERDA: Actualiza el nombre de la clase con el timestamp de tu archivo
export class SeeSeedMassiveDataBolivia1764017051779 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("🇧🇴 INICIANDO POBLADO DE DATOS CONTEXTUALES DE BOLIVIA...");

        // =================================================================================
        // 1. ACTUALIZAR USUARIOS (Poner Teléfonos y Direcciones Reales)
        // =================================================================================
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

                // Verificar si tiene dirección, si no, crearla
                const existingAddr = await queryRunner.manager.findOne(Address, { where: { user: { id: user.id } } });
                if (!existingAddr) {
                    const newAddr = queryRunner.manager.create(Address, {
                        street: data.address.street,
                        streetNumber: data.address.number,
                        city: data.address.city,
                        state: data.address.city, // Usamos ciudad como estado para simplificar
                        postalCode: '0000',
                        addressAlias: data.address.zone,
                        user: user,
                        isDefault: true
                    });
                    await queryRunner.manager.save(newAddr);
                }
            }
        }

        // =================================================================================
        // 2. CREAR PROVEEDORES REALES (Mapeados a tus Categorías)
        // =================================================================================
        console.log("🏭 Creando Proveedores Nacionales...");

        // Definimos proveedores y qué categorías (IDs) atienden principalmente
        const suppliersConfig = [
            { name: "PIL Andina S.A.", contact: "Dpto Ventas", email: "pedidos@pil.bo", phone: "800104444", categoryIds: [1] }, // Lácteos
            { name: "Alicorp Bolivia (Fino/Don Vittorio)", contact: "Juan Distribuidor", email: "ventas@alicorp.com.bo", phone: "77299999", categoryIds: [2] }, // Despensa
            { name: "EMBOL S.A. (Coca-Cola)", contact: "Preventa", email: "preventa@embol.com", phone: "800102653", categoryIds: [3] }, // Bebidas
            { name: "Unilever Andina", contact: "Gerente Regional", email: "info@unilever.bo", phone: "22114455", categoryIds: [4] }, // Limpieza
            { name: "Avícola Sofía", contact: "Ventas Mayorista", email: "ventas@sofia.com.bo", phone: "71544444", categoryIds: [5] }, // Carnes
            { name: "Arcor / Arcor", contact: "Distribuidora Dulce", email: "arcor@dist.bo", phone: "65050505", categoryIds: [6] }, // Snacks
            { name: "Cervecería Boliviana Nacional", contact: "Agencia Central", email: "ventas@cbn.bo", phone: "800102222", categoryIds: [3] } // Extra Bebidas
        ];

        const suppliersMap = new Map(); // Para guardar referencia y usarlos luego

        for (const conf of suppliersConfig) {
            const supplier = queryRunner.manager.create(Supplier, {
                companyName: conf.name,
                contactName: conf.contact,
                email: conf.email,
                phone: conf.phone
            });
            const savedSupplier = await queryRunner.manager.save(supplier);
            
            // Guardamos el proveedor en un mapa por cada categoría que atiende
            conf.categoryIds.forEach(catId => suppliersMap.set(catId, savedSupplier));
            
            // Caso especial: CBN también atiende bebidas (Cat 3), lo manejaremos manualmente abajo si es necesario
            if (conf.name.includes("Cervecería")) suppliersMap.set("CBN", savedSupplier);
        }

        // =================================================================================
        // 3. CREAR LOTES Y STOCK (Inteligente: Proveedor correcto por Producto)
        // =================================================================================
        console.log("📦 Llenando almacén con Lotes y Fechas de Vencimiento...");

        const products = await queryRunner.manager.find(Product, { relations: ['category'] });
        const adminUser = await queryRunner.manager.findOne(User, { where: { role: 'Admin' } });

        for (const product of products) {
            // Buscar el proveedor correcto para la categoría de este producto
            let supplier = suppliersMap.get(product.category.id);
            
            // Ajuste fino: Si es Cerveza, usar CBN, si es otro de cat 3, usa Embol
            if (product.category.id === 3 && (product.name.includes("Paceña") || product.name.includes("Huari") || product.name.includes("Maltín"))) {
                supplier = suppliersMap.get("CBN");
            }

            if (!supplier) continue; // Seguridad

            // Crear 2 lotes para cada producto para tener variedad de fechas
            // Lote 1: Antiguo (Vence pronto)
            const lot1 = queryRunner.manager.create(Lot, {
                product: product,
                supplier: supplier,
                receivedQuantity: 100,
                currentQuantity: Math.floor(Math.random() * 50), // Queda poco
                supplierCost: Number((product.salePrice * 0.75).toFixed(2)),
                receivedAt: new Date('2024-01-15'),
                expiresAt: new Date('2024-12-31') // Vence fin de año
            });
            const savedLot1 = await queryRunner.manager.save(lot1);

            // Registrar movimiento entrada Lote 1
            await queryRunner.manager.save(StockMovement, {
                product, lot: savedLot1, quantity: 100, type: 'purchase_entry', user: adminUser
            });

            // Lote 2: Nuevo (Vence el próximo año)
            const lot2 = queryRunner.manager.create(Lot, {
                product: product,
                supplier: supplier,
                receivedQuantity: 200,
                currentQuantity: 200, // Lleno
                supplierCost: Number((product.salePrice * 0.80).toFixed(2)), // Subió el precio un poco
                receivedAt: new Date(), // Hoy
                expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // Vence en 1 año
            });
            const savedLot2 = await queryRunner.manager.save(lot2);

             // Registrar movimiento entrada Lote 2
             await queryRunner.manager.save(StockMovement, {
                product, lot: savedLot2, quantity: 200, type: 'purchase_entry', user: adminUser
            });
        }

        // =================================================================================
        // 4. CREAR PROMOCIONES (Combos Reales)
        // =================================================================================
        console.log("🏷️ Creando Promociones de temporada...");

        // Helper para buscar producto por nombre parcial
        const findProd = (namePart: string) => products.find(p => p.name.includes(namePart));

        const promos = [
            { name: "Coca Cola", discount: 10, desc: "Descuento refrescante de fin de semana" },
            { name: "Fernet Branca", discount: 15, desc: "Pack Jueves de Fraternidad" },
            { name: "Pañales", discount: 20, desc: "Descuento especial Bebé" }, // Si hubiera
            { name: "Pollo Sofía", discount: 5, desc: "Domingo de Parrilla" },
            { name: "Leche Pil", discount: 8, desc: "Nutrición escolar" }
        ];

        for (const promoData of promos) {
            const product = findProd(promoData.name);
            if (product) {
                const promo = queryRunner.manager.create(Promotion, {
                    description: promoData.desc,
                    discountType: 'percentage',
                    discountValue: promoData.discount,
                    startsAt: new Date(),
                    endsAt: new Date(new Date().setDate(new Date().getDate() + 7)), // Dura 1 semana
                    product: product
                });
                await queryRunner.manager.save(promo);
            }
        }

        // =================================================================================
        // 5. NOTIFICACIONES AL CLIENTE
        // =================================================================================
        const client1 = await queryRunner.manager.findOne(User, { where: { email: 'client1@merkadolite.com' } });
        if (client1) {
            await queryRunner.manager.save(Notification, {
                title: "¡Tu pedido está en camino!",
                detail: "El repartidor está a 5 cuadras de tu ubicación en Equipetrol.",
                type: "ORDER_SHIPPED",
                recipientRole: "Client",
                user: client1,
                isRead: false
            });
            await queryRunner.manager.save(Notification, {
                title: "Oferta Flash: Pollo Sofía",
                detail: "Aprovecha el descuento del 5% solo por hoy.",
                type: "NEW_PROMOTION",
                recipientRole: "Client",
                user: client1,
                isRead: true
            });
        }

        console.log("✅ SEED MASIVO COMPLETADO: DB lista para Demo.");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Limpieza básica en orden inverso de dependencia
        await queryRunner.query(`DELETE FROM "notifications"`);
        await queryRunner.query(`DELETE FROM "promotions"`);
        await queryRunner.query(`DELETE FROM "stock_movements"`);
        await queryRunner.query(`DELETE FROM "lots"`);
        await queryRunner.query(`DELETE FROM "suppliers"`);
        // No borramos usuarios ni productos para no romper seeds anteriores
    }
}