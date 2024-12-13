<template>
  <div class="auth-container">
    <h2>Registrar</h2>
    <form @submit.prevent="registerUser">
      <div>
        <label for="name">Nome</label>
        <input v-model="name" id="name" type="text" placeholder="Seu nome" required />
      </div>
      <div>
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" placeholder="Seu email" required />
      </div>
      <div>
        <label for="password">Senha</label>
        <input v-model="password" id="password" type="password" placeholder="Sua senha" required />
      </div>
      <button type="submit">Registrar</button>
    </form>
    

    <router-link class="auth-link" to="/login">Já tem uma conta? Faça login</router-link>
  </div>
</template>
  
  <script>
  import axios from "axios";
  import "@/assets/AppAuth.css";

  export default {
    name: "UserRegister",
    data() {
      return {
        name: "",
        email: "",
        password: "",
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post("http://localhost:5000/api/auth/register", {
            name: this.name,
            email: this.email,
            password: this.password,
          });
          alert(response.data.message);
          this.$router.push("/login"); // Redireciona para a página de login
        } catch (err) {
          console.error("Erro ao registrar usuário:", err.response?.data || err.message);
          alert(err.response?.data.error || "Erro ao registrar.");
        }
      },
    },
  };
  </script>
