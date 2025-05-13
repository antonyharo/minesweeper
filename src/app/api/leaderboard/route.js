import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
    try {
        // Obter parâmetros de paginação da URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;

        // Consulta com paginação
        const { data, error, count } = await supabase
            .from("game_history")
            .select("*", { count: "exact" })
            .eq("result", "win")
            .order("duration_ms", { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(
            {
                data,
                pagination: {
                    currentPage: page,
                    totalItems: count,
                    totalPages: Math.ceil((count || 0) / limit),
                    itemsPerPage: limit,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Erro inesperado na API:", err);
        return NextResponse.json(
            { error: "Erro inesperado ao buscar dados do Supabase." },
            { status: 500 }
        );
    }
}
