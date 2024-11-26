import { defineStore } from 'pinia';

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [],
  }),
  actions: {
    addTodo(todo) {
      this.todos.push(todo);
    },
  },
});
