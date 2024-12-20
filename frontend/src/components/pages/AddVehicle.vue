<template>
  <div class="vehicle-form-page">
    <div class="vehicle-form-container">
      <h2 class="vehicle-form-title">{{ formMode === 'add' ? 'Adicionar Veículo' : 'Editar Veículo' }}</h2>
      <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="vehicle-form">
        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Marca:</label>
          <select v-model="formData.selectedMarca" :disabled="formMode === 'edit'" @change="fetchModelos" required class="vehicle-form-select">
            <option value="" disabled>Selecione uma marca</option>
            <option v-for="marca in marcas" :key="marca.codigo" :value="marca.codigo">{{ marca.nome }}</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Modelo:</label>
          <select
            v-model="formData.selectedModelo"
            :disabled="formMode === 'edit' || !modelos.length"
            @change="fetchAnos"
            required
            class="vehicle-form-select"
          >
            <option value="" disabled>Selecione um modelo</option>
            <option v-for="modelo in modelos" :key="modelo.codigo" :value="modelo.codigo">{{ modelo.nome }}</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Ano:</label>
          <select v-model="formData.selectedAno" :disabled="formMode === 'edit'" required class="vehicle-form-select">
            <option value="" disabled>Selecione o ano</option>
            <option v-for="ano in anos" :key="ano.codigo" :value="ano.codigo">{{ ano.nome }}</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Preço:</label>
          <input
            v-model.number="formData.preco"
            type="number"
            step="0.01"
            placeholder="Digite o preço"
            required
            class="vehicle-form-input"
          />
        </div>
        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Condição:</label>
          <select v-model="formData.condicao" required class="vehicle-form-select">
            <option value="" disabled>Selecione a condição</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Quilometragem:</label>
          <input
            v-model.number="formData.quilometragem"
            type="number"
            placeholder="Digite a quilometragem"
            required
            class="vehicle-form-input"
          />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Carroceria:</label>
          <select v-model="formData.carroceria" required class="vehicle-form-select">
            <option value="" disabled>Selecione a carroceria</option>
            <option v-for="option in carroceriaOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Transmissão:</label>
          <select v-model="formData.transmissao" required class="vehicle-form-select">
            <option value="" disabled>Selecione a transmissão</option>
            <option v-for="option in transmissaoOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Portas:</label>
          <select v-model="formData.portas" required class="vehicle-form-select">
            <option value="" disabled>Selecione o número de portas</option>
            <option value="2">2 Portas</option>
            <option value="4">4 Portas</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Cor:</label>
          <input v-model="formData.cor" placeholder="Cor" required class="vehicle-form-input" />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Tipo de Tração:</label>
          <select v-model="formData.driveType" required class="vehicle-form-select">
            <option value="" disabled>Selecione a tração</option>
            <option value="4x2">4x2</option>
            <option value="4x4">4x4</option>
            <option value="AWD">AWD</option>
          </select>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Número de Cilindros:</label>
          <input
            v-model.number="formData.cilindros"
            type="number"
            placeholder="Digite o número de cilindros"
            required
            class="vehicle-form-input"
          />
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Opcionais:</label>
          <div class="vehicle-form-checkbox-group">
            <div v-for="opcional in opcionaisDisponiveis" :key="opcional" class="vehicle-form-checkbox-item">
              <input type="checkbox" :value="opcional" v-model="formData.opcionais" class="vehicle-form-checkbox" />
              <span>{{ opcional }}</span>
            </div>
          </div>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Descrição:</label>
          <textarea v-model="formData.descricao" placeholder="Digite a descrição" class="vehicle-form-textarea"></textarea>
        </div>

        <div class="vehicle-form-group">
          <label class="vehicle-form-label">Fotos:</label>
          <input type="file" multiple @change="handleFileUpload" accept="image/*" class="vehicle-form-file" />
          <div class="vehicle-thumbnails">
            <div v-for="(foto, index) in formData.existingFotos" :key="index" class="thumbnail-item">
              <img :src="`/uploads/${foto}`" alt="Foto existente" class="vehicle-thumbnail" />
              <button type="button" @click="removeExistingFoto(index)" class="remove-foto-btn">Remover</button>
            </div>
            <div v-for="(foto, index) in previewFotos" :key="index" class="thumbnail-item">
              <img :src="foto" alt="Preview" class="vehicle-thumbnail" />
              <button type="button" @click="removePreviewFoto(index)" class="remove-foto-btn">Remover</button>
            </div>
          </div>
        </div>

        <button type="submit" class="vehicle-form-button">
          {{ formMode === 'add' ? 'Adicionar Veículo' : 'Salvar Alterações' }}
        </button>
        <button v-if="formMode === 'edit'" type="button" class="vehicle-form-button cancel-btn" @click="resetForm">
          Cancelar
        </button>
      </form>
    </div>

    <!-- Listagem de Veículos -->
    <div class="vehicle-management-section">
      <h2>Gerenciar Veículos</h2>
      <div class="vehicle-grid-adm">
        <div v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card-adm">
          <div class="vehicle-image-adm">
            <Splide :options="{ type: 'loop', autoplay: true, interval: 3000 }">
              <SplideSlide v-for="foto in vehicle.fotos" :key="foto">
                <img :src="`api/uploads/${foto}`" alt="Vehicle photo" />
              </SplideSlide>
            </Splide>
          </div>
          <div class="vehicle-info-adm">
            <h3>{{ vehicle.marca || 'Não informado' }}</h3>
            <h4>{{ vehicle.modelo || 'Não informado' }}</h4>
            <p class="price-adm">R$ {{ Math.floor(vehicle.preco).toLocaleString('pt-BR') }}</p>
            <div class="vehicle-management-actions">
              <button @click="editVehicle(vehicle)" class="btn-edit">Editar</button>
              <button @click="deleteVehicle(vehicle.id)" class="btn-delete">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@/assets/VehicleAdd.css';

