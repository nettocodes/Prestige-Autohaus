<template>
    <div>
      <h2>Login Admin</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="username" placeholder="Usuário" required />
        <input v-model="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  </template>
  
  <script>
  import { useAuthStore } from "../store/authStore";
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const username = ref("");
      const password = ref("");
  
      const handleLogin = () => {
        authStore.login({ username, password });
      };
  
      return { username, password, handleLogin };
    },
  };
  </script>
  