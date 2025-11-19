import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1762892922135 implements MigrationInterface {
    name = 'CreateInitialSchema1762892922135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."pedido_estado_enum" AS ENUM('pendiente', 'procesando', 'en camino', 'entregado', 'devuelto', 'cancelado')`);
        await queryRunner.query(`CREATE TABLE "pedido" ("pedido_id" SERIAL NOT NULL, "fecha_pedido" TIMESTAMP NOT NULL DEFAULT now(), "estado" "public"."pedido_estado_enum" NOT NULL DEFAULT 'pendiente', "total_pedido" numeric NOT NULL, "metodo_pago" character varying NOT NULL, "cliente_id" integer, CONSTRAINT "PK_dc35c54d515c6d9474e75a34ff8" PRIMARY KEY ("pedido_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."envio_estado_enum" AS ENUM('pendiente', 'procesando', 'en camino', 'entregado', 'devuelto', 'cancelado')`);
        await queryRunner.query(`CREATE TABLE "envio" ("envio_id" SERIAL NOT NULL, "estado" "public"."envio_estado_enum" NOT NULL DEFAULT 'pendiente', "fecha_asignacion" TIMESTAMP WITH TIME ZONE, "fecha_entrega_estimada" TIMESTAMP WITH TIME ZONE, "fecha_entregado" TIMESTAMP WITH TIME ZONE, "pedido_id" integer NOT NULL, "repartidor_id" integer, CONSTRAINT "REL_bfb5b4dfbb3d0b8c2e311af238" UNIQUE ("pedido_id"), CONSTRAINT "PK_5338384881e3ad9745f2cc6b373" PRIMARY KEY ("envio_id"))`);
        await queryRunner.query(`CREATE TABLE "categoria" ("categoria_id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" character varying, CONSTRAINT "UQ_6771d90221138c5bf48044fd73d" UNIQUE ("nombre"), CONSTRAINT "PK_9b82a2508e84898351f641b5f6e" PRIMARY KEY ("categoria_id"))`);
        await queryRunner.query(`CREATE TABLE "producto" ("producto_id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "descripcion" text, "precio_venta" numeric NOT NULL, "unidad_medida" character varying NOT NULL, "stock_disponible" integer NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "categoria_id" integer, CONSTRAINT "PK_2415b88c222785d1f2da05acff9" PRIMARY KEY ("producto_id"))`);
        await queryRunner.query(`CREATE TABLE "carrito_item" ("carrito_item_id" SERIAL NOT NULL, "cantidad" integer NOT NULL DEFAULT '1', "fecha_agregado" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cliente_id" integer NOT NULL, "producto_id" integer NOT NULL, CONSTRAINT "UQ_ad41b86f8126d5a6f8491796f5e" UNIQUE ("cliente_id", "producto_id"), CONSTRAINT "PK_fc609045248a1ad5d4b95c4d7ab" PRIMARY KEY ("carrito_item_id"))`);
        await queryRunner.query(`CREATE TABLE "calificacion" ("calificacion_id" SERIAL NOT NULL, "puntuacion" integer NOT NULL, "comentario" text, "fecha_calificacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "pedido_id" integer NOT NULL, "cliente_id" integer NOT NULL, CONSTRAINT "REL_eb8647b917a525b7642dcb92c8" UNIQUE ("pedido_id"), CONSTRAINT "CHK_f83ce86d4becdabf6231376512" CHECK ("puntuacion" >= 1 AND "puntuacion" <= 5), CONSTRAINT "PK_96c47e1a27b96ea089f7d407185" PRIMARY KEY ("calificacion_id"))`);
        await queryRunner.query(`CREATE TABLE "proveedor" ("proveedor_id" SERIAL NOT NULL, "nombre_empresa" character varying NOT NULL, "contacto_nombre" character varying, "email" character varying, "telefono" character varying, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b3bd1980252a2b7058e8aadefee" PRIMARY KEY ("proveedor_id"))`);
        await queryRunner.query(`CREATE TABLE "lote" ("lote_id" SERIAL NOT NULL, "cantidad_recibida" integer NOT NULL, "cantidad_actual" integer NOT NULL, "costo_distribuidor" numeric(10,2), "fecha_recibida" date NOT NULL, "fecha_vencimiento" date, "producto_id" integer NOT NULL, "proveedor_id" integer, CONSTRAINT "PK_ac1d31f2fb5fd2fd6dda1013838" PRIMARY KEY ("lote_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movimiento_stock_tipo_enum" AS ENUM('entrada_compra', 'salida_venta', 'ajuste_vencido', 'ajuste_devolucion')`);
        await queryRunner.query(`CREATE TABLE "movimiento_stock" ("movimiento_id" SERIAL NOT NULL, "cantidad" integer NOT NULL, "tipo" "public"."movimiento_stock_tipo_enum" NOT NULL, "fecha_movimiento" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "producto_id" integer NOT NULL, "lote_id" integer, "usuario_id" integer, CONSTRAINT "PK_3932b77361b29f2fbc9be3d768d" PRIMARY KEY ("movimiento_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."usuario_rol_enum" AS ENUM('Administrador', 'Vendedor', 'Almacen', 'Repartidor', 'Cliente', 'Soporte', 'Proveedor')`);
        await queryRunner.query(`CREATE TABLE "usuario" ("usuario_id" SERIAL NOT NULL, "nombre_completo" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "rol" "public"."usuario_rol_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_2863682842e688ca198eb25c124" UNIQUE ("email"), CONSTRAINT "PK_877d906b2b8b32d99cf7164ec19" PRIMARY KEY ("usuario_id"))`);
        await queryRunner.query(`CREATE TABLE "promocion" ("promocion_id" SERIAL NOT NULL, "descripcion" character varying NOT NULL, "tipo_descuento" character varying, "valor_descuento" numeric(10,2), "fecha_inicio" TIMESTAMP WITH TIME ZONE, "fecha_fin" TIMESTAMP WITH TIME ZONE, "producto_id" integer, CONSTRAINT "PK_c67ecb899a07b630574da75fdd7" PRIMARY KEY ("promocion_id"))`);
        await queryRunner.query(`ALTER TABLE "pedido" ADD CONSTRAINT "FK_ab19fb380d17682f87649eded89" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envio" ADD CONSTRAINT "FK_bfb5b4dfbb3d0b8c2e311af2386" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("pedido_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "envio" ADD CONSTRAINT "FK_fd7994e74d74438145087e368c4" FOREIGN KEY ("repartidor_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "producto" ADD CONSTRAINT "FK_1ae19a0cb542cf735d454bab0b5" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("categoria_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carrito_item" ADD CONSTRAINT "FK_595f0418b5ca3421718119b07af" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carrito_item" ADD CONSTRAINT "FK_0949d87ae77ce0ed6416e3e1665" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calificacion" ADD CONSTRAINT "FK_eb8647b917a525b7642dcb92c8b" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("pedido_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "calificacion" ADD CONSTRAINT "FK_36132ddc82b2c29b7154f27275f" FOREIGN KEY ("cliente_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_7dadfaf63a50e59787a233f1410" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lote" ADD CONSTRAINT "FK_faacd3e1691ed70659f4ba03ff1" FOREIGN KEY ("proveedor_id") REFERENCES "proveedor"("proveedor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" ADD CONSTRAINT "FK_710f568fa31814d122557802f62" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" ADD CONSTRAINT "FK_bfd9b1727a890c5d43b95b2d234" FOREIGN KEY ("lote_id") REFERENCES "lote"("lote_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" ADD CONSTRAINT "FK_7bcb47a863c1926656d60d2e0a4" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "promocion" ADD CONSTRAINT "FK_a8631378d07664795a104b87e93" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "promocion" DROP CONSTRAINT "FK_a8631378d07664795a104b87e93"`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" DROP CONSTRAINT "FK_7bcb47a863c1926656d60d2e0a4"`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" DROP CONSTRAINT "FK_bfd9b1727a890c5d43b95b2d234"`);
        await queryRunner.query(`ALTER TABLE "movimiento_stock" DROP CONSTRAINT "FK_710f568fa31814d122557802f62"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_faacd3e1691ed70659f4ba03ff1"`);
        await queryRunner.query(`ALTER TABLE "lote" DROP CONSTRAINT "FK_7dadfaf63a50e59787a233f1410"`);
        await queryRunner.query(`ALTER TABLE "calificacion" DROP CONSTRAINT "FK_36132ddc82b2c29b7154f27275f"`);
        await queryRunner.query(`ALTER TABLE "calificacion" DROP CONSTRAINT "FK_eb8647b917a525b7642dcb92c8b"`);
        await queryRunner.query(`ALTER TABLE "carrito_item" DROP CONSTRAINT "FK_0949d87ae77ce0ed6416e3e1665"`);
        await queryRunner.query(`ALTER TABLE "carrito_item" DROP CONSTRAINT "FK_595f0418b5ca3421718119b07af"`);
        await queryRunner.query(`ALTER TABLE "producto" DROP CONSTRAINT "FK_1ae19a0cb542cf735d454bab0b5"`);
        await queryRunner.query(`ALTER TABLE "envio" DROP CONSTRAINT "FK_fd7994e74d74438145087e368c4"`);
        await queryRunner.query(`ALTER TABLE "envio" DROP CONSTRAINT "FK_bfb5b4dfbb3d0b8c2e311af2386"`);
        await queryRunner.query(`ALTER TABLE "pedido" DROP CONSTRAINT "FK_ab19fb380d17682f87649eded89"`);
        await queryRunner.query(`DROP TABLE "promocion"`);
        await queryRunner.query(`DROP TABLE "usuario"`);
        await queryRunner.query(`DROP TYPE "public"."usuario_rol_enum"`);
        await queryRunner.query(`DROP TABLE "movimiento_stock"`);
        await queryRunner.query(`DROP TYPE "public"."movimiento_stock_tipo_enum"`);
        await queryRunner.query(`DROP TABLE "lote"`);
        await queryRunner.query(`DROP TABLE "proveedor"`);
        await queryRunner.query(`DROP TABLE "calificacion"`);
        await queryRunner.query(`DROP TABLE "carrito_item"`);
        await queryRunner.query(`DROP TABLE "producto"`);
        await queryRunner.query(`DROP TABLE "categoria"`);
        await queryRunner.query(`DROP TABLE "envio"`);
        await queryRunner.query(`DROP TYPE "public"."envio_estado_enum"`);
        await queryRunner.query(`DROP TABLE "pedido"`);
        await queryRunner.query(`DROP TYPE "public"."pedido_estado_enum"`);
    }

}
