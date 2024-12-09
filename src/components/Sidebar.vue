<template>
    <!-- use :permanent and :temporary props to control drawer behavior -->
    <v-navigation-drawer v-model="drawer" :permanent="!isMobile" :temporary="isMobile" location="start" width="256">
        <v-list>
            <v-list-item v-if="isLoggedIn" prepend-avatar="https://randomuser.me/api/portraits/lego/1.jpg"
                :title="userName" :subtitle="userEmail" nav>
            </v-list-item>

            <v-list-item v-else title="Login" nav @click="navigateTo('login')">
                <template v-slot:prepend>
                    <v-icon>mdi-login</v-icon>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home-city" title="Home" @click="navigateTo('/')"></v-list-item>
            <v-list-item prepend-icon="mdi-calendar" title="Schedule" @click="navigateTo('schedule')"></v-list-item>
            <v-list-item prepend-icon="mdi-chat" title="Chat" @click="navigateTo('chat')"></v-list-item>
            <v-list-item v-if="isLoggedIn" prepend-icon="mdi-account" title="My Account"
                @click="navigateTo('account')"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()

// access drawer state
const drawer = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const isLoggedIn = ref(false)
const userName = ref('User Name')
const userEmail = ref('Email Address')

const navigateTo = (route) => {
    router.push({ path: route })
    if (isMobile.value) {
        drawer.value = false
    }
}
</script>

<style scoped></style>