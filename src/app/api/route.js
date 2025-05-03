import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: gameHistory } = await supabase
            .from("game_history")
            .select("*");

        return NextResponse.json(gameHistory, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao buscar tarefas" },
            { status: 500 }
        );
    }
}
