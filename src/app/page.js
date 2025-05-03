"use client";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import {
    User,
    Timer,
    ChartNoAxesColumnDecreasing,
    Skull,
    Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { createMatrix } from "@/lib/utils";

import Link from "next/link";
import AnimatedBoard from "@/components/animated-board";
import Header from "@/components/header";

export default function Page() {
    const [gameHistory, setGameHistory] = useState(null);
    const [firstMatrix, setFirstMatrix] = useState([
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
    const [secondMatrix, setSecondMatrix] = useState([
        [0, 1, "x", 2, "x", 2, 1, 1, 0],
        [0, 1, 2, 3, 2, 2, "x", 1, 0],
        [0, 0, 1, "x", 1, 2, 2, 2, 1],
        [0, 0, 1, 1, 1, "x", 2, "x", 1],
        [0, 1, 1, 1, 1, 2, "x", 3, 2],
        [0, 1, "x", 1, 0, 1, 2, "x", "x"],
        [0, 1, 2, 2, 1, 2, 3, 4, 3],
        [0, 0, 1, "x", 1, "x", 2, "x", 2],
        [0, 0, 1, 1, 1, 1, 2, 2, "x"],
    ]);
    const [thirdMatrix, setThirdMatrix] = useState([
        [0, 0, 1, "x", 2, "x", 2, 1, 0],
        [0, 0, 1, 2, 3, 3, "x", 2, 0],
        [0, 1, 1, 1, "x", 3, 2, 2, 1],
        [0, 1, "x", 2, 2, "x", 1, "x", 2],
        [0, 2, 3, 3, 3, 2, 2, 3, "x"],
        [0, "x", 2, "x", 1, 0, 1, "x", 2],
        [0, 1, 2, 2, 1, 1, 2, 3, 3],
        [0, 1, "x", 1, 0, 1, "x", 3, "x"],
        [0, 1, 1, 1, 0, 1, 2, "x", 2],
    ]);

    const [loading, setLoading] = useState(false);
    const { openSignIn, openSignUp } = useClerk();

    useEffect(() => {
        const loadBoard = async () => {
            setLoading(true);
            const newFirstMatrix = await createMatrix(9, 9, 10);
            const newSecondMatrix = await createMatrix(9, 9, 10);
            const newThirdMatrix = await createMatrix(9, 9, 10);
            setFirstMatrix(newFirstMatrix);
            setSecondMatrix(newSecondMatrix);
            setThirdMatrix(newThirdMatrix);
            setLoading(false);
        };

        const getGameHistory = async () => {
            try {
                const response = await fetch("/api/");
                const data = await response.json();
                setGameHistory(data);
            } catch (error) {
                console.log(error);
            }
        };

        getGameHistory();

        const interval = setInterval(() => {
            loadBoard();
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            {gameHistory && (
                <section className="flex items-center gap-4 mb-6">
                    {gameHistory.slice(0, 3).map((game) => (
                        <div
                            key={game.id}
                            className="flex items-center gap-10 border border-secondary px-6 py-3 rounded-sm"
                        >
                            <p className="flex items-center gap-2">
                                🏆
                                <User size={20} />
                                {game.username || "?"}
                            </p>
                            <p className="font-bold flex items-center gap-2">
                                <Timer size={20} /> {game.game_time}
                            </p>
                        </div>
                    ))}
                </section>
            )}

            <div className="flex items-center gap-12">
                <AnimatedBoard matrix={firstMatrix} loading={loading} />
                <hr className="w-[1px] h-70 bg-border" />
                <AnimatedBoard matrix={secondMatrix} loading={loading} />
                <hr className="w-[1px] h-70 bg-border" />
                <AnimatedBoard matrix={thirdMatrix} loading={loading} />
            </div>

            <div className="flex items-center gap-3 mb-10">
                <Button variant={"outline"}>
                    <ChartNoAxesColumnDecreasing />
                    View Leaderboard
                </Button>
                <SignedOut>
                    <div className="flex gap-4">
                        <Button variant="default" onClick={openSignIn}>
                            Sign-up!
                        </Button>
                        <Button variant="default" onClick={openSignUp}>
                            Sign-in!
                        </Button>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex gap-4 items-center">
                        <Link href="/game" className="">
                            <Button className="px-10">Play</Button>
                        </Link>
                    </div>
                </SignedIn>
            </div>

            <h1 className="flex items-center gap-3 text-2xl font-semibold">
                <Calendar /> Recent Games
            </h1>
            {gameHistory && (
                <section className="grid gap-3">
                    {gameHistory.map((game) => (
                        <div
                            key={game.id}
                            className="flex items-center gap-10 border border-secondary px-6 py-3 rounded-sm"
                        >
                            <p className="flex items-center gap-2">
                                <User size={20} /> {game.username || "?"}
                            </p>
                            <p className="font-bold flex items-center gap-2">
                                <Timer size={20} /> {game.game_time}
                            </p>
                            <p className="font-light flex items-center gap-2">
                                <Skull size={20} />
                                {game.difficulty}
                            </p>
                            <p className="font-light text-ring flex items-center gap-2">
                                {game.created_at}
                            </p>
                        </div>
                    ))}
                </section>
            )}
        </main>
    );
}
