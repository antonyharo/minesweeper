"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import {
    directions,
    deepCopyMatrix,
    matricesEqual,
    formatTime,
    isInBounds,
} from "@/lib/utils";

import SkeletonBoard from "./skeleton-board";
import Tile from "@/components/tile";

export default function Board({
    matrix,
    loading,
    win,
    setWin,
    defeat,
    setDefeat,
}) {
    const [hiddenMatrix, setHiddenMatrix] = useState([]);
    const [durationMs, setDurationMs] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (matrix && matrix.length > 0) {
            setHiddenMatrix(matrix.map((row) => row.map(() => true)));
            setDurationMs(0);
            setGameStarted(false);

            if (process.env.NODE_ENV === "development") {
                console.table(matrix);
            }
        }
    }, [matrix]);

    useEffect(() => {
        let startTime = null;

        const shouldRunTimer =
            gameStarted && !loading && !win && !defeat && matrix.length > 0;

        if (shouldRunTimer) {
            if (intervalRef.current === null) {
                startTime = Date.now() - durationMs;

                intervalRef.current = setInterval(() => {
                    const now = Date.now();
                    setDurationMs(now - startTime);
                }, 50);
            }
        } else {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [gameStarted, loading, win, defeat, matrix.length]);

    // useEffect para detectar vitória
    useEffect(() => {
        const checkWin = async () => {
            if (!matrix || hiddenMatrix.length === 0 || loading) return;

            const totalCells = matrix.length * matrix[0].length;
            const bombCount = matrix
                .flat()
                .filter((cell) => cell === "x").length;
            const revealedCount = hiddenMatrix
                .flat()
                .filter((cell) => cell === false).length;

            if (revealedCount === totalCells - bombCount) {
                await handleWin();
            }
        };

        checkWin();
    }, [hiddenMatrix, loading, matrix, setWin]);

    const saveResult = async (resultType) => {
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

    const handleWin = async () => {
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setWin(true);
        toast("Resultado salvo!", { description: "Você venceu!" });
        await saveResult("win");
    };

    const handleDefeat = async () => {
        if (defeat || win) return;
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setDefeat(true);
        toast("Resultado salvo!", { description: "Você perdeu!" });
        await saveResult("loss");
    };

    const countAdjacentFlags = (row, col) =>
        directions.reduce((count, [dr, dc]) => {
            const newRow = row + dr;
            const newCol = col + dc;
            return isInBounds(matrix, newRow, newCol) &&
                hiddenMatrix[newRow][newCol] === "flag"
                ? count + 1
                : count;
        }, 0);

    const revealEmptyArea = (startRow, startCol, baseHidden) => {
        const queue = [[startRow, startCol]];
        const visited = new Set();
        const newHidden = deepCopyMatrix(baseHidden);

        while (queue.length > 0) {
            const [row, col] = queue.shift();
            const key = `${row},${col}`;

            if (
                !isInBounds(matrix, row, col) ||
                newHidden[row][col] === "flag" ||
                visited.has(key)
            )
                continue;

            visited.add(key);
            newHidden[row][col] = false;

            if (matrix[row][col] === 0) {
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const newKey = `${newRow},${newCol}`;
                    if (
                        isInBounds(matrix, newRow, newCol) &&
                        !visited.has(newKey)
                    ) {
                        queue.push([newRow, newCol]);
                    }
                });
            }
        }

        return newHidden;
    };

    const clickAdjacentCells = async (row, col) => {
        let newHidden = deepCopyMatrix(hiddenMatrix);

        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                !isInBounds(matrix, newRow, newCol) ||
                newHidden[newRow][newCol] !== true
            )
                continue;

            if (matrix[newRow][newCol] === "x") {
                await handleDefeat();
                return;
            }

            if (matrix[newRow][newCol] === 0) {
                newHidden = revealEmptyArea(newRow, newCol, newHidden);
            } else {
                newHidden[newRow][newCol] = false;
            }
        }

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    const handleNumberClick = (row, col) => {
        const flags = countAdjacentFlags(row, col);
        if (matrix[row][col] === flags) {
            clickAdjacentCells(row, col);
        }
    };

    const handleClick = async (row, col) => {
        if (
            !isInBounds(matrix, row, col) ||
            hiddenMatrix[row][col] === "flag" ||
            defeat ||
            win
        )
            return;

        if (!gameStarted) {
            setGameStarted(true);
        }

        if (hiddenMatrix[row][col] === false) {
            if (matrix[row][col] > 0) handleNumberClick(row, col);
            return;
        }

        if (matrix[row][col] === "x") {
            await handleDefeat();
            return;
        }

        let newHidden = deepCopyMatrix(hiddenMatrix);

        if (matrix[row][col] === 0) {
            newHidden = revealEmptyArea(row, col, newHidden);
        } else {
            newHidden[row][col] = false;
        }

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    const handleRightClick = (e, row, col) => {
        e.preventDefault();
        if (
            !isInBounds(matrix, row, col) ||
            hiddenMatrix[row][col] === false ||
            defeat ||
            win
        )
            return;

        const newHidden = deepCopyMatrix(hiddenMatrix);
        newHidden[row][col] = newHidden[row][col] === "flag" ? true : "flag";

        if (!matricesEqual(hiddenMatrix, newHidden)) {
            setHiddenMatrix(newHidden);
        }
    };

    if (
        !matrix ||
        matrix.length === 0 ||
        hiddenMatrix.length === 0 ||
        loading
    ) {
        return <SkeletonBoard />;
    }

    return (
        <div className="grid gap-2">
            <div
                className={`text-center text-lg font-bold transition duration-200 text-${
                    durationMs ? "primary" : "secondary"
                }`}
            >
                {formatTime(durationMs)}
            </div>

            {matrix.map((row, i) => (
                <div key={i} className="grid grid-cols-9 gap-2">
                    {row.map((cell, j) => (
                        <Tile
                            key={j}
                            value={cell}
                            hidden={hiddenMatrix[i][j]}
                            win={win}
                            flag={hiddenMatrix[i][j] === "flag"}
                            onClick={() => handleClick(i, j)}
                            onRightClick={(e) => handleRightClick(e, i, j)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
