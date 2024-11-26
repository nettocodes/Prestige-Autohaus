<template>
    <div class="vehicle-card">
      <img :src="vehicle.imagem_url" alt="Imagem do veículo" />
      <h3>{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
      <p>Ano: {{ vehicle.ano }}</p>
      <p>Preço: R$ {{ vehicle.preco.toFixed(2) }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      vehicle: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .vehicle-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 1rem;
  }
  .vehicle-card img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  </style>
  