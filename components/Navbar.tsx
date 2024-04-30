"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Logo, { LogoMobile } from "@/components/Logo";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ThemeSwitcherBtn } from "./ThemeSwitchBtn";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

function Navbar() {
    return (
        <>
            <DesktopNavbar />
        </>
    );
}

const items = [
    { label: "Dashboard", link: "/" },
    { label: "Transactions", link: "/transactions" },
    { label: "Manage", link: "/manage" },
];



function DesktopNavbar() {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="container flex items-center justify-between px-8">
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                    <Logo />
                    <div className="flex h-full">
                        {items.map((item) => (
                            <NavbarItem
                                key={item.label}
                                link={item.link}
                                label={item.label}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl="/sign-in" />
                </div>
            </nav>
        </div>
    );
}

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
