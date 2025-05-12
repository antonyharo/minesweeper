"use client";
import { useState, useEffect } from "react";

import { User, Timer, Trophy, ChartNoAxesColumnIncreasing } from "lucide-react";

import { formatTime } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";

export default function Page() {
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(null);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                setLoading(true);
                const response = await fetch("/api/leaderboard");
                const data = await response.json();
                setLeaderboard(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getLeaderboard();
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            <h1 className="flex items-center gap-2 text-3xl font-bold">
                <ChartNoAxesColumnIncreasing />
                Leaderboard
            </h1>

            {loading && (
                <section className="flex items-center gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </section>
            )}
            {leaderboard && (
                <section className="flex items-center gap-6">
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

            <hr className="w-3/4" />

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
                </section>
            )}
            {leaderboard && (
                <section className="grid grid-cols-3 gap-4">
                    {leaderboard.map((game, index) => (
                        <Card key={game.id} className="grid gap-2">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <p className="flex items-center gap-2.5 font-bold">
                                        {index + 1}°
                                    </p>
                                    <p className="font-light text-ring flex items-center gap-2">
                                        {game.created_at}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="flex items-center gap-10">
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
