"use client";
import { useState, useEffect } from "react";
import { createMatrix } from "@/lib/utils";
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
        setLoading(false);
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
        <main className="flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="font-semibold text-2xl">Minesweeper 💣</h1>
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
            <button
                className="py-1 px-2 rounded-sm border-2 border-red-400 text-red-400 font-medium cursor-pointer disabled:opacity-50"
                onClick={resetGame}
                disabled={loading}
            >
                New Game
            </button>
        </main>
    );
}
