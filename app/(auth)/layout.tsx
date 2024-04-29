import React, { ReactNode } from "react";

import Logo from "@/components/Logo";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Bud.",
    description: "Budgeting Upward & Disciplined",

};

function layout({ children }: { children: ReactNode }) {
    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center">
            <Logo />
            <div className="mt-12">{children}</div>
        </div>
    );
}

export default layout;
