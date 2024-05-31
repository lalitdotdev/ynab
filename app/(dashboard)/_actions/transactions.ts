'use server';

import { CreateTransactionSchema, CreateTransactionSchemaType } from '@/lib/validators/transactions';

import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function CreateTransaction(form: CreateTransactionSchemaType) {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { amount, category, date, description, type } = parsedBody.data;

  const categoryRecord = await db.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRecord) {
    throw new Error('Category not found');
  }

  //   prisma transaction creation

  await db.$transaction([
    db.transaction.create({
      data: {
        userId: user.id,
        amount,
        category: categoryRecord.name,
        date,
        description: description || '',
        type,
        categoryIcon: categoryRecord.icon,
      },
    }),

    // update month aggregate table
    db.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
    // Update year aggreate
    db.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === 'expense' ? amount : 0,
        income: type === 'income' ? amount : 0,
      },
      update: {
        expense: {
          increment: type === 'expense' ? amount : 0,
        },
        income: {
          increment: type === 'income' ? amount : 0,
        },
      },
    }),
  ]);
}
