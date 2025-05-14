import { CircleCheck, CircleX, Timer, Trophy, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { formatTime } from "@/lib/utils";

export default function GameCard({ game, variant, position }) {
    if (variant === "topPlayer") {
        return (
            <Card className="grid gap-2">
                <CardHeader>
                    <p className="flex items-center gap-2.5 font-bold">
                        <Trophy
                            size={17}
                            className={
                                position === 1
                                    ? "text-yellow-400"
                                    : position === 2
                                    ? "text-gray-400"
                                    : "text-amber-600"
                            }
                        />
                        Top {position}°
                    </p>
                    <p className="font-light text-ring flex items-center gap-2">
                        {game.created_at}
                    </p>
                </CardHeader>
                <CardContent className="flex items-center gap-10 mt-3">
                    <p className="flex items-center gap-2">
                        <User size={20} />
                        {game.username || "Anonymous"}
                    </p>
                    <p className="font-bold flex items-center gap-1">
                        <Timer size={20} />
                        {formatTime(game.duration_ms)}
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (variant === "ranking") {
        return (
            <Card className="grid gap-2">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <p className="flex items-center gap-2.5 font-bold">
                            #{position}
                        </p>
                        <p className="font-light text-ring flex items-center gap-2">
                            {game.created_at}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="flex md:flex-wrap items-center justify-between gap-4">
                    <p className="flex items-center gap-2">
                        <User size={20} />
                        {game.username || "Anonymous"}
                    </p>
                    <p className="font-bold flex items-center gap-2">
                        <Timer size={20} />
                        {formatTime(game.duration_ms)}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="gap-2">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <p className="flex items-center gap-2">
                        {game.result === "win" ? (
                            <>
                                <CircleCheck
                                    className="text-green-400"
                                    size={18}
                                />
                                Vitória
                            </>
                        ) : (
                            <>
                                <CircleX className="text-red-400" size={18} />
                                Derrota
                            </>
                        )}
                    </p>
                    <p className="font-light text-ring flex items-center gap-2 text-sm">
                        {game.created_at}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="flex md:flex-wrap items-center justify-between gap-4">
                <p className="flex items-center gap-2">
                    <User size={20} />
                    {game.username || "Visitante"}
                </p>
                <p className="font-bold flex items-center gap-1">
                    <Timer size={20} />
                    {formatTime(game.duration_ms)}
                </p>
            </CardContent>
        </Card>
    );
}
