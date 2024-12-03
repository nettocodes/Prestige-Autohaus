<template>
    <div class="container">
      <h2>Vehicles</h2>
      <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
        <h3>{{ vehicle.marca }} {{ vehicle.modelo }} ({{ vehicle.ano }})</h3>
        <p><strong>Carroceria:</strong> {{ vehicle.carroceria }}</p>
        <p><strong>Combustível:</strong> {{ vehicle.combustivel }}</p>
        <p><strong>Quilometragem:</strong> {{ vehicle.quilometragem }} km</p>
        <p><strong>Transmissão:</strong> {{ vehicle.transmissao }}</p>
        <p><strong>Opcionais:</strong> {{ vehicle.opcionais.join(', ') }}</p>
        <div class="photos">
          <strong>Fotos:</strong>
          <div v-for="foto in vehicle.fotos" :key="foto">
            <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import '../assets/VehicleView.css'; // Importar o CSS
  
  export default {
    data() {
      return {
        vehicles: [],
      };
    },
    async created() {
      try {
        const response = await axios.get('http://localhost:5000/api/vehicles');
        this.vehicles = response.data;
      } catch (err) {
        alert('Error fetching vehicles.');
      }
    },
  };
  </script>
  