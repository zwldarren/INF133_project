<template>
  <v-app>
    <AppHeader :toggle-drawer="toggleDrawer" />
    <Sidebar v-model="drawer" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

// defind a default state accounding to screen size
const drawer = ref(!smAndDown.value)

watch(smAndDown, (val) => {
  // when the screen size changes, toggle the drawer
  drawer.value = !val
})

const toggleDrawer = () => {
  drawer.value = !drawer.value
}
</script>
