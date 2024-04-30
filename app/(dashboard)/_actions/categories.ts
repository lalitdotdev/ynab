'use server';

import { CreateCategorySchema, CreateCategorySchemaType } from '@/lib/validators/categories';

import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { redirect } from 'next/navigation';

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { name, icon, type } = parsedBody.data;
  return await db.category.create({
    data: {
      userId: user.id,
      name,
      icon,
      type,
    },
  });
}
