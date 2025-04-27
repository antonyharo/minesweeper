"use client";
import { useState, useEffect } from "react";
import { createMatrix } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Confetti from "@/components/confetti";
import Board from "@/components/board";

export default function Page() {
    const [matrix, setMatrix] = useState([]);
    const [win, setWin] = useState(false);
    const [defeat, setDefeat] = useState(false);
    const [loading, setLoading] = useState(false);

    const loadGame = async () => {
        setLoading(true);
        const newMatrix = await createMatrix(9, 9, 10);
        setMatrix(newMatrix);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const resetGame = async () => {
        setDefeat(false);
        setWin(false);
        await loadGame();
    };

    useEffect(() => {
        loadGame();
    }, []);

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="font-semibold text-2xl">Minesweeper 💣</h1>

            {defeat && (
                <div className="absolute inset-0 pointer-events-none">
                    <Confetti active={defeat} defeat={defeat} />
                </div>
            )}

            {win && (
                <div className="absolute inset-0">
                    <Confetti active={win} />
                </div>
            )}

            {loading ? (
                <div className="font-medium text-zinc-500">
                    Carregando tabuleiro...
                </div>
            ) : (
                <Board
                    matrix={matrix}
                    loading={loading}
                    win={win}
                    setWin={setWin}
                    defeat={defeat}
                    setDefeat={setDefeat}
                />
            )}
            <Button onClick={resetGame} disabled={loading}>
                New Game
            </Button>
        </main>
    );
}
