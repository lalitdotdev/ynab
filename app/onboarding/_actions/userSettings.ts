'use server';

import { UpdateUserCurrencySchema } from '@/lib/validators/userSettings';
import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySchema.safeParse({ currency });
  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await db.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return userSettings;
}
