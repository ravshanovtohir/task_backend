import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '@prisma';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [PrismaModule]
})
export class PaymentModule {}
