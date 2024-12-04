<template>
    <div>
      <AppHeader />
  
      <!-- Conteúdo Principal -->
      <div class="details-container">
        <div v-if="vehicle" class="vehicle-details">
          <div class="vehicle-images">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-info">
            <h2>{{ vehicle.marca }} {{ vehicle.modelo }}</h2>
            <p class="price">Preço: R$ {{ Math.floor(vehicle.preco).toLocaleString("pt-BR") }}</p>
            <p><strong>Ano:</strong> {{ vehicle.ano }}</p>
            <p><strong>Quilometragem:</strong> {{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}</p>
            <p><strong>Combustível:</strong> {{ vehicle.combustivel }}</p>
            <p><strong>Cor:</strong> {{ vehicle.cor }}</p>
            <p><strong>Transmissão:</strong> {{ vehicle.transmissao || "Não informado" }}</p>
            <p><strong>Opcionais:</strong> {{ vehicle.opcionais.length > 0 ? vehicle.opcionais.join(", ") : "Nenhum" }}</p>
            <p><strong>Descrição:</strong> {{ vehicle.descricao || "Sem descrição disponível" }}</p>
          </div>
        </div>
        <div v-else>
          <p>Carregando informações do veículo...</p>
        </div>
      </div>
  
      <AppFooter />
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import "@splidejs/vue-splide/css";
  import { Splide, SplideSlide } from "@splidejs/vue-splide";

  import AppHeader from "../common/AppHeader.vue";
  import AppFooter from "../common/AppFooter.vue";
    
  export default {
    name: "VehicleDetails",
    components: {
      Splide,
      SplideSlide,
      AppHeader,
      AppFooter,
    },
    data() {
      return {
        vehicle: null,
      };
    },
    methods: {
      async fetchVehicleDetails() {
        const vehicleId = this.$route.params.id;
        try {
          const response = await axios.get(`http://localhost:5000/api/vehicles/${vehicleId}`);
          this.vehicle = response.data;
        } catch (err) {
          alert("Erro ao buscar detalhes do veículo.");
          console.error(err);
        }
      },
    },
    created() {
      this.fetchVehicleDetails();
    },
  };
  </script>
  
  <style>
  .details-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .vehicle-details {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  
  .vehicle-images {
    flex: 1;
    min-width: 400px;
  }
  
  .vehicle-images img {
    width: 100%;
    height: auto;
    border-radius: 10px;
  }
  
  .vehicle-info {
    flex: 2;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .vehicle-info h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  
  .vehicle-info .price {
    font-size: 20px;
    font-weight: bold;
    color: #28a745;
    margin: 10px 0;
  }
  
  .vehicle-info p {
    font-size: 16px;
    margin: 5px 0;
    color: #666;
  }
  
  .footer {
    background-color: #fff;
    text-align: center;
    padding: 20px;
    border-top: 1px solid #ddd;
  }
  </style>
  