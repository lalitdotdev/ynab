"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Logo, { LogoMobile } from "@/components/Logo";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function Navbar() {
    return (
        <>
            {/* <DesktopNavbar />
            <MobileNavbar /> */}
        </>
    );
}

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
];


function NavbarItem({
    link,
    label,
    clickCallback,
}: {
    link: string;
    label: string;
    clickCallback?: () => void;
}) {
    const pathname = usePathname();
    const isActive = pathname === link;

    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-md text-muted-foreground hover:text-foreground",
                    isActive && "text-foreground"
                )}
                onClick={() => {
                    if (clickCallback) clickCallback();
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
            )}
        </div>
    );
}

export default Navbar;
