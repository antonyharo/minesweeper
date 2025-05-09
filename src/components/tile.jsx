"use client";

import { memo } from "react";

const numberColorMap = {
    1: "text-blue-400 dark:text-blue-400",
    2: "text-green-500 dark:text-green-300",
    3: "text-red-500 dark:text-red-400",
    4: "text-purple-500 dark:text-purple-400",
    5: "text-yellow-600 dark:text-yellow-500",
    6: "text-cyan-500 dark:text-cyan-400",
    7: "text-black dark:text-white",
    8: "text-gray-600 dark:text-gray-300",
};

const BASE_CLASSES =
    "h-8 w-8 border border-secondary text-sm flex items-center justify-center rounded-sm transition duration-200";

const HIDDEN_CLASS =
    "bg-secondary hover:bg-ring hover:border-transparent cursor-pointer";

const Tile = ({ value, hidden, win, flag, onClick, onRightClick }) => {
    const visibleClass = hidden
        ? HIDDEN_CLASS
        : value === "x"
        ? win
            ? "bg-green-400 border-transparent"
            : "bg-red-400 border-transparent"
        : `bg-transparent ${numberColorMap[value] || ""}`;

    const displayContent = flag
        ? "🚩"
        : hidden || value === 0
        ? ""
        : value === "x"
        ? "💣"
        : value;

    return (
        <button
            onClick={onClick}
            onContextMenu={onRightClick}
            className={`${BASE_CLASSES} ${visibleClass}`}
        >
            {displayContent}
        </button>
    );
};

export default memo(Tile);
