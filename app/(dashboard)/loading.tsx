import { cn } from "@/lib/utils";

function loading() {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted h-24 opacity-5")}
        />

    )
}

export default loading;
