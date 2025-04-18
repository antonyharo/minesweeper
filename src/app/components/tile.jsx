"use client";

export default function Tile({ value, onClick, hidden }) {
    return (
        <button
            onClick={onClick}
            className={`h-8 w-8 grid content-center rounded-sm border-none ${
                hidden
                    ? "bg-zinc-800"
                    : value === "x"
                    ? "bg-red-400"
                    : "bg-transparent"
            } cursor-pointer transition duration-200 hover:bg-zinc-700`}
        >
            {hidden ? "" : value === "x" ? "💣" : value}
        </button>
    );
}
