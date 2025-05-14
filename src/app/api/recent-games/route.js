// /app/api/recent-games/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatDateTime } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para lidar com GET e aplicar paginação
export async function GET(req) {
    try {
        // Lê os parâmetros de URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Busca paginada
        const { data, error, count } = await supabase
            .from("game_history")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (error) {
            console.error("Erro Supabase:", error.message);
            return NextResponse.json(
                { error: "Erro ao buscar dados" },
                { status: 500 }
            );
        }

        // Formata os dados, incluindo a conversão de datas
        const formattedData =
            data?.map((item) => ({
                ...item,
                created_at: formatDateTime(item.created_at), // Formata a data
            })) || [];

        return NextResponse.json(
            {
                data: formattedData,
                count,
                page,
                totalPages: Math.ceil((count || 0) / limit),
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Erro interno:", err);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
