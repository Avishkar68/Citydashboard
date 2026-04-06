import { NextResponse } from "next/server"

export async function GET() {
  try {
    const prompt = `
Give recent safety or crime alerts near Bandra, Mumbai in JSON format.

Return ONLY JSON array:
[
  {
    "id": "1",
    "type": "Mobile Snatching",
    "location": "Bandra West",
    "time": "30 min ago",
    "severity": "medium"
  }
]

Rules:
- 3 to 5 alerts
- realistic Mumbai locations (Bandra, Khar, Santacruz, etc.)
- severity: low | medium | high
- short relative time (e.g. "45 min ago")
`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    })

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content || "[]"

    let alerts = []

    try {
      alerts = JSON.parse(text)
    } catch (e) {
      console.error("JSON parse failed:", e)
      alerts = []
    }

    return NextResponse.json(alerts)
  } catch (error) {
    console.error(error)
    return NextResponse.json([])
  }
}