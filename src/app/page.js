"use client";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { ArrowRight } from "lucide-react";

import { createMatrix } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedBoard from "@/components/animated-board";

export default function Page() {
    const [matrix, setMatrix] = useState([
        [0, 0, 0, 0, 0, 1, "x", 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 2, 1],
        [0, 0, 1, 1, 0, 0, 0, "x", 1],
        [0, 0, 2, "x", 1, 0, 1, 2, 2],
        [0, 0, 2, 2, 2, 1, 2, "x", "x"],
        [0, 0, 1, "x", 2, "x", 3, 3, 3],
        [0, 0, 1, 2, 3, 2, "x", 2, "x"],
        [0, 0, 0, 0, 1, "x", 2, 2, 1],
        [0, 0, 0, 0, 1, 1, 1, "x", 1],
    ]);
    const [loading, setLoading] = useState(false);
    const { openSignIn, openSignUp } = useClerk();

    const loadBoard = async () => {
        setLoading(true);
        const newMatrix = await createMatrix(9, 9, 10);
        setMatrix(newMatrix);
        setLoading(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            loadBoard();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="font-semibold text-2xl mb-3">Minesweeper 💣</h1>

            <SignedOut>
                <div className="flex gap-4">
                    <Button onClick={openSignIn}>Entre!</Button>
                    <Button variant="outline" onClick={openSignUp}>
                        Cadastre-se!
                    </Button>
                </div>
            </SignedOut>
            <SignedIn>
                <div className="flex gap-4 items-center">
                    <UserButton />
                    <Link
                        href="/game"
                        className="group flex items-center justify-center gap-3 font-medium text-zinc-600 "
                    >
                        Play!
                        <ArrowRight
                            size={15}
                            strokeWidth={3.5}
                            className="transition group-hover:translate-x-1.5 group-hover:text-zinc-600"
                        />
                    </Link>
                </div>
            </SignedIn>

            <AnimatedBoard matrix={matrix} loading={loading} />
        </main>
    );
}
