export class ProductResponseDto {
id!: number;
nombre!: string;
descripcion!: string;
precio!: number;
categoria!: {
id: number;
nombre: string;
};
}