<template>
    <div class="register-container">
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
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
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
  
  <style scoped>
  .register-container {
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
  