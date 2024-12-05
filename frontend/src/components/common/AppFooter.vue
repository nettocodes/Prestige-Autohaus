<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Subscribe Section -->
      <div class="footer-subscribe">
        <h3>Join BoxCar</h3>
        <p>Receive pricing updates, shopping tips & more!</p>
        <div class="footer-subscribe-form">
          <input type="email" placeholder="Your email address" />
          <button>Sign Up</button>
        </div>
      </div>

      <!-- Links Section -->
      <div class="footer-links">
        <div class="footer-column">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#">Get in Touch</a></li>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Live Chat</a></li>
            <li><a href="#">How it Works</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Our Brands</h4>
          <ul>
            <li><a href="#">Toyota</a></li>
            <li><a href="#">Porsche</a></li>
            <li><a href="#">Audi</a></li>
            <li><a href="#">BMW</a></li>
            <li><a href="#">Ford</a></li>
            <li><a href="#">Nissan</a></li>
          </ul>
        </div>
        <div class="footer-column">
          <h4>Vehicle Types</h4>
          <ul>
            <li><a href="#">SUV</a></li>
            <li><a href="#">Sedan</a></li>
            <li><a href="#">Truck</a></li>
            <li><a href="#">Electric</a></li>
            <li><a href="#">Hybrid</a></li>
            <li><a href="#">Coupe</a></li>
          </ul>
        </div>
        <div class="footer-column footer-social">
          <h4>Connect With Us</h4>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <p>&copy; 2024 example.com. All rights reserved.</p>
      <ul>
        <li><a href="#">Terms & Conditions</a></li>
        <li><a href="#">Privacy Notice</a></li>
      </ul>
    </div>
  </footer>

</template>

<script>
import "@/assets/AppFooter.css";

export default {
  name: "AppFooter",
};
</script>
