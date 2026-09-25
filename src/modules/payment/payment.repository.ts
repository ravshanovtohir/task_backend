import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma';
import { TransactionListQueryDto } from './dto';

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: TransactionListQueryDto) {
    const { page, perPage, search, status, from, to, minAmount, maxAmount } = query;

    const conditions: Prisma.Sql[] = [Prisma.sql`TRUE`];

    if (search) {
      const searchValue = `%${search.trim()}%`;

      conditions.push(
        Prisma.sql`
          (
            t.reference ILIKE ${searchValue}
            OR t.payer_email ILIKE ${searchValue}
            OR t.provider ILIKE ${searchValue}
            OR t.description ILIKE ${searchValue}
          )
        `,
      );
    }

    if (status) {
      conditions.push(
        Prisma.sql`
          t.status = ${status}::"TransactionStatus"
        `,
      );
    }

    if (from) {
      conditions.push(
        Prisma.sql`
          t.created_at >= ${new Date(from)}
        `,
      );
    }

    if (to) {
      const endDate = new Date(to);
      endDate.setHours(23, 59, 59, 999);

      conditions.push(
        Prisma.sql`
          t.created_at <= ${endDate}
        `,
      );
    }

    if (minAmount !== undefined) {
      conditions.push(Prisma.sql`t.amount >= ${minAmount}`);
    }

    if (maxAmount !== undefined) {
      conditions.push(Prisma.sql`t.amount <= ${maxAmount}`);
    }

    const where = Prisma.join(conditions, ' AND ');
    const offset = (page - 1) * perPage;

    const [data, countResult] = await this.prisma.$transaction([
      this.prisma.$queryRaw<any[]>(
        Prisma.sql`
            SELECT
              t.id,
              t.reference,
              t.payer_email AS "payerEmail",
              t.amount::double precision AS amount,
              t.status,
              t.provider,
              t.card_last_four AS "cardLastFour",
              t.description,
              t.created_at AS "createdAt"
            FROM transactions t
            WHERE ${where}
            ORDER BY t.created_at DESC
            LIMIT ${perPage}
            OFFSET ${offset}
          `,
      ),

      this.prisma.$queryRaw<Array<{ total: bigint }>>(
        Prisma.sql`
            SELECT
              COUNT(*)::bigint AS total
            FROM transactions t
            WHERE ${where}
          `,
      ),
    ]);

    return {
      data,
      totalItems: Number(countResult[0]?.total ?? 0),
      currentPage: page,
      perPage,
    };
  }

  async getSummary() {
    const [summary] = await this.prisma.$queryRaw<any[]>`
        SELECT
          COUNT(*)::integer AS "totalTransactions",

          COALESCE(
            SUM(amount),
            0
          )::double precision AS "totalAmount",

          COUNT(*) FILTER (
            WHERE status = 'SUCCESS'
          )::integer AS "successCount",

          COUNT(*) FILTER (
            WHERE status = 'PENDING'
          )::integer AS "pendingCount",

          COUNT(*) FILTER (
            WHERE status = 'FAILED'
          )::integer AS "failedCount",

          COUNT(*) FILTER (
            WHERE status = 'REFUNDED'
          )::integer AS "refundedCount",

          COALESCE(
            SUM(amount) FILTER (
              WHERE status = 'SUCCESS'
            ),
            0
          )::double precision AS "successfulAmount"

        FROM transactions;
      `;

    const daily = await this.prisma.$queryRaw<any[]>`
        SELECT
          DATE(created_at) AS date,
          COUNT(*)::integer AS count,
          SUM(amount)::double precision AS amount
        FROM transactions
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 30;
      `;

    return {
      summary,
      daily,
    };
  }
}
