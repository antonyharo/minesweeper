"use client";

export default function Tile({
    value,
    hidden,
    win,
    flag,
    onClick,
    onRightClick,
}) {
    return (
        <button
            onClick={onClick}
            onContextMenu={onRightClick}
            className={`h-8 w-8 grid content-center rounded-sm border-none ${
                hidden
                    ? "bg-zinc-800"
                    : value === "x"
                    ? win
                        ? "bg-green-400"
                        : "bg-red-400"
                    : "bg-transparent"
            } transition duration-200 ${
                hidden ? "hover:bg-zinc-700 cursor-pointer" : ""
            }`}
        >
            {flag ? "🚩" : hidden ? "" : value === "x" ? "💣" : value}
        </button>
    );
}
