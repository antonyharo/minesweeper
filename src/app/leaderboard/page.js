"use client";
import { useState, useEffect } from "react";

import {
    User,
    Timer,
    ChartNoAxesColumnDecreasing,
    Calendar,
    Trophy,
    Star,
    CircleCheck,
    CircleX,
} from "lucide-react";

import { formatTime } from "@/lib/utils";

import Header from "@/components/header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard");
                const data = await response.json();
                setLeaderboard(data);
            } catch (error) {
                console.log(error);
            }
        };

        getLeaderboard();
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            <h1 className="flex items-center gap-2 text-3xl font-bold">
                <ChartNoAxesColumnDecreasing />
                Leaderboard
            </h1>

            <section className="grid gap-5">
                <h1 className="flex items-center gap-2 text-2xl font-semibold">
                    <Star />
                    Top Global
                </h1>

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
                                        {/* 🏆 Top {index + 1}° Global */}
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
            </section>

            <hr className="w-3/4" />

            <section className="grid gap-5">
                <h1 className="flex items-center gap-3 text-2xl font-semibold">
                    <Calendar /> Recent Games
                </h1>
                {leaderboard && (
                    <section className="grid grid-cols-3 gap-4">
                        {leaderboard.map((game) => (
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
            </section>
        </main>
    );
}
