// Homepage Footer HTML content (without multilingual marquee)
const homepageFooterHTML = `
<!-- ====== FOOTER CONTENT ====== -->
<section class="footer-content-section">
  <div class="footer-content-wrapper">
    <div class="footer-column">
      <h3>Nomad Type</h3>
      <p>Nomad Type is an independent type foundry exploring multilingual design across Hebrew, Arabic, and Latin scripts. We create typefaces that balance cultural authenticity with contemporary use, bridging writing systems through research and craft.</p>
    </div>
    <div class="footer-column">
      <h3>Licensing</h3>
      <p>Licensing should be straightforward. Download a free trial to test our fonts, and when it's time to publish, choose the license that fits your needs — desktop, web, or app. From students to studios, we keep it clear and fair so you can focus on your work.</p>
    </div>
    <div class="footer-column">
      <h3>Collaborations</h3>
      <p>We're always open to conversations with fellow type designers — whether it's about multilingual design, sharing questions, or exploring collaboration. Feel free to reach out at nir@yennok.com.</p>
    </div>
  </div>
</section>

<!-- ====== FOOTER NAVIGATION ====== -->
<nav class="footer-nav">
  <div class="footer-nav-wrapper">
    <a href="#" class="footer-nav-link">Typefaces</a>
    <a href="#" class="footer-nav-link">FAQ</a>
    <a href="#" class="footer-nav-link">Licensing</a>
    <a href="#" class="footer-nav-link">Journal</a>
    <a href="#" class="footer-nav-link">About</a>
    <a href="#" class="footer-nav-link">Trial Fonts</a>
    <a href="https://www.linkedin.com/in/yennok/" target="_blank" class="footer-linkedin-btn">Linkedin</a>
  </div>
</nav>

<!-- ====== FOOTER ====== -->
<footer class="footer">
  <div class="footer-content">
    <div class="footer-left">
      © Nomad Type. All Rights Reserved 2025
    </div>
    <div class="footer-right">
      Typefaces in Use: <span class="font-name">Nomad Type</span> Sans/Mono
    </div>
  </div>
</footer>
`;

// Load homepage footer component (no multilingual marquee)
function loadHomepageFooter() {
  const footerContainer = document.getElementById('footer-container');
  
  if (footerContainer) {
    footerContainer.innerHTML = homepageFooterHTML;
    
    // Add homepage-specific class for negative margins
    footerContainer.classList.add('homepage-footer');
  }
}
