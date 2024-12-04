<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-section">
        <h4>Sobre Nós</h4>
        <p>
          O Vehicle Management System é uma plataforma completa para gerenciar veículos, com recursos modernos e eficientes.
        </p>
      </div>
      <div class="footer-section">
        <h4>Navegação</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/add">Adicionar Veículo</router-link></li>
          <li><router-link to="/view">Visualizar Veículos</router-link></li>
          <li><router-link to="/favorites">Favoritos</router-link></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Contato</h4>
        <p>Email: suporte@vehiclemanagement.com</p>
        <p>Telefone: (11) 99999-9999</p>
        <p>Endereço: Rua dos Veículos, 123 - São Paulo, SP</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Vehicle Management System. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<script>
import "@/assets/AppFooter.css";

export default {
  name: "AppFooter",
};
</script>
