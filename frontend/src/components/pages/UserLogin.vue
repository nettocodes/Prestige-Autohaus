
<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email</label>
        <input v-model="email" id="email" type="email" placeholder="Seu email" required />
      </div>
      <div>
        <label for="password">Senha</label>
        <input v-model="password" id="password" type="password" placeholder="Sua senha" required />
      </div>
      <button type="submit">Entrar</button>
    </form>
    <router-link class="auth-link" to="/register">Não tem uma conta? Registre-se</router-link>
  </div>
</template>
<script>
import axios from "axios";
import { updateAuthState } from "@/authState"; // Importa corretamente a função
import "@/assets/AppAuth.css";

export default {
  name: "UserLogin",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post("/api/auth/login", {
          email: this.email,
          password: this.password,
        });
        const { token, user } = response.data;

        // Salva os dados no localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Chama a função para atualizar o estado global
        if (typeof updateAuthState === "function") {
          updateAuthState();
        }

        alert("Login bem-sucedido!");
        this.$router.push("/");
      } catch (err) {
        console.error("Erro ao fazer login:", err.response?.data || err.message);
        alert(err.response?.data.error || "Erro ao fazer login.");
      }
    },
  },
};
</script>
