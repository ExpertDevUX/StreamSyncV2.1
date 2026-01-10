import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

const sql = neon("postgresql://neondb_owner:npg_iTKPxIYwmv78@ep-red-glade-ahaxrhjw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require")

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Room ID required" }, { status: 400 })
    }

    const messages = await sql`
      SELECT id, username, content, timestamp
      FROM messages
      WHERE room_id = ${roomId}
      ORDER BY timestamp ASC
      LIMIT 100
    `

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { roomId, userId, userName, message } = await request.json()

    if (!roomId || !userName || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO messages (room_id, username, content)
      VALUES (${roomId}, ${userName}, ${message})
      RETURNING id, timestamp
    `

    return NextResponse.json({ success: true, messageId: result[0].id, createdAt: result[0].timestamp })
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
