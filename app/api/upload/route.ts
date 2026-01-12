import { neon } from "@neondatabase/serverless"
import { NextResponse } from "next/server"

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const roomId = formData.get("roomId") as string
    const userName = formData.get("userName") as string
    const sql = getSql();

    if (!file || !roomId || !userName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 1. Upload to temporary storage (mocked for now)
    const fileUrl = `https://example.com/files/${file.name}`

    // 2. Scan with VirusTotal
    const vtKey = process.env.VIRUSTOTAL_API_KEY
    let vtScanId = null
    let vtStatus = "pending"

    if (vtKey) {
      const vtFormData = new FormData()
      vtFormData.append("file", file)
      
      const vtResponse = await fetch("https://www.virustotal.com/api/v3/files", {
        method: "POST",
        headers: { "x-apikey": vtKey },
        body: vtFormData
      })

      if (vtResponse.ok) {
        const vtData = await vtResponse.json()
        vtScanId = vtData.data.id
      }
    }

    // 3. Store in database
    const result = await sql`
      INSERT INTO messages (room_id, username, content, is_file, file_url, vt_scan_id, vt_status)
      VALUES (${roomId}, ${userName}, ${file.name}, true, ${fileUrl}, ${vtScanId}, ${vtStatus})
      RETURNING id, timestamp
    `

    return NextResponse.json({ 
      success: true, 
      messageId: result[0].id, 
      vtScanId 
    })
  } catch (error) {
    console.error("[v0] Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
