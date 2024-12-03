<template>
    <div id="app">
      <h1>Vehicle Management System</h1>
      <nav>
        <!-- Links de navegação -->
        <router-link to="/add">Add Vehicle</router-link> |
        <router-link to="/view">View Vehicles</router-link>
      </nav>
      <!-- Local onde os componentes de rota serão exibidos -->
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
  };
  </script>
  
  <style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 20px;
  }
  
  nav {
    margin-bottom: 20px;
  }
  
  nav a {
    text-decoration: none;
    color: #42b983;
    margin: 0 10px;
  }
  
  nav a.router-link-exact-active {
    font-weight: bold;
    color: #35495e;
  }
  </style>
  