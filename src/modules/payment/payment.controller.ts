import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleKey, Roles } from '@decorators';
import { PaymentService } from './payment.service';
import { TransactionListQueryDto } from './dto';
import { RolesGuard } from '@guards';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: 'Transaction list',
    description: 'Transaction list',
  })
  @Roles(RoleKey.ADMIN, RoleKey.PAYMENT)
  @Get()
  findAll(@Query() query: TransactionListQueryDto) {
    return this.paymentService.findAll(query);
  }

  @ApiOperation({
    summary: 'Tranzaksiyalar report',
    description: 'Tranzaksiyalar report',
  })
  @Roles(RoleKey.ADMIN, RoleKey.REPORTS)
  @Get('reports')
  findReports() {
    return this.paymentService.getReports();
  }
}
