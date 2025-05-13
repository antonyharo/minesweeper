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

import { createMatrix, formatTime } from "@/lib/utils";

import Link from "next/link";
import AnimatedBoard from "@/components/animated-board";
import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";

import useWindowWidth from "@/hooks/useWindowWidth";

export default function Page() {
    const [recentGames, setRecentGames] = useState([]);
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const LIMIT = 9;

    const { openSignIn, openSignUp } = useClerk();

    const [firstMatrix, setFirstMatrix] = useState([]);
    const [secondMatrix, setSecondMatrix] = useState([]);
    const [thirdMatrix, setThirdMatrix] = useState([]);

    const windowWidth = useWindowWidth();

    useEffect(() => {
        const loadBoard = async () => {
            const newFirstMatrix = await createMatrix(9, 9, 10);
            const newSecondMatrix = await createMatrix(9, 9, 10);
            const newThirdMatrix = await createMatrix(9, 9, 10);
            setFirstMatrix(newFirstMatrix);
            setSecondMatrix(newSecondMatrix);
            setThirdMatrix(newThirdMatrix);
        };

        const getInitialData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar leaderboard - agora com paginação
                const leaderboardRes = await fetch(
                    "/api/leaderboard?page=1&limit=3"
                );
                if (!leaderboardRes.ok)
                    throw new Error("Failed to fetch leaderboard");

                const { data: leaderboardData } = await leaderboardRes.json();
                setTopPlayers(leaderboardData);

                await fetchGames(1);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getInitialData();
        const interval = setInterval(loadBoard, 800);
        return () => clearInterval(interval);
    }, []);

    const fetchGames = async (page) => {
        try {
            setLoadingMore(true);
            setError(null);

            const res = await fetch(
                `/api/recent-games?page=${page}&limit=${LIMIT}`
            );
            if (!res.ok) throw new Error("Failed to fetch recent games");

            const responseData = await res.json();

            if (responseData.data.length < LIMIT) {
                setHasMore(false);
            }

            setRecentGames((prev) => [...prev, ...responseData.data]);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchGames(nextPage);
    };

    let visibleBoards = 3;
    if (windowWidth < 1024) visibleBoards = 2;
    if (windowWidth < 768) visibleBoards = 1;

    const boards = [
        <AnimatedBoard key="1" matrix={firstMatrix} />,
        <AnimatedBoard key="2" matrix={secondMatrix} />,
        <AnimatedBoard key="3" matrix={thirdMatrix} />,
    ];

    const boardContent = [];
    for (let i = 0; i < visibleBoards; i++) {
        if (i !== 0) {
            boardContent.push(
                <hr key={`hr-${i}`} className="w-[1px] h-70 bg-border" />
            );
        }
        boardContent.push(boards[i]);
    }

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            {/* Mensagem de erro */}
            {error && (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">
                    Error: {error}
                </div>
            )}

            {loading && (
                <section className="flex flex-wrap gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </section>
            )}

            {/* Top 3 Players */}
            {topPlayers.length > 0 && (
                <section className="lg:flex md:flex flex-wrap grid justify-center gap-6 mb-6">
                    {topPlayers.map((game, index) => (
                        <Card key={game.id} className="grid gap-2">
                            <CardHeader>
                                <p className="flex items-center gap-2.5 font-bold">
                                    <Trophy
                                        size={17}
                                        className={
                                            index === 0
                                                ? "text-yellow-400"
                                                : index === 1
                                                ? "text-gray-400"
                                                : "text-amber-600"
                                        }
                                    />
                                    Top {index + 1}°
                                </p>
                                <p className="font-light text-ring flex items-center gap-2">
                                    {game.created_at}
                                </p>
                            </CardHeader>
                            <CardContent className="flex items-center gap-10 mt-3">
                                <p className="flex items-center gap-2">
                                    <User size={20} />
                                    {game.username || "Anonymous"}
                                </p>
                                <p className="font-bold flex items-center gap-1">
                                    <Timer size={20} />
                                    {formatTime(game.duration_ms)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            <div className="flex items-center gap-12">{boardContent}</div>

            <div className="flex items-center gap-3 mb-10">
                <Link href="/leaderboard">
                    <Button variant={"outline"}>
                        <ChartNoAxesColumnDecreasing />
                        View Leaderboard
                    </Button>
                </Link>
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
                        <Link href="/game">
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
                    {Array.from({ length: 12 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </section>
            )}

            {recentGames && (
                <section className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4">
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
                            <CardContent className="flex md:flex-wrap items-center justify-between gap-4">
                                <p className="flex items-center gap-2">
                                    <User size={20} />
                                    {game.username || "Anonymous"}
                                </p>
                                <p className="font-bold flex items-center gap-1">
                                    <Timer size={20} />
                                    {formatTime(game.duration_ms)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}

            {hasMore && !loading && (
                <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                >
                    {loadingMore ? "Loading..." : "Load More"}
                </Button>
            )}
        </main>
    );
}
