import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prisma';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}
}
