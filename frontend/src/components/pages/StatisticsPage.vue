<template>
    <div class="statistics-page">
      <h1>📊 Estatísticas do Sistema</h1>
  
      <!-- Filtros por datas -->
      <section class="filter-section">
        <h2>🔍 Filtrar por Datas</h2>
        <div class="filter-options">
          <button
            v-for="filter in dateFilters"
            :key="filter.value"
            :class="{ active: selectedDateFilter === filter.value }"
            @click="applyDateFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
        <div class="custom-date-filter">
          <label>De: <input type="date" v-model="customDateRange.start" /></label>
          <label>Até: <input type="date" v-model="customDateRange.end" /></label>
          <button @click="applyCustomDateFilter">Aplicar</button>
        </div>
      </section>
  
      <!-- Ranking dos Veículos Mais Acessados -->
      <section class="statistics-section">
        <h2>🚗 Veículos Mais Acessados</h2>
        <div v-if="mostAccessedVehicles.length > 0" class="vehicle-rankings">
          <div v-for="vehicle in mostAccessedVehicles" :key="vehicle.id" class="vehicle-card">
            <div class="vehicle-gallery">
              <Splide :options="mainOptions">
                <SplideSlide v-for="(foto, index) in vehicle.fotos" :key="index">
                  <img :src="`/api/uploads/${foto}`" alt="Vehicle photo" />
                </SplideSlide>
              </Splide>
            </div>
            <div class="vehicle-info">
              <h3>{{ vehicle.marca }}</h3>
              <h4>{{ vehicle.modelo }}</h4>
              <p class="access-count">
                <span>Acessos:</span>
                <span class="count">{{ vehicle.accessCount }}</span>
              </p>
            </div>
          </div>
        </div>
        <h2 v-else>Nenhum veículo acessado na data selecionada.</h2>
      </section>
  
      <!-- Gráfico de Cliques no WhatsApp -->
      <section class="statistics-section">
        <h2>📈 Cliques no WhatsApp</h2>
        <div v-if="whatsappClicks.length > 0" class="chart-container">
          <canvas id="whatsappClicksChart"></canvas>
        </div>
        <h2 v-else>Nenhum clique no WhatsApp na data selecionada.</h2>
      </section>
    </div>
  </template>
  <script>
  import axios from "axios";
  import { Splide, SplideSlide } from "@splidejs/vue-splide";
  import Chart from "chart.js/auto";
  
  export default {
    components: { Splide, SplideSlide },
    data() {
      return {
        mostAccessedVehicles: [],
        whatsappClicks: [],
        mainOptions: {
          type: "loop",
          height: "200px",
          perPage: 1,
          pagination: true,
          arrows: true,
          autoplay: true,
          interval: 3000,
          gap: "1rem",
          cover: true,
        },
        socket: null,
        customDateRange: { start: "", end: "" },
        whatsappChart: null,
        selectedDateFilter: "today", // Filtro padrão
        dateFilters: [
          { label: "Hoje", value: "today" },
          { label: "Ontem", value: "yesterday" },
          { label: "Últimos 7 dias", value: "last7days" },
          { label: "Último mês", value: "lastMonth" },
          { label: "Último ano", value: "lastYear" },
          { label: "Este ano", value: "thisYear" },
        ],
      };
    },
    methods: {
      async fetchStatistics(filter = {}) {
        try {
          const vehiclesResponse = await axios.get("/api/statistics/most-accessed", { params: filter });
          this.mostAccessedVehicles = vehiclesResponse.data.map((vehicle) => ({
            ...vehicle,
            fotos: Array.isArray(vehicle.fotos) ? vehicle.fotos : [],
          }));
  
          const whatsappResponse = await axios.get("/api/statistics/whatsapp-clicks", { params: filter });
          this.whatsappClicks = whatsappResponse.data;
          this.updateWhatsAppChart(whatsappResponse.data);
        } catch (error) {
          console.error("Erro ao buscar estatísticas:", error.message);
        }
      },
      setupWebSocket() {
        this.socket = new WebSocket("ws://localhost:8081");
        this.socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "updateMostAccessed") {
            this.mostAccessedVehicles = data.payload;
          } else if (data.type === "updateWhatsAppClicks") {
            this.updateWhatsAppChart(data.payload);
          }
        };
        this.socket.onclose = () => {
          console.log("WebSocket desconectado. Reconectando...");
          setTimeout(this.setupWebSocket, 5000);
        };
      },
      applyDateFilter(filter) {
        this.selectedDateFilter = filter;
        this.fetchStatistics({ dateFilter: filter });
      },
      applyCustomDateFilter() {
        const { start, end } = this.customDateRange;
        if (start && end) {
          this.selectedDateFilter = null;
          this.fetchStatistics({ startDate: start, endDate: end });
        } else {
          alert("Por favor, selecione um intervalo de datas válido.");
        }
      },
      updateWhatsAppChart(data) {
        const labels = data.map((item) => `${item.vehicleMarca} ${item.vehicleModelo}`);
        const values = data.map((item) => item.clickCount);
  
        const ctx = document.getElementById("whatsappClicksChart");
        if (!ctx) return;
  
        if (!this.whatsappChart) {
          this.whatsappChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  label: "Cliques no WhatsApp",
                  data: values,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: { responsive: true, maintainAspectRatio: false },
          });
        } else {
          this.whatsappChart.data.labels = labels;
          this.whatsappChart.data.datasets[0].data = values;
          this.whatsappChart.update();
        }
      },
    },
    mounted() {
      this.applyDateFilter("today");
      this.setupWebSocket();
    },
    beforeUnmount() {
      if (this.socket) this.socket.close();
    },
  };
  </script>
  
  
  
  <style scoped>
  .statistics-page {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  .filter-section {
    margin-bottom: 20px;
  }
  .filter-options button {
    margin: 0 5px;
    padding: 10px 15px;
    cursor: pointer;
  }
  .custom-date-filter {
    margin-top: 10px;
  }
  .chart-container {
    max-height: 400px;
  }
  .vehicle-rankings {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .vehicle-card {
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    width: 250px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .vehicle-gallery {
    height: 200px;
    background-color: #f5f5f5;
  }
  .vehicle-info {
    padding: 10px;
    text-align: center;
  }
  </style>
  