export default {
  components: {
    Splide,
    SplideSlide,
  },
  beforeCreate() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== 1) {
        this.$router.push("/");
    }
  },
  data() {
    return {
      formMode: 'add',
      vehicles: [],
      marcas: [],
      modelos: [],
      anos: [],
      previewFotos: [],
      formData: {
        selectedMarca: '',
        selectedModelo: '',
        selectedAno: '',
        preco: '',
        quilometragem: 0,
        carroceria: '',
        transmissao: '',
        portas: '',
        driveType: '',
        condicao: '',
        cilindros: 0,
        fotos: [],
        existingFotos: [],
        cor: '',
        descricao: '',
        opcionais: [],
      },
      opcionaisDisponiveis: ['Airbag', 'Alarme', 'Ar condicionado', 'Bancos de couro'],
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
    async fetchMarcas() {
      try {
        const response = await axios.get('https://parallelum.com.br/fipe/api/v1/carros/marcas');
        this.marcas = response.data;
      } catch (error) {
        console.error('Erro ao buscar marcas:', error);
      }
    },
    async fetchModelos() {
      try {
        if (!this.formData.selectedMarca) {
          console.error('Marca não selecionada!');
          return;
        }

        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.formData.selectedMarca}/modelos`
        );
        this.modelos = response.data.modelos;
      } catch (error) {
        console.error('Erro ao buscar modelos:', error);
      }
    },
    async fetchAnos() {
      try {
        if (!this.formData.selectedMarca || !this.formData.selectedModelo) {
          console.error('Marca ou modelo não selecionado!');
          return;
        }

        const response = await axios.get(
          `https://parallelum.com.br/fipe/api/v1/carros/marcas/${this.formData.selectedMarca}/modelos/${this.formData.selectedModelo}/anos`
        );
        this.anos = response.data;
      } catch (error) {
        console.error('Erro ao buscar anos:', error);
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.formData.fotos = Array.from(files); 
      this.previewFotos = Array.from(files).map((file) => URL.createObjectURL(file));
    },

    removeExistingFoto(index) {
      this.formData.existingFotos.splice(index, 1);
    },
    removePreviewFoto(index) {
      this.previewFotos.splice(index, 1);
    },
    async handleSubmit() {
      const formData = new FormData();

      Object.keys(this.formData).forEach((key) => {
        if (key === 'fotos') {
          this.formData.fotos.forEach((file) => formData.append('fotos', file));
        } else {
          formData.append(key, this.formData[key]);
        }
      });

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Token de autenticação não encontrado. Faça login novamente.");
          return this.$router.push("/login");
        }

        await axios.post('/api/vehicles/add', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert('Veículo adicionado com sucesso!');
        this.resetForm();
      } catch (error) {
        console.error('Erro ao adicionar veículo:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Erro ao adicionar veículo.');
      }
    },

    async deleteVehicle(id) {
      try {
        await axios.delete(`/api/vehicles/${id}`);
        alert('Veículo excluído com sucesso!');
        this.fetchVehicles();
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
      }
    },
    editVehicle(vehicle) {
      this.formMode = 'edit';
      this.formData = { ...vehicle, fotos: [], existingFotos: vehicle.fotos };
    },
    resetForm() {
      this.formMode = 'add';
      this.formData = {
        selectedMarca: '',
        selectedModelo: '',
        selectedAno: '',
        preco: '',
        quilometragem: 0,
        carroceria: '',
        transmissao: '',
        portas: '',
        driveType: '',
        condicao: '',
        cilindros: 0,
        fotos: [],
        existingFotos: [],
        cor: '',
        descricao: '',
        opcionais: [],
      };
      this.previewFotos = [];
    },
  },
  mounted() {
    this.fetchVehicles();
    this.fetchMarcas();
  },
};
</script>
