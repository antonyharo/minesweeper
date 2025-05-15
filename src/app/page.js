"use client";
import { useState, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import {
    ChartNoAxesColumnIncreasing,
    Calendar,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { createMatrix } from "@/lib/utils";

import Link from "next/link";
import AnimatedBoard from "@/components/animated-board";
import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";

import useWindowWidth from "@/hooks/useWindowWidth";
import GameCard from "@/components/game-card";

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
                
                await fetchGames(1);
                setTopPlayers(leaderboardData);
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
                        <GameCard
                            variant="topPlayer"
                            game={game}
                            position={index + 1}
                            key={game.id}
                        />
                    ))}
                </section>
            )}

            <div className="flex items-center gap-12">{boardContent}</div>

            <div className="flex items-center gap-3 mb-10">
                <Link href="/leaderboard">
                    <Button variant={"outline"}>
                        <ChartNoAxesColumnIncreasing />
                        Ver Ranking
                    </Button>
                </Link>
                <SignedOut>
                    <div className="flex gap-4">
                        <Button variant="default" onClick={openSignIn}>
                            Entre
                        </Button>
                        <Button variant="default" onClick={openSignUp}>
                            Cadastre-se
                        </Button>
                    </div>
                </SignedOut>
                <SignedIn>
                    <div className="flex gap-4 items-center">
                        <Link href="/game">
                            <Button className="px-10">Jogar</Button>
                        </Link>
                    </div>
                </SignedIn>
            </div>

            <h1 className="flex items-center gap-3 text-2xl font-semibold">
                <Calendar /> Partidas Recentes
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
                        <GameCard key={game.id} game={game} />
                    ))}
                </section>
            )}

            {hasMore && !loading && (
                <Button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    variant="outline"
                >
                    {loadingMore ? "Carregando..." : "Carregar mais"}
                </Button>
            )}
        </main>
    );
}
