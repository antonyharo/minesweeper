"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { FlagTriangleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

import Confetti from "@/components/confetti";
import Game from "@/components/game";

import Header from "@/components/header";
import SkeletonBoard from "@/components/skeleton-board";

export default function Page() {
    const [win, setWin] = useState(false);
    const [defeat, setDefeat] = useState(false);
    const [flagsOn, setFlagsOn] = useState(false);
    const [loading, setLoading] = useState(null);

    const loadGame = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1);
    };

    const resetGame = async () => {
        setDefeat(false);
        setWin(false);
        await loadGame();
    };

    useEffect(() => {
        loadGame();
    }, []);

    const saveResult = async (resultType, durationMs) => {
        try {
            const result = {
                durationMs,
                result: resultType,
                difficulty: "easy",
            };

            const response = await fetch("/api/save-game", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result),
            });

            const data = await response.json();

            if (response.ok) {
                toast("Partida salva com sucesso!");
            } else {
                console.log(data.error);
                toast("Oooops! Um erro ocorreu ao salvar sua partida...");
            }
        } catch (error) {
            console.log(error);
            toast("Um erro ocorreu ao salvar sua partida...");
        }
    };

    return (
        <main className="relative h-full w-full flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-6 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />

            {/* <div className="absolute inset-0 pointer-events-none">
                <Confetti active={defeat} defeat={defeat} />
            </div>

            <div className="absolute inset-0 pointer-events-none">
                <Confetti active={win} />
            </div> */}

            {loading ? (
                <SkeletonBoard />
            ) : (
                <Game
                    loading={loading}
                    flagsOn={flagsOn}
                    win={win}
                    setWin={setWin}
                    defeat={defeat}
                    setDefeat={setDefeat}
                    saveResult={saveResult}
                />
            )}

            <div className="flex h-5 items-center space-x-4 text-sm">
                <Button onClick={resetGame}>New Game</Button>

                <Separator orientation="vertical" />

                <Button
                    size="icon"
                    className={`hover:bg-normal bg-background text-primary border border-border ${
                        flagsOn ? "bg-red-400" : "hover:bg-accent"
                    }`}
                    aria-label="Toggle flag"
                    onClick={() => setFlagsOn(flagsOn ? false : true)}
                >
                    <FlagTriangleRight size={19} />
                </Button>
            </div>
        </main>
    );
}
