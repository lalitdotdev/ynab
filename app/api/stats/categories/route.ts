import { OverviewQuerySchema } from '@/lib/validators/overview';
import { Return } from '@prisma/client/runtime/library';
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

  const queryParams = OverviewQuerySchema.safeParse({ from, to });
  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  const stats = await getCategoriesStats(user.id, queryParams.data.from, queryParams.data.to);
  return Response.json(stats);
}

export type GetCategoriesStatsResponseType = Awaited<ReturnType<typeof getCategoriesStats>>;


async function getCategoriesStats(userId: string, from: Date, to: Date) {
  const stats = await db.transaction.groupBy({
    by: ['type', 'category', 'categoryIcon'],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
  });

  return stats;
}
