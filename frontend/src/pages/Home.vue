<template>
    <div>
      <Header />
      <div class="vehicle-list">
        <VehicleCard v-for="vehicle in vehicles" :key="vehicle.id" :vehicle="vehicle" />
      </div>
      <Footer />
    </div>
  </template>
  
  <script>
  import Header from "../components/Header.vue";
  import Footer from "../components/Footer.vue";
  import VehicleCard from "../components/VehicleCard.vue";
  import { useVehicleStore } from "../store/vehicleStore";
  
  export default {
    components: { Header, Footer, VehicleCard },
    setup() {
      const vehicleStore = useVehicleStore();
      vehicleStore.fetchVehicles();
  
      return {
        vehicles: vehicleStore.vehicles,
      };
    },
  };
  </script>
  
  <style>
  .vehicle-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 2rem;
  }
  </style>
  