// src/support-message/support-message.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { SupportMessageService } from "./support-message.service";
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { UpdateSupportMessageDto } from "./dto/update-support-message.dto";

@Controller("support-messages")
export class SupportMessageController {
    constructor(private readonly supportMessageService: SupportMessageService) {}

    @Post()
    create(@Body() dto: CreateSupportMessageDto) {
        return this.supportMessageService.create(dto);
    }

    @Get()
    findAll() {
        return this.supportMessageService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.supportMessageService.finOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateSupportMessageDto) {
        return this.supportMessageService.update(+id, dto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.supportMessageService.remove(+id);
    }
}
