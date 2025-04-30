"use client";

import { memo } from "react";

function Tile({ value, hidden, win, flag, onClick, onRightClick }) {
    const baseClasses =
        "h-8 w-8 text-sm flex items-center justify-center rounded-sm border-none transition duration-200";

    const visibleClass = hidden
        ? "bg-secondary hover:bg-ring cursor-pointer"
        : value === "x"
        ? win
            ? "bg-green-400"
            : "bg-red-400"
        : "bg-transparent";

    const displayContent = flag
        ? "🚩"
        : hidden
        ? ""
        : value === "x"
        ? "💣"
        : value === 0
        ? ""
        : value;

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
