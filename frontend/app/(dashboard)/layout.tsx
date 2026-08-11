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
        <div className="flex min-h-screen w-full bg-gray-50">

            {/* =====================================================
                DESKTOP / MOBILE SIDEBAR
            ====================================================== */}

            <Sidebar
                mobileMenuOpen={
                    mobileMenuOpen
                }
                setMobileMenuOpen={
                    setMobileMenuOpen
                }
            />

            {/* =====================================================
                MAIN AREA
            ====================================================== */}

            <main
                className="
                    min-h-screen
                    min-w-0
                    flex-1
                    overflow-x-hidden
                "
            >
                <Navbar
                    mobileMenuOpen={
                        mobileMenuOpen
                    }
                    setMobileMenuOpen={
                        setMobileMenuOpen
                    }
                />

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-7xl
                        px-4
                        py-5
                        sm:px-6
                        sm:py-6
                        lg:px-8
                        lg:py-8
                    "
                >
                    {children}
                </div>
            </main>

            {/* =====================================================
                FINORA AI FLOATING BUTTON
            ====================================================== */}

            <FinoraAIFloatingButton />
        </div>
    );
}