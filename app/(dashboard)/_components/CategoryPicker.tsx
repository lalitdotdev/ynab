"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface Props {
    type: TransactionType;
    onChange: (value: string) => void;
}

function CategoryPicker({ type, onChange }: Props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");

    useEffect(() => {
        if (!value) return;
        // when the value changes, call onChange callback
        onChange(value);
    }, [onChange, value]);


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <span className="flex items-center gap-2">
                        <span role="img">{value ? "🎉" : "🎈"}</span>
                        <span>{value || "Select a category"}</span>
                    </span>
                    <ChevronsUpDown />
                </Button>
            </PopoverTrigger>

        </Popover>
    );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
    return (
        <div className="flex items-center gap-2">
            <span role="img">{category.icon}</span>
            <span>{category.name}</span>
        </div>
    );
}
