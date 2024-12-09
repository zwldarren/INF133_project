<template>
    <v-app-bar app>
        <!-- toggle drawer -->
        <v-btn icon variant="text" @click="toggleDrawer">
            <v-icon>mdi-menu</v-icon>
        </v-btn>

        <v-toolbar-title class="ml-2">{{ currentTime }}</v-toolbar-title>
    </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
    toggleDrawer: {
        type: Function,
        required: true
    }
})

const currentTime = ref('')

const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString()
}

onMounted(() => {
    updateTime()
    const timer = setInterval(updateTime, 1000)
    onBeforeUnmount(() => {
        clearInterval(timer)
    })
})
</script>

<style scoped>
.ml-2 {
    margin-left: 16px;
}
</style>