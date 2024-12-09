const express = require('express')
const OpenAI = require('openai')
const { z } = require('zod')
const { v4: uuidv4 } = require('uuid')
const { zodResponseFormat } = require('openai/helpers/zod')
require('dotenv').config()

const app = express()
app.use(express.json())

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// define event schema
const eventSchema = z.object({
    title: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    description: z.string().optional(),
    color: z.string()
});

function formatYMD(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

app.post('/api/parse-event', async (req, res) => {
    const { messages } = req.body

    if (!Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages must be an array.' })
    }

    try {
        const completion = await openai.beta.chat.completions.parse({
            model: "gpt-4o",
            messages: messages,
            response_format: zodResponseFormat(eventSchema, "event"),
            temperature: 0.7
        });

        const structuredEvent = completion.choices[0].message.parsed

        console.log('Parsed event:', structuredEvent)

        const startDateObj = new Date(structuredEvent.date);
        const endDateObj = new Date(structuredEvent.date);

        const startDateStr = formatYMD(startDateObj);
        const endDateStr = formatYMD(endDateObj);

        const eventData = {
            id: uuidv4(),
            title: structuredEvent.title,
            description: structuredEvent.description || '',
            startDate: startDateStr,
            endDate: endDateStr,
            startTime: structuredEvent.startTime,
            endTime: structuredEvent.endTime,
            color: structuredEvent.color || 'blue'
        }

        res.json({ event: eventData })

    } catch (error) {
        console.error('Failed to parse event:', error)
        res.status(500).json({ error: 'Failed to parse event' })
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
