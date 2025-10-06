<template>
    <div class="vehicle-management-section">
      <h2 class="management-title">Gerenciar Veículos</h2>
      <div class="vehicle-grid">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
          <!-- Imagem do veículo com slider -->
          <div class="vehicle-image">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Foto do veículo" />
              </SplideSlide>
            </Splide>
          </div>
  
          <!-- Informações do veículo -->
          <div class="vehicle-info">
            <h3 class="vehicle-brand">{{ vehicle.marca || 'Não informado' }}</h3>
            <h4 class="vehicle-model">{{ vehicle.modelo || 'Não informado' }}</h4>
            <p class="vehicle-price">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
  
            <!-- Ações de gerenciamento -->
            <div class="vehicle-actions">
              <button @click="openEditModal(vehicle)" class="action-btn btn-edit">Editar</button>
              <button @click="deleteVehicle(vehicle.id)" class="action-btn btn-delete">Excluir</button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal para editar veículo -->
      <div v-if="isModalOpen" class="modal-overlay">
        <div class="modal-content">
          <h3 class="modal-title">Editar Veículo</h3>
  
          <form @submit.prevent="updateVehicle" class="modal-form">
            <div class="modal-scroll">
              <div class="modal-field">
                <label class="modal-label">Marca:</label>
                <p class="modal-static">{{ editableVehicle.marca || 'Não informado' }}</p>
              </div>
              <div class="modal-field">
                <label class="modal-label">Modelo:</label>
                <p class="modal-static">{{ editableVehicle.modelo || 'Não informado' }}</p>
              </div>
              <div class="modal-field">
                <label class="modal-label">Preço:</label>
                <input type="number" v-model="editableVehicle.preco" class="modal-input" />
              </div>
              <div class="modal-field">
                <label class="modal-label">Quilometragem:</label>
                <input type="number" v-model="editableVehicle.quilometragem" class="modal-input" />
              </div>
              <div class="modal-field">
                <label class="modal-label">Carroceria:</label>
                <select v-model="editableVehicle.carroceria" class="modal-select">
                  <option v-for="option in carroceriaOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
              <div class="modal-field">
                <label class="modal-label">Transmissão:</label>
                <select v-model="editableVehicle.transmissao" class="modal-select">
                  <option v-for="option in transmissaoOptions" :key="option" :value="option">{{ option }}</option>
                </select>
              </div>
              <div class="modal-field">
                <label class="modal-label">Portas:</label>
                <input type="number" v-model="editableVehicle.portas" class="modal-input" />
              </div>
              <div class="modal-field">
                <label class="modal-label">Cor:</label>
                <input type="text" v-model="editableVehicle.cor" class="modal-input" />
              </div>
              <div class="modal-field">
                <label class="modal-label">Cilindros:</label>
                <input type="number" v-model="editableVehicle.cilindros" class="modal-input" />
              </div>
              <div class="modal-field">
                <label class="modal-label">Descrição:</label>
                <textarea v-model="editableVehicle.descricao" class="modal-textarea"></textarea>
              </div>
  
              <!-- Gerenciamento de fotos -->
              <div class="modal-field">
                <label class="modal-label">Fotos:</label>
                <div class="photo-management">
                  <div v-for="(foto, index) in editableVehicle.fotos" :key="index" class="photo-item">
                    <img :src="`api/uploads/${foto}`" alt="Foto do veículo" class="photo-img" />
                    <button type="button" @click="removePhoto(index)" class="photo-remove-btn">Remover</button>
                  </div>
                  <input type="file" multiple @change="addPhotos" class="photo-upload-input" />
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="submit" class="modal-submit-btn">Salvar Alterações</button>
              <button type="button" @click="closeModal" class="modal-cancel-btn">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';
  import { Splide, SplideSlide } from '@splidejs/vue-splide';

  export default {
    components: {
      Splide,
      SplideSlide,
    },
    data() {
      return {
        vehicles: [],
        isModalOpen: false,
        editableVehicle: {},
        carroceriaOptions: ['Hatch', 'Sedan', 'SUV'],
        transmissaoOptions: ['Manual', 'Automática'],
      };
    },
    methods: {
      async fetchVehicles() {
        try {
          const response = await axios.get('/api/vehicles');
          this.vehicles = response.data.map((vehicle) => ({
            ...vehicle,
            fotos: vehicle.fotos || [],
          }));
        } catch (error) {
          console.error('Erro ao buscar veículos:', error);
        }
      },
      async deleteVehicle(id) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('Você precisa estar logado para excluir veículos.');
            this.$router.push('/login');
            return;
          }

          await axios.delete(`/api/vehicles/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          alert('Veículo excluído com sucesso!');
          this.fetchVehicles();
        } catch (error) {
          console.error('Erro ao excluir veículo:', error);
          if (error.response?.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            this.$router.push('/login');
          } else {
            alert('Erro ao excluir veículo. Tente novamente.');
          }
        }
      },
      openEditModal(vehicle) {
        this.editableVehicle = { ...vehicle };
        this.isModalOpen = true;
      },
      closeModal() {
        this.isModalOpen = false;
        this.editableVehicle = {};
      },
      removePhoto(index) {
        this.editableVehicle.fotos.splice(index, 1);
      },
      addPhotos(event) {
        const files = Array.from(event.target.files);
        files.forEach((file) => {
          this.editableVehicle.fotos.push(file.name); // Simula a adição; ajuste conforme necessário para upload real
        });
      },
      async updateVehicle() {
        try {
          const updatedVehicle = {
            ...this.editableVehicle,
            fotosExistentes: JSON.stringify(this.editableVehicle.fotos), // Fotos existentes
          };
          const formData = new FormData();
          Object.keys(updatedVehicle).forEach((key) => {
            if (Array.isArray(updatedVehicle[key])) {
              updatedVehicle[key].forEach((item) => formData.append(`${key}[]`, item));
            } else {
              formData.append(key, updatedVehicle[key]);
            }
          });

          const token = localStorage.getItem('token');
          if (!token) {
            alert('Você precisa estar logado para atualizar veículos.');
            this.$router.push('/login');
            return;
          }

          await axios.put(`/api/vehicles/${updatedVehicle.id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
          });
          alert('Veículo atualizado com sucesso!');
          this.fetchVehicles();
          this.closeModal();
        } catch (error) {
          console.error('Erro ao atualizar veículo:', error);
          if (error.response?.status === 401) {
            alert('Sessão expirada. Faça login novamente.');
            this.$router.push('/login');
          } else {
            alert('Erro ao atualizar veículo. Tente novamente.');
          }
        }
      },
    },
    mounted() {
      this.fetchVehicles();
    },
  };
  </script>