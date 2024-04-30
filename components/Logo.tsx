import { PiggyBank, Sprout } from "lucide-react";

import React from "react";

function Logo() {
    return (
        <a href="/" className="flex items-center gap-2">
            <Sprout className="stroke h-8 w-8 stroke-green-400 stroke-[2]" />

            <p className="bg-gradient-to-r from-green-400 to-orange-500 bg-clip-text text-2xl font-extrabold leading-tight tracking-tighter text-transparent">
                ynab.
            </p>
            {/* <span className="bg-gradient-to-r from-green-400 to-yellow-50
                bg-clip-text font-semibold leading-tight tracking-tighter text-transparent">
                    Budgeting Upward & Disciplined
                </span> */}


        </a>
    );
}

export function LogoMobile() {
    return (
        <a href="/" className="flex items-center gap-2">
            <p className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
                ynab.
            </p>

        </a>
    );
}

export default Logo;
