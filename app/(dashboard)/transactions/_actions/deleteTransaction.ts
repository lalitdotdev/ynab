'use server';

import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function DeleteTransaction(id: string) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const transaction = await db.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error('bad request');
  }

  await db.$transaction([
    // Delete transaction from db
    db.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),
    // Update month history
    db.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
    // Update year history
    db.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },
      data: {
        ...(transaction.type === 'expense' && {
          expense: {
            decrement: transaction.amount,
          },
        }),
        ...(transaction.type === 'income' && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
}
