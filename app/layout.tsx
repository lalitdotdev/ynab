import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import RootProviders from "@/components/providers/RootProviders";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Ynab —— You Need A Budget!!',
    description: "Ynab is a personal finance app that helps you manage your money better. Budgeting Upwards & Disciplined!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className="dark"
            style={{
                colorScheme: "dark",
            }}
        >
            <ClerkProvider>
                <body className={inter.className}>
                    <Toaster richColors position="bottom-right" />
                    <RootProviders>{children}</RootProviders></body>
            </ClerkProvider>
        </html>
    );
}
