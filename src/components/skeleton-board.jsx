import { Skeleton } from "@/components/ui/skeleton";

const MATRIX = Array.from({ length: 9 }, () => Array(9).fill(0));

export default function SkeletonBoard() {
    return (
        <div className="grid gap-2">
            {MATRIX.map((row, i) => (
                <div key={i} className="grid grid-cols-9 gap-2">
                    {row.map((cell, j) => (
                        <Skeleton key={j} className="h-8 w-8 rounded-sm" />
                    ))}
                </div>
            ))}
        </div>
    );
}
