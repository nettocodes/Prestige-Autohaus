<template>
  <header class="app-header" :class="{ shrink: isScrolled }">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img class="header-logo" src="@/assets/images/icons/logo.png" alt="Logo">
        </router-link>
      </div>
      <nav class="nav-links-container">
        <ul class="nav-links">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/view">Estoque</router-link></li>
          <li v-if="isLoggedIn && !isAdmin"><router-link to="/favorites">Favoritos</router-link></li>
          <li v-if="isAdmin"><router-link to="/add">Administração</router-link></li>
          <li v-if="isAdmin"><router-link to="/statistics">Estatísticas</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login">Entrar</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/register">Registrar</router-link></li>
          <li v-if="isLoggedIn">
            <button class="logout-btn" @click="logout">Sair</button>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script>
import "@/assets/AppHeader.css";
import { authState, updateAuthState } from "@/authState";

export default {
  name: "AppHeader",
  data() {
    return {
      isScrolled: false,
    };
  },
  computed: {
    isLoggedIn() {
      return authState.isLoggedIn;
    },
    isAdmin() {
      return authState.isAdmin;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateAuthState();
      this.$router.push("/login");
    },
    handleScroll() {
      this.isScrolled = window.scrollY > 50;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
