<template>
  <header class="app-header" :class="{ shrink: isScrolled }">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img class="header-logo" src="@/assets/images/icons/logo.png" alt="Logo">
        </router-link>
      </div>
      <button class="menu-toggle" @click="toggleMenu" v-if="isMobile">
        ☰
      </button>
      <nav class="nav-links-container" :class="{ open: isMenuOpen }">
        <ul class="nav-links">
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/view">Estoque</router-link></li>
          <li v-if="isLoggedIn && !isAdmin"><router-link to="/favorites">Favoritos</router-link></li>
          <li v-if="isAdmin"><router-link to="/admin">Painel</router-link></li>
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
      isMenuOpen: false,
      isMobile: window.innerWidth <= 768,
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
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isMenuOpen = false;
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>