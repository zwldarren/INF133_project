<template>
    <v-layout>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <v-text-field label="Email" v-model="email" />
            <v-text-field label="Password" type="password" v-model="password" />
            <v-btn @click="login">Login</v-btn>
        </v-card-text>
    </v-layout>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const login = () => {
    console.log('Logged in with:', email.value, password.value);
};
</script>

<style scoped></style>
