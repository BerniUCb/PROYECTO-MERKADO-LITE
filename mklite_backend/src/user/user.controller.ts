import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { User } from "src/entity/user.entity";
import { UserService } from "./user.service";


@Controller('/user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    createUser(@Body() user: User) {
        return this.userService.createUser(user);
    }

    @Get()
    getAllUser() {
        return this.userService.getAllUsers();
    }

    @Get('/:ci') 
    getUserByCi(@Param() params: any) {
        return this.userService.getUserByCi(params.ci);
    }

    @Delete('/:ci')
    deleteUser(@Param() params: any) {
        return this.userService.deleteUser(params.ci);
    }

    @Put('/:ci')
    updateUser(@Param() params: any,  @Body() user: User) {
        return this.userService.updateUser(params.ci, user);
    }

}