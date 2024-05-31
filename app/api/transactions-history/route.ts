import { GetFormatterForCurrency } from '@/lib/helpers';
import { OverviewQuerySchema } from '@/lib/validators/overview';
import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 400,
    });
  }

  const transactions = await getTransactionsHistory(user.id, queryParams.data.from, queryParams.data.to);

  return Response.json(transactions);
}

export type GetTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionsHistory>>;

async function getTransactionsHistory(userId: string, from: Date, to: Date) {
  const userSettings = await db.userSettings.findUnique({
    where: {
      userId,
    },
  });
  if (!userSettings) {
    throw new Error('user settings not found');
  }

  const formatter = GetFormatterForCurrency(userSettings.currency);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    // lets format the amount with the user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
}
