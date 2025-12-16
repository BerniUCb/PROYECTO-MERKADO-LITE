import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { WishlistService } from './wish-list.service';

@Controller()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('user/:userId/wishlist')
  getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.getByUser(userId);
  }

  @Get('user/:userId/wishlist/product/:productId')
  getByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.getByUserAndProduct(userId, productId);
  }

  @Post('user/:userId/wishlist')
  add(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: { productId: number },
  ) {
    return this.wishlistService.add(userId, body.productId);
  }

  @Delete('wishlist/:id')
  removeById(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistService.removeById(id);
  }

  @Delete('user/:userId/wishlist/product/:productId')
  removeByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeByUserAndProduct(userId, productId);
  }
}
