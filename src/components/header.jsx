import { Button } from "./ui/button";

import { Github, ChartNoAxesColumnDecreasing } from "lucide-react";
import { Bomb } from "lucide-react";

import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex gap-8 items-center mb-5">
            <Link href={"/"}>
                <h1 className="flex items-center gap-3 font-bold text-3xl">
                    Minad@s 💣
                </h1>
            </Link>

            <div className="flex gap-3 items-center">
                <ModeToggle />
                
                <Link href="/leaderboard">
                    <Button variant={"outline"}>
                        <ChartNoAxesColumnDecreasing />
                        Leaderboard
                    </Button>
                </Link>

                <a
                    href="https://www.github.com/antonyharo/minesweeper"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant={"outline"}>
                        <Github />
                        GitHub
                    </Button>
                </a>
            </div>
        </header>
    );
}
