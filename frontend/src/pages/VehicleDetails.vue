<template>
    <div>
      <Header />
      <div class="vehicle-details">
        <h2>{{ vehicle.marca }} {{ vehicle.modelo }}</h2>
        <img :src="vehicle.imagem_url" alt="Imagem do veículo" />
        <p>Ano: {{ vehicle.ano }}</p>
        <p>Preço: R$ {{ vehicle.preco.toFixed(2) }}</p>
        <p>{{ vehicle.descricao }}</p>
      </div>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from "../components/Header.vue";
  import Footer from "../components/Footer.vue";
  import { useRoute } from "vue-router";
  import { useVehicleStore } from "../store/vehicleStore";
  
  export default {
    components: { Header, Footer },
    setup() {
      const route = useRoute();
      const vehicleStore = useVehicleStore();
      const vehicle = vehicleStore.getVehicleById(route.params.id);
  
      return { vehicle };
    },
  };
  </script>
  
  <style>
  .vehicle-details {
    padding: 2rem;
    text-align: center;
  }
  </style>
  