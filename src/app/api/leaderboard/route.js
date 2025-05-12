import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("game_history")
            .select("*")
            .eq("result", "win")
            .order("duration_ms", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error("Erro inesperado na API:", err);
        return NextResponse.json(
            { error: "Erro inesperado ao buscar dados do Supabase." },
            { status: 500 }
        );
    }
}
