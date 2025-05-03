"use client";
import { useState, useEffect } from "react";

import { FlagTriangleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { ModeToggle } from "@/components/mode-toggle";

import Confetti from "@/components/confetti";
import SkeletonBoard from "@/components/skeleton-board";
import Board from "@/components/board";

import { createMatrix } from "@/lib/utils";

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
        }, 3000);
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
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="font-semibold text-2xl">Minesweeper 💣</h1>

            {/* <div className="absolute inset-0 pointer-events-none">
                <Confetti active={defeat} defeat={defeat} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <Confetti active={win} />
            </div> */}

            {loading ? (
                <SkeletonBoard />
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

            <div className="flex h-5 items-center space-x-4 text-sm">
                <Button onClick={resetGame} disabled={loading}>
                    New Game
                </Button>
                <Separator orientation="vertical" />
                <Toggle aria-label="Toggle flag">
                    <FlagTriangleRight />
                </Toggle>
            </div>
        </main>
    );
}
