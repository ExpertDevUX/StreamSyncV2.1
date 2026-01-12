import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function POST(request: Request) {
  try {
    const { roomId, userId, userName, action } = await request.json()
    const sql = getSql();

    if (action === "join") {
      await sql`
        INSERT INTO rooms (id, name, password_hash, created_by)
        VALUES (${roomId}, ${roomId}, NULL, ${userId})
        ON CONFLICT (id) DO NOTHING
      `

      await sql`
        INSERT INTO call_history (room_id, user_id, user_name)
        VALUES (${roomId}, ${userId}, ${userName})
      `
    } else if (action === "leave") {
      await sql`
        UPDATE call_history
        SET left_at = NOW(),
            duration_minutes = EXTRACT(EPOCH FROM (NOW() - joined_at)) / 60
        WHERE room_id = ${roomId} 
        AND user_id = ${userId}
        AND left_at IS NULL
      `
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating call history:", error)
    return NextResponse.json({ error: "Failed to update call history" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")
    const sql = getSql();

    if (!roomId) {
      return NextResponse.json({ error: "Room ID required" }, { status: 400 })
    }

    const history = await sql`
      SELECT user_name, joined_at, left_at, duration_minutes
      FROM call_history
      WHERE room_id = ${roomId}
      ORDER BY joined_at DESC
      LIMIT 50
    `

    return NextResponse.json({ history })
  } catch (error) {
    console.error("[v0] Error fetching call history:", error)
    return NextResponse.json({ error: "Failed to fetch call history" }, { status: 500 })
  }
}
