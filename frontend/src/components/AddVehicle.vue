<template>
    <div>
      <h2>Add Vehicle</h2>
      <form @submit.prevent="addVehicle" enctype="multipart/form-data">
        <input v-model="marca" placeholder="Marca" required />
        <input v-model="modelo" placeholder="Modelo" required />
        <input v-model="ano" type="number" placeholder="Ano" required />
        <input v-model="carroceria" placeholder="Carroceria" required />
        <input v-model="combustivel" placeholder="Combustível" required />
        <input v-model="quilometragem" type="number" placeholder="Quilometragem" required />
        <input v-model="transmissao" placeholder="Transmissão" required />
        
        <label>Opcionais:</label>
        <div v-for="opcional in opcionaisDisponiveis" :key="opcional">
          <input type="checkbox" :value="opcional" v-model="opcionais" />
          {{ opcional }}
        </div>
  
        <label>Fotos:</label>
        <input type="file" multiple @change="handleFileUpload" accept="image/*" />
  
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        marca: '',
        modelo: '',
        ano: '',
        carroceria: '',
        combustivel: '',
        quilometragem: '',
        transmissao: '',
        opcionais: [],
        fotos: [],
        opcionaisDisponiveis: [
          'Banco de couro',
          'Volante com regulagem',
          'Teto solar',
          'Câmera de ré',
        ],
      };
    },
    methods: {
      handleFileUpload(event) {
        this.fotos = event.target.files;
      },
      async addVehicle() {
        const formData = new FormData();
        formData.append('marca', this.marca);
        formData.append('modelo', this.modelo);
        formData.append('ano', this.ano);
        formData.append('carroceria', this.carroceria);
        formData.append('combustivel', this.combustivel);
        formData.append('quilometragem', this.quilometragem);
        formData.append('transmissao', this.transmissao);
        formData.append('opcionais', this.opcionais.join(','));
  
        Array.from(this.fotos).forEach(file => {
          formData.append('fotos', file);
        });
  
        try {
          await axios.post('http://localhost:5000/api/vehicles/add', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('Vehicle added successfully!');
          this.resetForm();
        } catch (err) {
          alert('Error adding vehicle.');
        }
      },
      resetForm() {
        this.marca = '';
        this.modelo = '';
        this.ano = '';
        this.carroceria = '';
        this.combustivel = '';
        this.quilometragem = '';
        this.transmissao = '';
        this.opcionais = [];
        this.fotos = [];
      },
    },
  };
  </script>
  