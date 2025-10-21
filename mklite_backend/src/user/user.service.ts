import { Body, Injectable } from "@nestjs/common";
import { AppDataSource } from "src/data-source";
import { User } from "src/entity/user.entity";


@Injectable()
export class UserService {
    async createUser(user: User) {
        return await AppDataSource.manager.save(User ,user);
    }

    async getAllUsers() {
        return await AppDataSource.manager.find(User);
    }

    async getUserByCi(ci: string) {
        return await AppDataSource.manager.findOneBy(User, {ci: parseInt(ci)});
    }

    async deleteUser(ci: string) {
        return await AppDataSource.manager.delete(User, {ci: parseInt(ci)});
    }

    async updateUser(ci: string, user: User) {
        return await AppDataSource.manager.update(User, {ci: parseInt(ci)}, user);
    }
}