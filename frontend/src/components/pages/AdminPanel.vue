<template>
    <div id="dashboard">
      <!-- Botão para abrir/fechar o menu em telas pequenas -->
      <button 
        class="toggle-sidebar-btn" 
        @click="toggleSidebar" 
        v-if="isSmallScreen">
        {{ showSidebar ? 'Fechar Menu' : 'Abrir Menu' }}
      </button>
  
      <!-- Sidebar -->
      <aside
        class="sidebar-container"
        :class="{ open: showSidebar }">
        <ul class="sidebar-menu">
          <li 
            v-for="item in menuItems" 
            :key="item.panel" 
            @click="setActivePanel(item.panel)"
            :class="{ active: activePanel === item.panel }">
            {{ item.label }}
          </li>
        </ul>
      </aside>
  
      <!-- Conteúdo principal -->
      <main class="dashboard-content">
        <component :is="activePanel" />
      </main>
    </div>
  </template>
  
  <script>
  import AddVehicle from './AddVehicle.vue';
  import ListVehicles from './ListVehicles.vue';
  
  export default {
    name: 'VehicleDashboard',
    components: {
      AddVehicle,
      ListVehicles,
    },
    data() {
      return {
        activePanel: 'AddVehicle',
        isSmallScreen: window.innerWidth <= 768,
        showSidebar: !window.innerWidth <= 768, // Mostra a sidebar em telas maiores
        menuItems: [
          { label: 'Adicionar Veículos', panel: 'AddVehicle' },
          { label: 'Listar e Editar Veículos', panel: 'ListVehicles' },
        ],
      };
    },
    methods: {
      setActivePanel(panel) {
        this.activePanel = panel;
        if (this.isSmallScreen) this.showSidebar = false; // Fecha o menu ao clicar
      },
      toggleSidebar() {
        this.showSidebar = !this.showSidebar;
      },
      handleResize() {
        this.isSmallScreen = window.innerWidth <= 768;
        if (!this.isSmallScreen) {
          this.showSidebar = true; // Abre o menu em telas grandes
        } else {
          this.showSidebar = false; // Fecha o menu em telas pequenas
        }
      },
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.handleResize);
    },
  };
  </script>
  
  <style scoped>
  #dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar-container {
    position: fixed;
    top: 15vh;
    bottom: 0;
    left: 0;
    width: 250px;
    background-color: var(--background-dark);
    color: var(--text-primary);
    box-shadow: 2px 0 5px var(--shadow-dark);
    z-index: 1000;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
  }
  
  .sidebar-container.open {
    transform: translateX(0);
  }
  
  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .sidebar-menu li {
    padding: 15px 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 1rem;
  }
  
  .sidebar-menu li:hover,
  .sidebar-menu li.active {
    background-color: var(--primary-color);
    color: var(--text-primary);
  }
  
  /* Toggle button for small screens */
  .toggle-sidebar-btn {
    position: fixed;
    top: 50%;
    right: -2rem;
    transform: rotate(-90deg);
    z-index: 10;
    padding: 0.5rem 1rem;
    background-color: var(--primary-color);
    color: var(--text-primary);
    border: none;
    border-radius: 5px 0 0 5px;
    cursor: pointer;
    box-shadow: 0 2px 5px var(--shadow-dark);
  }
  
  .toggle-sidebar-btn:hover {
    background-color: var(--text-contrast);
  }
  
  /* Content */
  .dashboard-content {
    flex: 1;
    margin-left: 250px;
    padding: 20px;
    overflow-y: auto;
    background-color: var(--background-light);
    transition: margin-left 0.3s ease-in-out;
  }
  
  @media (max-width: 768px) {
    .dashboard-content {
      margin-left: 0;
    }
  
    .sidebar-container {
      width: 70%;
      max-width: 300px;
    }
  }
  </style>
  