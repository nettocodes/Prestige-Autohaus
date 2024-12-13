<template>
  <div class="login-container">
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
  </div>
</template>

<script>
import axios from "axios";
import { updateAuthState } from "@/authState";

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
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          email: this.email,
          password: this.password,
        });
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        updateAuthState(); // Atualiza o estado global

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

  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    width: 100%;
    padding: 10px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background: #0056b3;
  }
  </style>
  