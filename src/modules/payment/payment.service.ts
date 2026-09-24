import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }
}
