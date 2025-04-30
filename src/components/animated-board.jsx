"use client";

import Tile from "@/components/tile";
import SkeletonBoard from "@/components/skeleton-board";

export default function AnimatedBoard({ matrix, loading }) {
    if (!matrix || matrix.length === 0 || loading) {
        return <SkeletonBoard />;
    }

    return (
        <div className="grid gap-2">
            {matrix.map((row, i) => (
                <div key={i} className="grid grid-cols-9 gap-2">
                    {row.map((cell, j) => (
                        <Tile key={j} value={cell} hidden={false} />
                    ))}
                </div>
            ))}
        </div>
    );
}
