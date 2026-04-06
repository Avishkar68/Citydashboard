import axios from "axios"

const GEMINI_API_KEY = "AIzaSyC5eWRrAX0hHWpr69Qf0JaAxA7HSP4dvwc"

export async function POST(req) {
    try {
        const { message } = await req.json()

        const response = await axios.post(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `
You are a smart AI assistant specifically for Mumbai city.

Give helpful, short, and practical answers.

You help with:
- Mumbai local trains, metro, BEST buses
- Traffic and routes
- Food places
- Tourist places
- Safety and emergency tips

User: ${message}
                `,
                            },
                        ],
                    },
                ],
            },
            {
                params: {
                    key: GEMINI_API_KEY,
                },
            }
        )

        const reply =
            response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response"

        return Response.json({ reply })
    } catch (error) {
        console.error(error)
        return Response.json({
            reply: "⚠️ Error fetching response",
        })
    }
}