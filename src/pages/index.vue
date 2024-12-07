<template>
  <v-sheet class="d-flex" height="54" tile>
    <v-select v-model="type" :items="types" class="ma-2" label="View Mode" variant="outlined" dense
      hide-details></v-select>
    <v-select v-model="weekday" :items="weekdays" class="ma-2" label="Weekdays" variant="outlined" dense hide-details
      item-title="title" item-value="value"></v-select>
    <v-btn class="ma-2" @click="openAddEventDialog" color="primary">Add New Event</v-btn>
  </v-sheet>

  <v-sheet>
    <v-calendar ref="calendar" v-model="value" :events="eventsStore.events" :view-mode="type" :weekdays="weekday">
      <template #event="{ event }">
        <v-sheet @click="openEventDialog(event)" :color="event.color" class="event-block white--text" elevation="1"
          width="100%">
          {{ event.title }}
        </v-sheet>
      </template>
    </v-calendar>
  </v-sheet>

  <!-- Event Details Dialog -->
  <v-dialog v-model="eventDialog" max-width="500px">
    <v-card>
      <v-card-title>{{ selectedEvent.title }}</v-card-title>
      <v-card-text>
        <div><strong>Time:</strong> {{ formatDate(selectedEvent.start) }} - {{ formatDate(selectedEvent.end) }}</div>
        <div v-if="selectedEvent.description"><strong>Description:</strong> {{ selectedEvent.description }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" text @click="deleteEvent(selectedEvent)">Delete</v-btn>
        <v-btn color="blue darken-1" text @click="editEvent(selectedEvent)">Edit</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="eventDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Add/Edit Event Dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>{{ isEditMode ? 'Edit Event' : 'Add New Event' }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field v-model="newEvent.title" label="Event Name"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field v-model="newEvent.description" label="Description"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-date-input prepend-icon="" label="Start Date" v-model="newEvent.startDate"
                type="datetime"></v-date-input>
            </v-col>
            <v-col>
              <v-text-field v-model="newEvent.startTime" :active="startMenu" :focus="startMenu"
                prepend-icon="mdi-clock-time-four-outline">
                <v-menu v-model="startMenu" activator="parent" :close-on-content-click="false"
                  transition="scale-transition">
                  <v-time-picker v-model="newEvent.startTime" format="24hr" scrollable></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-date-input prepend-icon="" label="End Date" v-model="newEvent.endDate" type="datetime"></v-date-input>
            </v-col>
            <v-col>
              <v-text-field v-model="newEvent.endTime" :active="endMenu" :focus="endMenu"
                prepend-icon="mdi-clock-time-four-outline">
                <v-menu v-model="endMenu" activator="parent" :close-on-content-click="false"
                  transition="scale-transition">
                  <v-time-picker v-model="newEvent.endTime" format="24hr" scrollable></v-time-picker>
                </v-menu>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-select v-model="newEvent.color" :items="colors" label="Event Color"></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancelEvent">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveEvent">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useEventsStore } from '@/stores/events';

const type = ref('month');
const types = ['month', 'week', 'day'];
const weekday = ref([0, 1, 2, 3, 4, 5, 6]);
const weekdays = [
  { title: 'Sun - Sat', value: [0, 1, 2, 3, 4, 5, 6] },
  { title: 'Mon - Sun', value: [1, 2, 3, 4, 5, 6, 0] },
  { title: 'Mon - Fri', value: [1, 2, 3, 4, 5] },
];

const formatDate = (date) => {
  const options = {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  };
  return new Date(date).toLocaleString(undefined, options);
};

const value = ref([]);
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'];
const startMenu = ref(false);
const endMenu = ref(false);

const eventsStore = useEventsStore();
const dialog = ref(false);
const eventDialog = ref(false);
const isEditMode = ref(false);
const selectedEvent = ref({});
const newEvent = ref({
  id: null,
  title: '',
  description: '',
  startDate: null,
  endDate: null,
  startTime: '00:00',
  endTime: '00:00',
  color: '',
});

const openAddEventDialog = () => {
  isEditMode.value = false;
  resetNewEventForm();
  dialog.value = true;
};

const openEventDialog = (event) => {
  selectedEvent.value = { ...event };
  eventDialog.value = true;
};

const cancelEvent = () => {
  resetNewEventForm();
};

const resetNewEventForm = () => {
  newEvent.value = {
    id: null,
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    startTime: '00:00',
    endTime: '00:00',
    color: '',
  };
  dialog.value = false;
  isEditMode.value = false;
};

const saveEvent = () => {
  if (!newEvent.value.title || !newEvent.value.color || !newEvent.value.startDate || !newEvent.value.endDate) {
    alert('Please fill out all fields');
    return;
  }

  const startDate = newEvent.value.startDate;
  const [startH, startM] = newEvent.value.startTime.split(':');
  startDate.setHours(parseInt(startH, 10));
  startDate.setMinutes(parseInt(startM, 10));

  const endDate = newEvent.value.endDate;
  const [endH, endM] = newEvent.value.endTime.split(':');
  endDate.setHours(parseInt(endH, 10));
  endDate.setMinutes(parseInt(endM, 10))

  if (startDate > endDate) {
    alert('End date must be after the start date');
    return;
  }

  const eventData = {
    ...newEvent.value,
    start: startDate,
    end: endDate
  };

  if (isEditMode.value) {
    eventsStore.updateEvent(eventData);
  } else {
    // Generate a unique ID
    eventData.id = uuidv4();
    eventsStore.addEvent(eventData);
  }

  // Reset form
  resetNewEventForm();
};

const editEvent = (event) => {
  isEditMode.value = true;

  const sDate = new Date(event.start);
  const eDate = new Date(event.end);

  const pad = (num) => (num < 10 ? '0' + num : num);

  newEvent.value = {
    id: event.id,
    title: event.title,
    description: event.description || '',
    startDate: sDate,
    endDate: eDate,
    startTime: pad(sDate.getHours()) + ':' + pad(sDate.getMinutes()),
    endTime: pad(eDate.getHours()) + ':' + pad(eDate.getMinutes()),
    color: event.color,
  };

  dialog.value = true;
  eventDialog.value = false;
};

const deleteEvent = (eventToDelete) => {
  eventsStore.deleteEvent(eventToDelete);
  eventDialog.value = false;
};

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Load events when the component is mounted
onMounted(() => {
  eventsStore.loadFromLocalStorage();
});
</script>

<style scoped>
.event-block {
  padding: 4px 8px;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.2;
}
</style>
