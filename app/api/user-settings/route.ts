import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  let userSettings = await db.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    userSettings = await db.userSettings.create({
      data: {
        userId: user.id,
        currency: 'USD',
      },
    });
  }
  //   Revalidate the home page that user currency
  revalidatePath('/');
  return Response.json(userSettings);
}
