import { NextResponse } from "next/server";
import { supabaseClient } from "@/lib/supabase";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { result, difficulty } = await req.json();
        const { userId, getToken } = await auth(req);

        if (!userId) {
            return NextResponse.json(
                { error: "Usuário não autenticado" },
                { status: 401 }
            );
        }

        if (!result || !difficulty) {
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

        const { data, error } = await supabase
            .from("game_history")
            .insert([
                {
                    result,
                    difficulty,
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
