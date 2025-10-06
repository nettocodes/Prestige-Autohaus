<template>
  <div class="auth-page">
    <!-- Faixa Superior -->
    <div class="auth-banner"></div>

    <!-- Formulário de Login -->
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
        
        console.log('Login realizado com sucesso:', { 
          email: user.email, 
          role: user.role,
          isAdmin: user.role === 1 
        });

        alert("Login bem-sucedido!");
        
        // Redirecionar para admin se for administrador
        if (user.role === 1) {
          this.$router.push("/admin");
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        console.error("Erro ao fazer login:", err.response?.data || err.message);
        alert(err.response?.data.error || "Erro ao fazer login.");
      }
    },
  },
};
</script>
