<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">
          <img class="header-logo" src="@/assets/images/icons/logo.png" alt="">
        </router-link>
      </div>
      <nav>
        <ul class="nav-links">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/add">Add Vehicle</router-link></li>
          <li><router-link to="/view">View Vehicles</router-link></li>
          <li><router-link to="/favorites">Favorites</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import "@/assets/AppHeader.css";

export default {
  name: "AppHeader",
};
</script>
