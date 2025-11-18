import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDetailedSaleView1763486577567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE OR REPLACE VIEW vista_ventas_detalladas AS
            SELECT
                p.pedido_id,
                p.fecha_pedido,
                p.estado AS estado_pedido,
                p.total_pedido,
                u.usuario_id AS cliente_id,
                u.nombre_completo AS cliente_nombre,
                u.email AS cliente_email,
                pr.producto_id,
                pr.nombre AS producto_nombre,
                cat.nombre AS categoria_producto,
                dp.cantidad,
                dp.precio_unitario,
                (dp.cantidad * dp.precio_unitario) AS subtotal
            FROM pedido p
            LEFT JOIN usuario u ON p.cliente_id = u.usuario_id
            LEFT JOIN detalle_pedido dp ON p.pedido_id = dp.pedido_id
            LEFT JOIN producto pr ON dp.producto_id = pr.producto_id
            LEFT JOIN categoria cat ON pr.categoria_id = cat.categoria_id;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP VIEW IF EXISTS vista_ventas_detalladas;`);
    }

}