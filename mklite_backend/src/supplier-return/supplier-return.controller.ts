import { Body, Controller, Delete, Get, Param, Put, Post } from "@nestjs/common";
import { SupplierReturn } from "src/entity/supplier-return.entity";
import { SupplierReturnService } from "./supplier-return.service";

@Controller('/supplier-return')
export class SupplierReturnController {
    constructor(private readonly supplierReturnService: SupplierReturnService) {}
    @Post()
    createSupplierReturn(@Body() supplierReturn: SupplierReturn) {
        return this.supplierReturnService.createSupplierReturn(supplierReturn);
    }
    @Get()
    getAllSupplierReturns() {
        return this.supplierReturnService.getAllSupplierReturns();
    }
    @Get('/:id')
    getSupplierReturnById(@Param('id') id: number) {
        return this.supplierReturnService.getSupplierReturnById(id);
    }
    @Delete('/:id')
    deleteSupplierReturn(@Param('id') id: string) {
        return this.supplierReturnService.deleteSupplierReturn(id);
    }
    @Put('/:id')
    updateSupplierReturn(@Param('id') id: string, @Body() supplierReturn: SupplierReturn) {
        return this.supplierReturnService.updateSupplierReturn(id, supplierReturn);
    }
}
