"use client";
import { useState, useEffect } from "react";
import { createMatrix } from "@/lib/utils";
import Board from "@/components/board";

export default function Page() {
    const [matrix, setMatrix] = useState([]);

    useEffect(() => {
        const newMatrix = createMatrix(9, 9, 10);
        setMatrix(newMatrix);
    }, []);

    return (
        <main className="flex items-center justify-center flex-col min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1 className="font-semibold text-2xl">Minesweeper 💣</h1>
            <Board matrix={matrix} />
        </main>
    );
}
