"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DownloadIcon, MoreHorizontal, TrashIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useMemo, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { download, generateCsv, mkConfig } from "export-to-csv";

import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/datatable/ColumHeader";
import { DataTableFacetedFilter } from "@/components/datatable/FacetedFilters";
import { DataTableViewOptions } from "@/components/datatable/ColumnToggle";
import { DateToUTCDate } from "@/lib/helpers";
import DeleteTransactionDialog from "@/app/(dashboard)/transactions/_components/DeleteTransactionDialog";
import { GetTransactionHistoryResponseType } from "@/app/api/transactions-history/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Props {
    from: Date;
    to: Date;
}

const emptyData: any[] = [];

type TransactionHistoryRow = GetTransactionHistoryResponseType[0];

const columns: ColumnDef<TransactionHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Category" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => (
            <div className="flex gap-2 capitalize">
                {row.original.categoryIcon}
                <div className="capitalize">{row.original.category}</div>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.original.description}</div>
        ),
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            });
            return <div className="text-muted-foreground">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        cell: ({ row }) => (
            <div
                className={cn(
                    "capitalize rounded-lg text-center p-2",
                    row.original.type === "income" &&
                    "bg-emerald-400/10 text-emerald-500",
                    row.original.type === "expense" && "bg-red-400/10 text-red-500"
                )}
            >
                {row.original.type}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ row }) => (
            <p className="text-md rounded-lg bg-gray-400/5 p-2 text-center font-medium">
                {row.original.formattedAmount}
            </p>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <RowActions transaction={row.original} />,
    },
];

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

function TransactionTable({ from, to }: Props) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const history = useQuery<GetTransactionHistoryResponseType>({
        queryKey: ["transactions", "history", from, to],
        queryFn: () =>
            fetch(
                `/api/transactions-history?from=${DateToUTCDate(
                    from
                )}&to=${DateToUTCDate(to)}`
            ).then((res) => res.json()),
    });



    const table = useReactTable({
        data: history.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();
        history.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                value: transaction.category,
                label: `${transaction.categoryIcon} ${transaction.category}`,
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [history.data]);

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-end justify-between gap-2 py-4">
                <div className="flex gap-2">
                    {table.getColumn("category") && (
                        <DataTableFacetedFilter
                            title="Category"
                            column={table.getColumn("category")}
                            options={categoriesOptions}
                        />
                    )}
                    {table.getColumn("type") && (
                        <DataTableFacetedFilter
                            title="Type"
                            column={table.getColumn("type")}
                            options={[
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                            ]}
                        />
                    )}
                </div>

            </div>
            <SkeletonWrapper isLoading={history.isFetching}>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </SkeletonWrapper>
        </div>
    );
}

export default TransactionTable;

function RowActions({ transaction }: { transaction: TransactionHistoryRow }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <DeleteTransactionDialog
                open={showDeleteDialog}
                setOpen={setShowDeleteDialog}
                transactionId={transaction.id}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="h-8 w-8 p-0 ">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex items-center gap-2"
                        onSelect={() => {
                            setShowDeleteDialog((prev) => !prev);
                        }}
                    >
                        <TrashIcon className="h-4 w-4 text-muted-foreground" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
