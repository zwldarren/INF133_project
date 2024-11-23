<template>
    <v-layout>
        <v-card-title>My Account</v-card-title>
        <v-card-text>
            <p>Name: {{ userName }}</p>
            <p>Email: {{ userEmail }}</p>
        </v-card-text>
    </v-layout>
</template>

<script setup>
import { ref } from 'vue';

const userName = ref('User Name');
const userEmail = ref('Email Address');
</script>

<style scoped></style>