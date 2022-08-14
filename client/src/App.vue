<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTRPCClient } from './api'
import { ApiRouter } from '../../server/src/main.ts'

const { client } = useTRPCClient<ApiRouter>({
  url: 'http://localhost:5000/trpc'
})

interface User {
  name?: string 
  id: number 
}

const users = ref<User[]>([])

const userName = ref('')

onMounted( async () => {
  users.value = await client.query('getUsers') 
})

async function createUser() {
  users.value = await client.mutation('createUser', {
    name: userName.value 
  } as User)
  userName.value = ''
}
</script>

<template>
  <h1>Users</h1>

  <ul>
    <li v-for="user in users" :key="user.id">{{ user.name }} - {{ user.id }}</li>
  </ul>

  <input v-model="userName" placeholder="name">
  <button @click="createUser">Create User</button>
</template>

<style scoped></style>
