import { Injectable } from "@nestjs/common";

@Injectable()
export class StoreService {
  getLocation() {
    return {
      name: "MERKADO LITE",
      lat: -17.382917,
      lng: -66.168361,
      address1: "Cochabamba",
      address2: "Cochabamba, Bolivia",
    };
  }
}
