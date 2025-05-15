"use client";
import { useState, useEffect } from "react";
import { User, Timer, Trophy, ChartNoAxesColumnIncreasing } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import SkeletonCard from "@/components/skeleton-card";
import GameCard from "@/components/game-card";

export default function Page() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [topPlayers, setTopPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
        totalPages: 1,
        itemsPerPage: 9,
    });
    const [error, setError] = useState(null);

    const fetchLeaderboard = async (page = 1) => {
        try {
            page === 1 ? setLoading(true) : setLoadingMore(true);
            setError(null);

            const response = await fetch(
                `/api/leaderboard?page=${page}&limit=${pagination.itemsPerPage}`
            );
            if (!response.ok) throw new Error("Failed to fetch leaderboard");

            const { data, pagination: paginationData } = await response.json();

            setPagination(paginationData);

            if (page === 1) {
                setLeaderboard(data);
                setTopPlayers(data.slice(0, 3));
            } else {
                setLeaderboard((prev) => [...prev, ...data]);
            }
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (pagination.currentPage < pagination.totalPages) {
            const nextPage = pagination.currentPage + 1;
            fetchLeaderboard(nextPage);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            <h1 className="flex items-center gap-2 text-3xl font-bold">
                <ChartNoAxesColumnIncreasing />
                Ranking
            </h1>

            {/* Exibir mensagem de erro se houver */}
            {error && (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">
                    Error: {error}
                </div>
            )}

            {/* Top 3 Players */}
            {loading && (
                <section className="flex items-center gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </section>
            )}
            {topPlayers.length > 0 && (
                <section className="lg:flex md:flex flex-wrap grid justify-center gap-6 mb-6">
                    {topPlayers.map((game, index) => (
                        <GameCard
                            key={game.id}
                            variant="topPlayer"
                            game={game}
                            position={index + 1}
                        />
                    ))}
                </section>
            )}

            <hr className="w-3/4" />

            {/* Lista completa com paginação */}
            {loading ? (
                <section className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </section>
            ) : (
                <>
                    <section className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 ">
                        {leaderboard.map((game, index) => (
                            <GameCard
                                key={game.id}
                                variant="ranking"
                                position={index + 1}
                                game={game}
                            />
                        ))}
                    </section>

                    {/* Botão de carregar mais */}
                    {pagination.currentPage < pagination.totalPages && (
                        <Button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            variant="outline"
                        >
                            {loadingMore ? "Carregando..." : "Carregar mais"}
                        </Button>
                    )}
                </>
            )}
        </main>
    );
}
