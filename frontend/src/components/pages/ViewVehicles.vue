<template>
  <div>
    <!-- Layout Principal -->
    <div class="main-container">
      <!-- Filtros -->
      <aside class="filters">
        <h3>Filtros</h3>

        <!-- Marcas -->
        <h4>Marcas</h4>
        <div>
          <button v-for="marca in uniqueBrands" :key="marca" @click="filterByBrand(marca)">
            {{ marca }}
          </button>
        </div>

        <!-- Faixa de Preço -->
        <h4>Faixa de Preço</h4>
        <input type="number" v-model="priceFilter.min" placeholder="Mínimo" @input="applyFilters" />
        <input type="number" v-model="priceFilter.max" placeholder="Máximo" @input="applyFilters" />

        <!-- Quilometragem -->
        <h4>Quilometragem</h4>
        <input type="number" v-model="kmFilter.max" placeholder="Máximo (km)" @input="applyFilters" />

        <!-- Opcionais -->
        <h4>Opcionais</h4>
        <div v-for="opcional in opcionaisDisponiveis" :key="opcional">
          <label>
            <input type="checkbox" :value="opcional" v-model="filters.opcionais" @change="applyFilters" />
            {{ opcional }}
          </label>
        </div>
      </aside>

      <!-- Grid de Veículos -->
      <div class="vehicle-grid">
        <div v-for="vehicle in filteredVehicles" :key="vehicle.id" class="vehicle-card">
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`http://localhost:5000/uploads/${foto}`" alt="Vehicle photo" />
              </SplideSlide>
            </Splide>
            <button
              class="favorite-btn"
              @click="toggleFavorite(vehicle)"
              :class="{ active: isFavorite(vehicle.id) }"
            >
              ❤
            </button>

          </div>
          <div class="vehicle-info">
            <h3>{{ vehicle.marca || "Não informado" }} {{ vehicle.modelo || "Não informado" }}</h3>
            <p class="price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
            <p>
              <strong>Ano:</strong> {{ vehicle.ano || "Não informado" }} |
              <strong>Quilometragem:</strong>
              {{ vehicle.quilometragem ? vehicle.quilometragem.toLocaleString() + " Km" : "Não informado" }}
            </p>
            <p><strong>Transmissão:</strong> {{ vehicle.transmissao || "Não informado" }}</p>
            <p><strong>Carroceria:</strong> {{ vehicle.carroceria || "Não informado" }}</p>
            <p><strong>Cor:</strong> {{ vehicle.cor || "Não informado" }}</p>
            <p>
              <strong>Opcionais:</strong>
              {{ vehicle.opcionais.length > 0 ? vehicle.opcionais.join(", ") : "Nenhum" }}
            </p>
            <button class="btn" @click="viewDetails(vehicle.id)">Ver Detalhes</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import "@/assets/VehicleStyles.css";
import axios from "axios";
import "@splidejs/vue-splide/css";
import { Splide, SplideSlide } from "@splidejs/vue-splide";

export default {
  name: "ViewVehicles",
  components: {
    Splide,
    SplideSlide,
  },
  data() {
    return {
      vehicles: [],
      filteredVehicles: [],
      favorites: JSON.parse(localStorage.getItem("favorites")) || [],
      searchQuery: "",
      uniqueBrands: [],
      opcionaisDisponiveis: ["Banco de couro", "Teto solar", "Câmera de ré", "Ar-condicionado"],
      filters: {
        opcionais: [],
      },
      priceFilter: {
        min: null,
        max: null,
      },
      kmFilter: {
        max: null,
      },
    };
  },
  methods: {
    async fetchVehicles() {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        this.vehicles = response.data.map((vehicle) => ({
          ...vehicle,
          quilometragem: vehicle.quilometragem || 0,
          preco: vehicle.preco || 0,
          opcionais: vehicle.opcionais || [],
          fotos: vehicle.fotos || [],
        }));
        this.filteredVehicles = this.vehicles;
        this.uniqueBrands = [...new Set(this.vehicles.map((v) => v.marca))];
      } catch (err) {
        alert("Erro ao buscar veículos.");
      }
    },
    toggleFavorite(vehicle) {
      const index = this.favorites.findIndex((fav) => fav.id === vehicle.id);
      if (index > -1) {
        this.favorites.splice(index, 1); // Remove dos favoritos
      } else {
        this.favorites.push(vehicle); // Adiciona aos favoritos
      }
      localStorage.setItem("favorites", JSON.stringify(this.favorites));
    },
    isFavorite(id) {
      return this.favorites.some((fav) => fav.id === id);
    },

    applyFilters() {
      this.filteredVehicles = this.vehicles.filter((vehicle) => {
        const searchMatch = `${vehicle.marca} ${vehicle.modelo}`.toLowerCase().includes(this.searchQuery.toLowerCase());
        const priceMatch =
          (!this.priceFilter.min || vehicle.preco >= this.priceFilter.min) &&
          (!this.priceFilter.max || vehicle.preco <= this.priceFilter.max);
        const kmMatch = !this.kmFilter.max || vehicle.quilometragem <= this.kmFilter.max;
        const opcionaisMatch =
          this.filters.opcionais.length === 0 ||
          this.filters.opcionais.every((opcional) => vehicle.opcionais.includes(opcional));
        return searchMatch && priceMatch && kmMatch && opcionaisMatch;
      });
    },
    viewDetails(id) {
      this.$router.push(`/details/${id}`);
    },
  },
  created() {
    this.fetchVehicles();
  },
};
</script>
