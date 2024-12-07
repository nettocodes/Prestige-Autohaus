<template>
  <div class="details-page">
    <div class="details-content">

      <nav class="breadcrumb">
        <router-link to="/">Home</router-link> / Listings / {{ vehicle?.modelo || "Loading..." }}
      </nav>
  
      <div v-if="vehicle" class="vehicle-details-container">
        <!-- Galeria de Imagens -->
        <div class="vehicle-gallery">
          <Splide :options="mainOptions" ref="mainCarousel">
            <SplideSlide v-for="(foto, index) in vehicle.fotos || []" :key="index" class="splide-slide">
              <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
            </SplideSlide>
          </Splide>
        </div>
  
        <!-- Informações principais -->
        <div class="vehicle-main-info">
          <div class="vehicle-title">
            <h1>{{ vehicle.marca || "Marca não informada" }} {{ vehicle.modelo || "Modelo não informado" }}</h1>
            <p class="subtitle">{{ vehicle.descricao || "Explore mais detalhes sobre este veículo." }}</p>
          </div>
          <div class="price-section">
            <h2>R$ {{ Math.floor(vehicle.preco || 0).toLocaleString("pt-BR") }}</h2>
            <div class="price-offer">
              <img src="@/assets/images/icons/offer.png" alt="">
              <button class="offer-btn"> Fazer uma Oferta</button>
            </div>
          </div>
          <div class="tags">
            <span class="tag">{{ vehicle.ano || "Ano não informado" }}</span>
            <span class="tag">{{ vehicle.transmissao || "Transmissão não informada" }}</span>
            <span class="tag">{{ vehicle.combustivel || "Combustível não informado" }}</span>
          </div>
        </div>
      </div>
  
      <!-- Resumo do Veículo -->
      <div v-if="vehicle" class="vehicle-overview">
        <h2>Visão geral</h2>
        <div class="details-grid">
          <div><strong>Carroceria:</strong> {{ vehicle.carroceria || "Não informado" }}</div>
          <div><strong>Condicao:</strong> {{ vehicle.condicao || "Usado" }}</div>
          <div><strong>Quilometragem:</strong> {{ vehicle.quilometragem?.toLocaleString() || "0" }} Km</div>
          <div><strong>Combustivel:</strong> {{ vehicle.combustivel || "Não informado" }}</div>
          <div><strong>Portas:</strong> {{ vehicle.portas || "4" }}</div>
          <div><strong>Transmissao:</strong> {{ vehicle.transmissao || "Não informado" }}</div>
          <div><strong>Cor:</strong> {{ vehicle.cor || "Não informado" }}</div>
        </div>
      </div>
  
      <div v-else class="loading">Carregando informações do veículo...</div>
    </div>
  </div>
</template>

  <script>
  import axios from "axios";
  import "@splidejs/vue-splide/css";
  import { Splide, SplideSlide } from "@splidejs/vue-splide";
  import "@/assets/VehicleDetails.css";
    
  export default {
  name: "VehicleDetails",
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      vehicle: null,
      mainOptions: {
        type: "loop", // Permite rotação contínua das imagens
        heightRatio: 0.6, // Ajusta a proporção de altura
        pagination: true, // Adiciona botões de paginação
        arrows: true, // Adiciona setas para navegação
        autoplay: true, // Ativa autoplay
        interval: 4000, // Intervalo entre trocas de imagens
        cover: true, // Garante que as imagens cubram o slide
      },
    };
  },

  methods: {
    async fetchVehicleDetails() {
      const vehicleId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
        this.vehicle = response.data || {}; // Garante que o veículo seja sempre um objeto
      } catch (err) {
        console.error("Erro ao buscar detalhes do veículo:", err);
        alert("Erro ao buscar detalhes do veículo. Tente novamente mais tarde.");
      }
    },
  },
  mounted() {
    this.fetchVehicleDetails();
  },
};
</script>

  