<template>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
        <v-list>
            <v-list-item v-if="isLoggedIn" prepend-avatar="https://randomuser.me/api/portraits/lego/1.jpg"
                :title="userName" :subtitle="userEmail" nav>
                <template v-slot:append>
                    <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>

            <v-list-item v-else title="Login" nav @click="navigateTo('login')">
                <template v-slot:prepend>
                    <v-icon>mdi-login</v-icon>
                </template>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item prepend-icon="mdi-home-city" title="Home" @click="navigateTo('/')"
                value="home"></v-list-item>
            <v-list-item prepend-icon="mdi-calendar" title="Schedule" @click="navigateTo('schedule')"
                value="schedule"></v-list-item>
            <v-list-item v-if="isLoggedIn" prepend-icon="mdi-account" title="My Account" @click="navigateTo('account')"
                value="account"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const drawer = ref(true);
const rail = ref(false);

const isLoggedIn = ref(false);
const userName = ref('User Name');
const userEmail = ref('Email Address');

const navigateTo = (route) => {
  router.push({ path: route });
};
</script>

<style scoped></style>