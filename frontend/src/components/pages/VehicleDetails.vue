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

  