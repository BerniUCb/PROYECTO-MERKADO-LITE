import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";

@Controller()
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  // endpoint clásico por id (compatibilidad)
  @Get('cart-item/:id')
  getCartItemById(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.getcartItemById(id);
  }

  @Delete('cart-item/:id')
  deleteCartItemById(@Param('id', ParseIntPipe) id: number) {
    return this.cartItemService.deleteCartItem(id);
  }

  @Put('cart-item/:id')
  updateCartItemById(@Param('id', ParseIntPipe) id: number, @Body() body: { quantity: number }) {
    return this.cartItemService.updateQuantityById(id, body.quantity);
  }

  // NUEVOS endpoints por user/product (recomendado)
  @Post('users/:userId/cart')
  addToCart(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { productId: number; quantity?: number },
  ) {
    return this.cartItemService.addToCart(userId, body.productId, body.quantity ?? 1);
  }

  @Get('users/:userId/cart')
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartItemService.getCartByUser(userId);
  }

  @Put('users/:userId/cart/:productId')
  updateQuantity(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: { quantity: number },
  ) {
    return this.cartItemService.updateQuantityByUserProduct(userId, productId, body.quantity);
  }

  @Delete('users/:userId/cart/:productId')
  removeItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cartItemService.removeItemByUserProduct(userId, productId);
  }
}
