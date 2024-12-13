<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img class="header-logo" src="@/assets/images/icons/logo.png" alt="Logo">
        </router-link>
      </div>
      <button class="menu-toggle" @click="toggleMenu">☰</button>
      <nav>
        <ul :class="['nav-links', { active: isMenuActive }]">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/view">View Vehicles</router-link></li>
          <li v-if="isLoggedIn && !isAdmin"><router-link to="/favorites">Favorites</router-link></li>
          <li v-if="isAdmin"><router-link to="/add">Add Vehicle</router-link></li>
          <li v-if="isAdmin"><router-link to="/statistics">Statistics</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
          <li v-if="isLoggedIn"><button @click="logout">Logout</button></li>
        </ul>
      </nav>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">OK</button>
      </div>
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
      isMenuActive: false,
      showModal: false,
      modalMessage: "",
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
    toggleMenu() {
      this.isMenuActive = !this.isMenuActive;
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      updateAuthState();
      this.$router.push("/login");
    },
    showModalMessage(message) {
      this.modalMessage = message;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalMessage = "";
    },
  },
};
</script>
