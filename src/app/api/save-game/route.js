import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { gameTime, result, difficulty } = await req.json();
        const { userId, getToken } = await auth(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        if (!result || !difficulty || !gameTime) {
            return NextResponse.json(
                {
                    error: "Resultado e dificuldade são parâmetros obrigatórios",
                },
                { status: 400 }
            );
        }

        const token = await getToken({ template: "supabase" });
        const supabase = supabaseClient(token);

        const user = await currentUser();

        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const hour = String(now.getHours()).padStart(2, "0");
        const minute = String(now.getMinutes()).padStart(2, "0");

        const createdAt = `${day}/${month}/${year} ${hour}:${minute}`;

        const { data, error } = await supabase
            .from("game_history")
            .insert([
                {
                    created_at: createdAt,
                    result,
                    difficulty,
                    game_time: gameTime,
                    username: user.username,
                    user_id: userId,
                },
            ])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: `Erro ao criar tarefa: ${error.message}` },
                { status: 400 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Erro ao processar requisição" },
            { status: 500 }
        );
    }
}
