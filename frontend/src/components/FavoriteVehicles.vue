<template>
    <div class="vehicle-container">
      <h2>Favoritos</h2>
      <div v-if="favorites.length === 0">
        <p>Você ainda não adicionou veículos aos favoritos.</p>
      </div>
      <div v-else>
        <div v-for="vehicle in favorites" :key="vehicle.id" class="vehicle-card">
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-info">
            <h3>{{ vehicle.marca }} {{ vehicle.modelo }}</h3>
            <p class="description">{{ vehicle.carroceria }} - {{ vehicle.combustivel }}</p>
            <p class="price">R$ {{ new Intl.NumberFormat().format(vehicle.preco) }}</p>
            <p class="details">{{ vehicle.ano }} | {{ vehicle.quilometragem.toLocaleString() }} Km</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Splide, SplideSlide } from '@splidejs/vue-splide';
  export default {
    name: 'FavoriteVehicles',
    components: {
      Splide,
      SplideSlide,
    },
    data() {
      return {
        favorites: JSON.parse(localStorage.getItem('favorites')) || [],
      };
    },
  };
  </script>
  
  