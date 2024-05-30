"use client";

import { Period, Timeframe } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import React from "react";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { useQuery } from "@tanstack/react-query";

interface Props {
    period: Period;
    setPeriod: (period: Period) => void;
    timeframe: Timeframe;
    setTimeframe: (timeframe: Timeframe) => void;
}

function HistoryPeriodSelector({

    timeframe,
    setTimeframe,
}: Props) {
    const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
        queryKey: ["overview", "history", "periods"],
        queryFn: () => fetch(`/api/history-periods`).then((res) => res.json()),
    });

    return (
        <div className="flex flex-wrap items-center gap-4">
            <SkeletonWrapper isLoading={historyPeriods.isFetching} fullWidth={false}>
                <Tabs
                    value={timeframe}
                    onValueChange={(value) => setTimeframe(value as Timeframe)}
                >
                    <TabsList>
                        <TabsTrigger value="year">Year</TabsTrigger>
                        <TabsTrigger value="month">Month</TabsTrigger>
                    </TabsList>
                </Tabs>
            </SkeletonWrapper>

        </div>
    );
}

export default HistoryPeriodSelector;


