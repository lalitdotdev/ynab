"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Period, Timeframe } from '@/lib/types';
import React, { useCallback, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge';
import CountUp from "react-countup";
import { GetFormatterForCurrency } from '@/lib/helpers';
import HistoryPeriodSelector from './HistoryPeriodSelector';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { UserSettings } from '@prisma/client'
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const History = ({ userSettings }: { userSettings: UserSettings }) => {

}

export default History
function CustomTooltip({ active, payload, formatter }: any) {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;
    const { expense, income } = data;

    return (
        <div className="min-w-[300px] rounded border bg-background p-4">
            <TooltipRow
                formatter={formatter}
                label="Expense"
                value={expense}
                bgColor="bg-red-500"
                textColor="text-red-500"
            />
            <TooltipRow
                formatter={formatter}
                label="Income"
                value={income}
                bgColor="bg-emerald-500"
                textColor="text-emerald-500"
            />
            <TooltipRow
                formatter={formatter}
                label="Balance"
                value={income - expense}
                bgColor="bg-gray-100"
                textColor="text-foreground"
            />
        </div>
    );
}


