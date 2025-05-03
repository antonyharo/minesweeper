import { Button } from "./ui/button";

import { Github, ChartNoAxesColumnDecreasing } from "lucide-react";
import { Bomb } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
    return (
        <header className="flex gap-8 items-center mb-5">
            <h1 className="flex items-center gap-3 font-medium text-3xl">
                <Bomb />
                Minesweeper
            </h1>

            <div className="flex gap-3 items-center">
                <ModeToggle />

                <Button variant={"outline"}>
                    <Github />
                    GitHub
                </Button>

                <Button variant={"outline"}>
                    <ChartNoAxesColumnDecreasing />
                    Leaderboard
                </Button>
            </div>
        </header>
    );
}
