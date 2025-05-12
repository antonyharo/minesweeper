"use client";

import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import {
    directions,
    deepCopyMatrix,
    matricesEqual,
    formatTime,
    isInBounds,
    createSafeMatrix,
} from "@/lib/utils";

import SkeletonBoard from "./skeleton-board";
import Tile from "@/components/tile";

export default function Game({
    flagsOn,
    loading,
    win,
    setWin,
    defeat,
    setDefeat,
    saveResult
}) {
    const [matrix, setMatrix] = useState(
        Array.from({ length: 9 }, () => Array(9).fill(0))
    );
    const [hiddenMatrix, setHiddenMatrix] = useState(
        Array.from({ length: 9 }, () => Array(9).fill(true))
    );
    const [durationMs, setDurationMs] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [firstClick, setFirstClick] = useState(null);
    const intervalRef = useRef(null);

    // Controla o timer
    useEffect(() => {
        let startTime = null;

        if (gameStarted && !loading && !win && !defeat && matrix.length > 0) {
            if (intervalRef.current === null) {
                startTime = Date.now() - durationMs;

                intervalRef.current = setInterval(() => {
                    if (!win && !defeat) {
                        setDurationMs(Date.now() - startTime);
                    }
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

    // Criação segura da matriz ao primeiro clique
    useEffect(() => {
        if (firstClick) {
            const { row, col } = firstClick;
            createSafeMatrix(9, 9, 10, row, col).then((safeMatrix) => {
                setMatrix(safeMatrix);
                setHiddenMatrix(
                    Array.from({ length: 9 }, () => Array(9).fill(true))
                );
                const revealed = revealEmptyArea(
                    row,
                    col,
                    Array.from({ length: 9 }, () => Array(9).fill(true)),
                    safeMatrix
                );
                setHiddenMatrix(revealed);
                setGameStarted(true);
                setFirstClick(null);
            });
        }
    }, [firstClick]);

    // Verificação de vitória
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
    }, [matrix, hiddenMatrix, loading]);

    const handleWin = async () => {
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setWin(true);
        toast("Resultado salvo!", { description: "Você venceu!" });
        await saveResult("win", durationMs);
    };

    const handleDefeat = async () => {
        if (defeat || win) return;
        const revealed = matrix.map((row) => row.map(() => false));
        setHiddenMatrix(revealed);
        setDefeat(true);
        toast("Resultado salvo!", { description: "Você perdeu!" });
        await saveResult("loss", durationMs);
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

    const revealEmptyArea = (
        startRow,
        startCol,
        baseHidden,
        baseMatrix = matrix
    ) => {
        const queue = [[startRow, startCol]];
        const visited = new Set();
        const newHidden = deepCopyMatrix(baseHidden);

        while (queue.length > 0) {
            const [row, col] = queue.shift();
            const key = `${row},${col}`;

            if (
                !isInBounds(baseMatrix, row, col) ||
                newHidden[row][col] === "flag" ||
                visited.has(key)
            )
                continue;

            visited.add(key);
            newHidden[row][col] = false;

            if (baseMatrix[row][col] === 0) {
                directions.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    const newKey = `${newRow},${newCol}`;
                    if (
                        isInBounds(baseMatrix, newRow, newCol) &&
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

    const handleClick = async (e, row, col) => {
        e.preventDefault();

        if (
            defeat ||
            win ||
            !isInBounds(matrix, row, col) ||
            (hiddenMatrix[row][col] === "flag" && !flagsOn)
        )
            return;

        if (!gameStarted) {
            setFirstClick({ row, col });
            return;
        }

        if (flagsOn) {
            handleRightClick(e, row, col);
            return;
        }

        if (hiddenMatrix[row][col] === false) {
            if (matrix[row][col] > 0) {
                const flags = countAdjacentFlags(row, col);
                if (flags === matrix[row][col]) {
                    clickAdjacentCells(row, col);
                }
            }
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
            <div className="text-center text-lg font-bold transition duration-200 text-primary">
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
                            onClick={(e) => handleClick(e, i, j)}
                            onRightClick={(e) => handleRightClick(e, i, j)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
