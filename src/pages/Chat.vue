<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="6">
                <h1 class="text-center mb-4" style="color: #fff;">Event Assistant</h1>
                <v-card>
                    <v-card-text>
                        <div>
                            <div v-for="(msg, index) in filteredMessages" :key="index" :class="['message', msg.role]">
                                <strong>{{ msg.role === 'user' ? 'You' : 'AI' }}:</strong> {{ msg.content }}
                            </div>
                        </div>
                    </v-card-text>
                    <v-divider style="background-color: #555;"></v-divider>
                    <v-card-actions>
                        <v-text-field v-model="userInput" label="Type your message..." @keyup.enter="sendMessage"
                            clearable full-width></v-text-field>
                        <v-btn color="primary" variant="flat" @click="sendMessage">Send</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEventsStore } from '@/stores/events'

const today = new Date().toISOString().split('T')[0];

const messages = ref([
    { role: 'system', content: `Today's date is ${today}. Extract event details from the user's input and structure the response. The response should be in the following format: {"title": "string", "description": "string", "start": "YYYY-MM-DDTHH:mm:ss.sssZ", "end": "YYYY-MM-DDTHH:mm:ss.sssZ", "color": "string"}` },
    { role: 'assistant', content: 'Hello! I am your life assistant. I can help you schedule events. How can I help you today?' }
])

const userInput = ref('')
const eventsStore = useEventsStore()

// Filter out system messages
const filteredMessages = computed(() => 
  messages.value.filter(msg => msg.role !== 'system')
)

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


<style lang="css" scoped>
.v-card {
    background-color: #333;
    color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
}

.message {
    margin: 8px 0;
    padding: 8px;
    border-radius: 5px;
    line-height: 1.4;
}

.message.user {
    background-color: #53667a;
    color: #ffffff;
    text-align: right;
}

.message.ai {
    background-color: #424242;
    color: #ffffff;
}

.v-text-field {
    background-color: #222;
    color: #fff;
    border: 1px solid #555;
    border-radius: 4px;
}
</style>