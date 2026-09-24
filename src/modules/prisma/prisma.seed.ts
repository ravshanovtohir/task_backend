import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!databaseUrl) {
  throw new Error('Переменная DATABASE_URL не найдена.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const systemRoles = [
  {
    key: 'ADMIN',
    title: {
      uz: 'Administrator',
      ru: 'Администратор',
      en: 'Administrator',
    },
    description: 'Полный доступ к управлению системой.',
  },
  {
    key: 'PAYMENT',
    title: {
      uz: "To'lovlar",
      ru: 'Платежи',
      en: 'Payments',
    },
    description: 'Доступ к разделу платежей.',
  },
  {
    key: 'REPORTS',
    title: {
      uz: 'Hisobotlar',
      ru: 'Отчёты',
      en: 'Reports',
    },
    description: 'Доступ к разделу отчётов.',
  },
];

async function firstSeeder() {
  const passwordHash = await bcrypt.hash(adminPassword, 13);

  await prisma.$transaction(async (tx) => {
    for (const role of systemRoles) {
      await tx.role.upsert({
        where: { key: role.key },
        update: {},
        create: role,
      });
    }

    const adminExists = await tx.staff.findUnique({
      where: { email: adminEmail },
      select: { id: true },
    });

    if (adminExists) {
      console.log('Администратор уже существует. Создание администратора пропущено.');
      return;
    }

    const admin = await tx.staff.create({
      data: {
        firstName: 'Admin',
        lastName: 'Adminov',
        email: adminEmail,
        password: passwordHash,
        roles: {
          create: {
            role: {
              connect: { key: 'ADMIN' },
            },
          },
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    console.log(`Первый администратор успешно создан: ${admin.email}`);
  });

  console.log('Системные роли успешно проверены и созданы.');
}

firstSeeder()
  .catch((error: unknown) => {
    console.error('Ошибка при выполнении начального заполнения базы данных:');
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

async function seedTransactions() {
  const transactionCount = await prisma.transactions.count();

  if (transactionCount > 0) {
    console.log('Transactions already exist!');
    return;
  }

  const statuses = ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'];

  const providers = ['PAYME', 'CLICK', 'UZUM', 'HUMO', 'UZCARD'];

  const descriptions = ['Оплата заказа', 'Оплата услуги', 'Пополнение баланса', 'Оплата подписки', 'Возврат платежа'];

  const transactions = [];

  for (let i = 1; i <= 100; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const provider = providers[Math.floor(Math.random() * providers.length)];

    const description = descriptions[Math.floor(Math.random() * descriptions.length)];

    const amount = Math.floor(Math.random() * 5_000_000) + 10_000;

    const cardLastFour = String(Math.floor(Math.random() * 10_000)).padStart(4, '0');

    transactions.push({
      reference: `TXN-${String(i).padStart(5, '0')}`,
      payerEmail: `client${i}@example.uz`,
      amount,
      status,
      provider,
      cardLastFour,
      description,
    });
  }

  await prisma.transactions.createMany({
    data: transactions,
    skipDuplicates: true,
  });

  console.log('100 transactions successfully created!');
}

seedTransactions();
