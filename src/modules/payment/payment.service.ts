import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PaymentRepository } from './payment.repository';
import { TransactionListQueryDto } from './dto';

@Injectable()
export class PaymentService {
  constructor(private readonly transactionRepository: PaymentRepository) {}

  async findAll(query: TransactionListQueryDto) {
    const result = await this.transactionRepository.findAll(query);

    const i18n = I18nContext.current();

    return {
      ...result,
      data: result.data.map((transaction) => ({
        ...transaction,
        statusLabel: i18n
          ? String(i18n.t(`main.transactionStatus.${transaction.status}` as never))
          : transaction.status,
      })),
    };
  }

  async getReports() {
    return this.transactionRepository.getSummary();
  }
}
