<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>GPT Chat</h1>
                <v-card>
                    <v-card-text>
                        <div>
                            <div v-for="(msg, index) in messages" :key="index">
                                <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}: </strong> {{ msg.content }}
                            </div>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-text-field v-model="userInput" label="Type your message..." @keyup.enter="sendMessage"
                            clearable></v-text-field>
                        <v-btn color="primary" @click="sendMessage">Send</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useEventsStore } from '@/stores/events'

const messages = ref([
    { role: 'system', content: 'Extract the event information.' },
])

const userInput = ref('')
const eventsStore = useEventsStore()
const formatPrompt = 'The following response should be in the following format: {"title": "string", "description": "string", "startDate": "mm/dd/yyyy", "endDate": "mm/dd/yyyy", "startTime": "HH:mm", "endTime": "HH:mm", "color": "string"}'

const sendMessage = async () => {
    if (!userInput.value.trim()) return

    messages.value.push({ role: 'system', content: formatPrompt })
    messages.value.push({ role: 'user', content: userInput.value })
    const currentMessages = [...messages.value]
    userInput.value = ''

    try {
        const response = await fetch('/api/parse-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: currentMessages })
        })

        if (!response.ok) {
            throw new Error('Failed to parse event')
        }

        const result = await response.json()
        let eventData = result.event

        // convert mm/dd/yyyy to a Date object
        const startDateObj = new Date(eventData.startDate);
        const endDateObj = new Date(eventData.endDate);

        // setup start datetime
        const [startH, startM] = eventData.startTime.split(':');
        startDateObj.setHours(parseInt(startH, 10));
        startDateObj.setMinutes(parseInt(startM, 10));

        // setup end datetime
        const [endH, endM] = eventData.endTime.split(':');
        endDateObj.setHours(parseInt(endH, 10));
        endDateObj.setMinutes(parseInt(endM, 10));

        eventData.start = startDateObj;
        eventData.end = endDateObj;

        console.log('Parsed event:', eventData)
        eventsStore.addEvent(eventData)

        messages.value.push({ role: 'assistant', content: 'Event added successfully!' })
    } catch (error) {
        console.error('Failed to parse event:', error)
        messages.value.push({ role: 'assistant', content: 'Sorry, I could not understand the event details. Please try again.' })
    }
}
</script>
