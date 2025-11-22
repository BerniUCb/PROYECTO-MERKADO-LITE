import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({ name: 'vista_ventas_detalladas', synchronize: false })
export class DetailedSale {
    @ViewColumn({ name: 'pedido_id' }) orderId: number;
    @ViewColumn({ name: 'fecha_pedido' }) orderDate: Date;
    @ViewColumn({ name: 'estado_pedido' }) status: string;
    @ViewColumn({ name: 'total_pedido' }) orderTotal: number;
    @ViewColumn({ name: 'cliente_nombre' }) clientName: string;
    @ViewColumn({ name: 'producto_nombre' }) productName: string;
    @ViewColumn({ name: 'categoria_producto' }) categoryName: string;
    @ViewColumn({ name: 'cantidad' }) quantity: number;
    @ViewColumn({ name: 'precio_unitario' }) unitPrice: number;
    @ViewColumn({ name: 'subtotal' }) subtotal: number;
}