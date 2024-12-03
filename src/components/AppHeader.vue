<template>
    <v-app-bar title="My Dashboard" app>
        <v-toolbar-title>{{ currentTime }}</v-toolbar-title>
    </v-app-bar>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const currentTime = ref('');

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString();
};

onMounted(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    onBeforeUnmount(() => {
        clearInterval(timer);
    });
});
</script>

<style scoped>
</style>