"use client";

import { memo } from "react";

function Tile({ value, hidden, win, flag, onClick, onRightClick }) {
    const numberColor = (number) => {
        switch (number) {
            case 1:
                return "text-blue-400 dark:text-blue-400";
            case 2:
                return "text-green-500 dark:text-green-300";
            case 3:
                return "text-red-500 dark:text-red-400";
            case 4:
                return "text-purple-500 dark:text-purple-400";
            case 5:
                return "text-yellow-600 dark:text-yellow-500";
            case 6:
                return "text-cyan-500 dark:text-cyan-400";
            case 7:
                return "text-black dark:text-white";
            case 8:
                return "text-gray-600 dark:text-gray-300";
            default:
                return "";
        }
    };

    const baseClasses =
        "h-8 w-8 border border-secondary text-sm flex items-center justify-center rounded-sm transition duration-200";

    const visibleClass = hidden
        ? "bg-secondary hover:bg-ring hover:border-transparent cursor-pointer"
        : value === "x"
        ? win
            ? "bg-green-400 border-transparent"
            : "bg-red-400 border-transparent"
        : `bg-transparent ${numberColor(value)}`;

    const displayContent = (() => {
        if (flag) return "🚩";
        if (hidden || value === 0) return "";
        if (value === "x") return "💣";
        return value;
    })();

    return (
        <button
            size={"icon"}
            onClick={onClick}
            onContextMenu={onRightClick}
            className={`${baseClasses} ${visibleClass}`}
        >
            {displayContent}
        </button>
    );
}

export default memo(Tile);
