"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Currencies, Currency } from "@/lib/currencies";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { UserSettings } from "@prisma/client";
// import { UpdateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useQuery } from "@tanstack/react-query";

export function CurrencyComboBox() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedOption, setSelectedOption] = React.useState<Currency | null>(
        null
    );

    const userSettings = useQuery<UserSettings>({
        queryKey: ["userSettings"],
        queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
    });

    useEffect(() => {
        if (!userSettings.data) return;
        const userCurrency = Currencies.find(
            (currency) => currency.value === userSettings.data.currency
        );
        if (userCurrency) setSelectedOption(userCurrency);
    }, [userSettings.data]);

    if (isDesktop) {
        return (
            <SkeletonWrapper isLoading={userSettings.isFetching}>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            disabled={false}
                        >
                            {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                        <OptionList setOpen={setOpen} setSelectedOption={setSelectedOption} />
                    </PopoverContent>
                </Popover>
            </SkeletonWrapper>
        );
    }
    return (
        <SkeletonWrapper isLoading={userSettings.isFetching}>
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        disabled={true}
                    >
                        {selectedOption ? <>{selectedOption.label}</> : <>Set currency</>}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <OptionList setOpen={setOpen}
                            setSelectedOption={setSelectedOption}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </SkeletonWrapper>
    );
}

function OptionList({
    setOpen,
    setSelectedOption,
}: {
    setOpen: (open: boolean) => void;
    setSelectedOption: (status: Currency | null) => void;
}) {
    return (
        <Command className="overflow-y-hidden">
            <CommandInput placeholder="Filter currency..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {Currencies.map((currency: Currency) => (
                        <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={(value) => {
                                setSelectedOption(
                                    Currencies.find((priority) => priority.value === value) ||
                                    null
                                );
                                setOpen(false);
                            }}
                        >
                            {currency.label}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
