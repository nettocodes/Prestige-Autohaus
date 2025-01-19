<template>
  <div class="details-page">
    <nav class="breadcrumb">
      <router-link to="/">Home</router-link> / <router-link to="/view">Estoque</router-link> / {{ vehicle?.modelo || "Loading..." }}
    </nav>

    <div class="vehicle-gallery">
      <Splide :options="mainOptions" ref="mainCarousel">
        <SplideSlide v-for="(foto, index) in vehicle.fotos || []" :key="index" class="splide-slide"
          @click="openZoom(foto)">
          <img :src="`/api/uploads/${foto}`" alt="Vehicle photo" />
        </SplideSlide>
      </Splide>
    </div>
    <div class="details-content">

      <div class="car-details-content">
        <div class="details-layout">

          <!-- Informações do Veículo -->
          <div class="vehicle-details">
            <div class="vehicle-header">
              <h1>{{ vehicle.marca || "Marca não informada" }} </h1>
              <h2>{{ vehicle.modelo || "Modelo não informado" }}</h2>
            </div>



            <div class="tags">
              <span class="tag">Ano: {{ vehicle.ano || "Não informado" }}</span>
              <span class="tag">Transmissão: {{ vehicle.transmissao || "Não informado" }}</span>
              <span class="tag">Combustível: {{ vehicle.combustivel || "Não informado" }}</span>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <span class="detail-label">Carroceria:</span>
                <span class="detail-value">{{ vehicle.carroceria || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Condição:</span>
                <span class="detail-value">{{ vehicle.condicao || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Quilometragem:</span>
                <span class="detail-value">{{ vehicle.quilometragem?.toLocaleString() || "0" }} Km</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Portas:</span>
                <span class="detail-value">{{ vehicle.portas || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cor:</span>
                <span class="detail-value">{{ vehicle.cor || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tipo de Drive:</span>
                <span class="detail-value">{{ vehicle.driveType || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Cilindros:</span>
                <span class="detail-value">{{ vehicle.cilindros || "Não informado" }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Opcionais:</span>
                <span class="detail-value">
                  <span v-if="vehicle.opcionais.length">
                    {{ vehicle.opcionais.join(", ") }}
                  </span>
                  <span v-else>Não informado</span>
                </span>
              </div>
            </div>
            <div class="details-grid">
              <p class="subtitle">{{ vehicle.descricao || "Explore mais detalhes sobre este veículo." }}</p>
            </div>
          </div>
        </div>

        <!-- Detalhes Adicionais -->
        <div class="additional-details">
          <div class="price-section">
            <h2>R$ {{ Math.floor(vehicle.preco || 0).toLocaleString("pt-BR") }}</h2>
          </div>
          <div class="contact-section">
            <h3>Entre em contato</h3>
            <form class="contact-form">
              <input type="text" placeholder="Nome" required />
              <input type="email" placeholder="E-mail" required />
              <input type="tel" placeholder="Telefone" required />
              <textarea placeholder="Mensagem" rows="3"></textarea>
              <button type="submit" class="btn-primary">Enviar</button>
            </form>
          </div>
          <div class="contact-buttons">
              <a :href="`https://wa.me/47997486918?text=${encodeURIComponent(`Olá, estou interessado no veículo ${vehicle.marca} ${vehicle.modelo}`)}`"
                target="_blank" class="whatsapp-btn">
                <img src="@/assets/images/icons/whatsapp.png" alt="WhatsApp Icon" class="whatsapp-icon" />
                <span>WhatsApp</span>
              </a>
            </div>
        </div>
      </div>


      <!-- Modal de Zoom -->
      <div v-if="zoomImage" class="zoom-modal" @click="closeZoom">
        <div class="zoom-container" @mousemove="handleMouseMove" @mouseleave="resetZoom">
          <img ref="zoomedImage" :src="`/api/uploads/${zoomImage}`" alt="Zoomed image" />
          <div class="zoom-lens" :style="{ top: lensPosition.y + 'px', left: lensPosition.x + 'px' }"></div>
          <div class="zoom-result" :style="{
            backgroundImage: `url(/api/uploads/${zoomImage})`,
            backgroundPosition: zoomBackgroundPosition,
          }"></div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import axios from "axios";
import "@splidejs/vue-splide/css";
import AppFooter from "../common/AppFooter.vue";
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@/assets/VehicleDetails.css";

export default {
  name: "VehicleDetails",
  components: {
    Splide,
    SplideSlide,
    AppFooter,
  },
  data() {
    return {
      vehicle: null,
      zoomImage: null, // Controla a imagem exibida no modal
      lensPosition: { x: 0, y: 0 }, // Posição do quadrado de zoom
      zoomBackgroundPosition: "0% 0%",
      isZoomEnabled: false,
      mainOptions: {
        type: "loop",
        height: "500px", // Altura fixa dos slides
        perPage: 3, // Exibe 3 imagens por página
        pagination: true,
        arrows: true,
        autoplay: true,
        interval: 4000,
        gap: '0rem', // Espaço entre as imagens
        cover: true,
        breakpoints: {
          768: { perPage: 2 },
          480: { perPage: 1 },
        },
      },
    };
  },
  methods: {
    async fetchVehicleDetails() {
      const vehicleId = this.$route.params.id;
      const sessionId = this.getSessionId();

      try {
        console.log(`Buscando detalhes do veículo ID: ${vehicleId}`);

        // Obter detalhes do veículo
        const response = await axios.get(`/api/vehicles/${vehicleId}`);
        this.vehicle = response.data;

        // Registrar visualização se ainda não foi registrada na sessão
        const viewedVehicles = JSON.parse(localStorage.getItem("viewedVehicles")) || [];
        if (!viewedVehicles.includes(vehicleId)) {
          await this.registerView(vehicleId, sessionId);
          viewedVehicles.push(vehicleId);
          localStorage.setItem("viewedVehicles", JSON.stringify(viewedVehicles));
        }
      } catch (err) {
        console.error("Erro ao buscar detalhes do veículo:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    openZoom(image) {
      this.zoomImage = image; // Define a imagem para exibir no modal
    },
    closeZoom() {
      this.zoomImage = null; // Fecha o modal
    },
    handleMouseMove(event) {
      if (!this.isZoomEnabled) return;
      const zoomContainer = event.currentTarget;
      const rect = zoomContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const lensX = Math.max(0, Math.min(x - 75, rect.width - 150));
      const lensY = Math.max(0, Math.min(y - 75, rect.height - 150));
      const backgroundX = (x / rect.width) * 100;
      const backgroundY = (y / rect.height) * 100;
      this.lensPosition = { x: lensX, y: lensY };
      this.zoomBackgroundPosition = `${backgroundX}% ${backgroundY}%`;
    },
    resetZoom() {
      this.lensPosition = { x: 0, y: 0 };
      this.zoomBackgroundPosition = "0% 0%";
    },
    checkZoomAvailability() {
      this.isZoomEnabled = window.matchMedia("(min-width: 768px)").matches;
    },
    async registerView(vehicleId, sessionId) {
      if (!vehicleId || !sessionId) {
        console.error("Erro: vehicleId ou sessionId ausentes.");
        return;
      }

      try {
        console.log("Registrando visualização...");
        const response = await axios.post("/api/statistics/views", { vehicleId, sessionId });
        console.log(`Visualização registrada com sucesso para o veículo ID: ${vehicleId}`, response.data);
      } catch (err) {
        console.error("Erro ao registrar visualização:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    async handleContactClick() {
      const sessionId = this.getSessionId();

      try {
        console.log("Registrando clique em contato...");
        await axios.post("/api/statistics/contact-clicks", { sessionId });
        console.log("Clique em contato registrado com sucesso.");
      } catch (err) {
        console.error("Erro ao registrar clique em contato:", err.message);
        if (err.response) {
          console.error("Detalhes do erro:", err.response.data);
        }
      }
    },
    getSessionId() {
      let sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2);
        localStorage.setItem("sessionId", sessionId);
      }
      return sessionId;
    },
  },
  mounted() {
    console.log("Componente VehicleDetails montado.");
    this.fetchVehicleDetails();
    this.checkZoomAvailability();
    window.addEventListener("resize", this.checkZoomAvailability);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkZoomAvailability);
  },
};
</script>
