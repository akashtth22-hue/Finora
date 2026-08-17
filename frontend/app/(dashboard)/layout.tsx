"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import FinoraAIFloatingButton from "@/components/ai/FinoraAIFloatingButton";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    return (
        <div className="min-h-screen w-full bg-[#f7f6fb]">

            {/* SIDEBAR */}
            <Sidebar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* MAIN APPLICATION */}
            <div
                className="
                group/dashboard-shell
                min-h-screen
                lg:ml-20
                transition-[margin]
                duration-300
                "
            >

                {/* NAVBAR */}
                <Navbar
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                />

                {/* PAGE CONTENT */}
                <main className="min-w-0">
                    {children}
                </main>

            </div>

            {/* FINORA AI */}
            <FinoraAIFloatingButton />

        </div>
    );
}