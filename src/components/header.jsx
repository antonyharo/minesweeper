import { Button } from "./ui/button";

import { Github } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
    return (
        <header className="flex gap-8 items-center mb-5">
            <h1 className="font-semibold text-3xl">Minesweeper 💣</h1>

            <div className="flex gap-3 items-center">
                <ModeToggle />
                <Button size={"icon"}>
                    <Github />
                </Button>
            </div>
        </header>
    );
}
