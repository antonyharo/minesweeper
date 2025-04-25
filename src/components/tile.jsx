"use client";

import { motion } from "motion/react";

export default function Tile({
    value,
    hidden,
    win,
    flag,
    onClick,
    onRightClick,
}) {
    return (
        <motion.div
            onClick={onClick}
            onContextMenu={onRightClick}
            className={`h-8 w-8 text-sm flex items-center justify-center rounded-sm border-none ${
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
        </motion.div>
    );
}
