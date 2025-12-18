// src/store/store.controller.ts
import { Controller, Get } from "@nestjs/common";
import { StoreService } from "./store.service";

@Controller("store")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get("location")
  getLocation() {
    return this.storeService.getLocation();
  }
}
