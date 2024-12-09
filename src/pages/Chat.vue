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
    { role: 'system', content: 'Extract event details from the user\'s input and structure the response. The response should be in the following format: {"title": "string", "description": "string", "start": "YYYY-MM-DDTHH:mm:ss.sssZ", "end": "YYYY-MM-DDTHH:mm:ss.sssZ", "color": "string"}' },
])

const userInput = ref('')
const eventsStore = useEventsStore()

const sendMessage = async () => {
    if (!userInput.value.trim()) return

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

        eventsStore.addEvent(result.event)

        messages.value.push({ role: 'assistant', content: 'Event added successfully!' })
    } catch (error) {
        console.error('Failed to parse event:', error)
        messages.value.push({ role: 'assistant', content: 'Sorry, I could not understand the event details. Please try again.' })
    }
}
</script>
