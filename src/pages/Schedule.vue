<template>
    <v-layout>
        <v-card-title>Schedule</v-card-title>
        <v-card>
            <v-list-item v-for="(item, index) in scheduleItems" :key="index">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.date }}</v-list-item-subtitle>
            </v-list-item>
        </v-card>
    </v-layout>
</template>

<script setup>
import { ref } from 'vue';

const scheduleItems = ref([
    { title: 'Meeting', date: '2024-11-22' },
    { title: 'Project Deadline', date: '2024-11-24' },
]);
</script>

<style scoped></style>
