import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { formatDateTime } from "@/lib/utils";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase environment variables are not set.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(req) {
    try {
        // Get pagination parameters from URL
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = (page - 1) * limit;

        // Query with pagination
        const { data, error, count } = await supabase
            .from("game_history")
            .select("*", { count: "exact" })
            .eq("result", "win")
            .order("duration_ms", { ascending: true })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error("Supabase error:", error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Format the data including date conversion
        const formattedData =
            data?.map((item) => ({
                ...item,
                created_at: formatDateTime(item.created_at),
                // Convert duration from ms to seconds if needed
                duration: item.duration_ms
                    ? (item.duration_ms / 1000).toFixed(2)
                    : null,
            })) || [];

        return NextResponse.json(
            {
                data: formattedData,
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
        console.error("Unexpected API error:", err);
        return NextResponse.json(
            { error: "Unexpected error while fetching data from Supabase." },
            { status: 500 }
        );
    }
}
