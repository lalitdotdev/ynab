"use client";

import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Category } from "@prisma/client";
import { PlusSquare } from "lucide-react";
import { TransactionType } from "@/lib/types";

interface Props {
    type: TransactionType;
    successCallback: (category: Category) => void;
    trigger?: ReactNode;
}

function CreateCategoryDialog({ type, successCallback, trigger }: Props) {
    const [open, setOpen] = useState(false);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    trigger
                ) : (
                    <Button
                        variant={"ghost"}
                        className="flex border-separate items-center justify-start roudned-none border-b px-3 py-3 text-muted-foreground"
                    >
                        <PlusSquare className="mr-2 h-4 w-4" />
                        Create new
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <div>
                    Dialog Content here
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default CreateCategoryDialog;/*  */
