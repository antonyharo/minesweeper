"use client";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

import { SignedIn, SignedOut } from "@clerk/nextjs";

import {
    User,
    Timer,
    ChartNoAxesColumnDecreasing,
    Calendar,
    Trophy,
    CircleCheck,
    CircleX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { createMatrix } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

import Link from "next/link";
import AnimatedBoard from "@/components/animated-board";
import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";

export default function Page() {
    const [recentGames, setRecentGames] = useState(null);
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const { openSignIn, openSignUp } = useClerk();

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

    useEffect(() => {
        const loadBoard = async () => {
            const newFirstMatrix = await createMatrix(9, 9, 10);
            const newSecondMatrix = await createMatrix(9, 9, 10);
            const newThirdMatrix = await createMatrix(9, 9, 10);
            setFirstMatrix(newFirstMatrix);
            setSecondMatrix(newSecondMatrix);
            setThirdMatrix(newThirdMatrix);
        };

        const getGames = async () => {
            try {
                setLoading(true);

                const recentGamesResponse = await fetch("/api/recent-games");
                const recentGamesData = await recentGamesResponse.json();

                const leaderboardResponse = await fetch("/api/leaderboard");
                const leaderboardData = await leaderboardResponse.json();

                setRecentGames(recentGamesData);
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getGames();

        const interval = setInterval(() => {
            loadBoard();
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            {loading && (
                <section className="flex items-center gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </section>
            )}
            {leaderboard && (
                <section className="flex items-center gap-6 mb-6">
                    {leaderboard.slice(0, 3).map((game, index) => (
                        <Card key={game.id} className="grid gap-2">
                            <CardHeader>
                                <p className="flex items-center gap-2.5 font-bold">
                                    <Trophy
                                        size={17}
                                        className="text-yellow-400"
                                    />{" "}
                                    Top {index + 1}° Global
                                </p>
                                <p className="font-light text-ring flex items-center gap-2">
                                    {game.created_at}
                                </p>
                            </CardHeader>

                            <CardContent className="flex items-center gap-10 mt-3">
                                <p className="flex items-center gap-2">
                                    <User size={20} />
                                    {game.username || "?"}
                                </p>
                                <p className="font-bold flex items-center gap-2">
                                    <Timer size={20} />
                                    {formatTime(game.duration_ms)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            <div className="flex items-center gap-12">
                <AnimatedBoard matrix={firstMatrix} />
                <hr className="w-[1px] h-70 bg-border" />
                <AnimatedBoard matrix={secondMatrix} />
                <hr className="w-[1px] h-70 bg-border" />
                <AnimatedBoard matrix={thirdMatrix} />
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
            {loading && (
                <section className="grid grid-cols-3 gap-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </section>
            )}
            {recentGames && (
                <section className="grid grid-cols-3 gap-4">
                    {recentGames.map((game) => (
                        <Card key={game.id} className="gap-2">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <p className="flex items-center gap-2">
                                        {game.result === "win" ? (
                                            <>
                                                <CircleCheck
                                                    className="text-green-400"
                                                    size={18}
                                                />
                                                Win
                                            </>
                                        ) : (
                                            <>
                                                <CircleX
                                                    className="text-red-400"
                                                    size={18}
                                                />
                                                Loss
                                            </>
                                        )}
                                    </p>
                                    <p className="font-light text-ring flex items-center gap-2 text-sm">
                                        {game.created_at}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center gap-8">
                                <p className="flex items-center gap-2">
                                    <User size={20} />
                                    {game.username || "?"}
                                </p>
                                <p className="font-bold flex items-center gap-2">
                                    <Timer size={20} />
                                    {formatTime(game.duration_ms)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
