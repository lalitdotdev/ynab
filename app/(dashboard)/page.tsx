import { Button } from '@/components/ui/button';
import CreateTransactionsDialog from './_components/CreateTransactionsDialog';
import History from './_components/History';
import Overview from './_components/Overview';
import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { differenceInDays } from 'date-fns';
import { redirect } from 'next/navigation';

type Props = {}

const DashboardPage = async (props: Props) => {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in");
    }


    // const days = differenceInDays(new Date(2022, 6, 3, 0, 1), new Date(2011, 6, 2, 23, 59));
    // console.log(days)
    const userSettings = await db.userSettings.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!userSettings) {
        redirect("/onboarding");
    }
    return (
        <div className="h-full bg-background">
            <div className="border-b bg-card">
                <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
                    <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p>

                    <p className='text-zinc-600'>
                        You Need A Budget 🌱
                    </p>
                    <div className="flex items-center gap-3">
                        <CreateTransactionsDialog
                            trigger={

                                <Button
                                    variant={"outline"}
                                    className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                                >
                                    New income 🤑
                                </Button>
                            }
                            type="income"
                        />


                        <CreateTransactionsDialog
                            trigger={
                                <Button
                                    variant={"outline"}
                                    className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
                                >
                                    New expense 😤
                                </Button>

                            }
                            type="expense"
                        />
                    </div>
                </div>
            </div>
            <Overview userSettings={userSettings} />
            <History userSettings={userSettings} />


        </div>
    )
}

export default DashboardPage
