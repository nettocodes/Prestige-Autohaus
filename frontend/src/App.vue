<template>
  <div id="app">
    <!-- Cabeçalho persistente -->
    <AppHeader />

    
    <main>
      <router-view />
    </main>

    <!-- Rodapé persistente -->
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from "@/components/common/AppHeader.vue";
import AppFooter from "@/components/common/AppFooter.vue";

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
  },
};
</script>

<style>
#app {
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  text-align: center;
  color: #2c3e50;
  background-color: #000;
}
</style>
