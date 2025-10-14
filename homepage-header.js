// Homepage Header HTML content (without cover header and sticky top section)
const homepageHeaderHTML = `
<!-- ====== STICKY GREEN LINE ====== -->
<div class="sticky-green-line"></div>

<!-- ====== STICKY GREEN CIRCLE ====== -->
<div class="sticky-green-circle">
  <div class="circle-marquee">
    <div class="circle-marquee-content">Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type  </div>
  </div>
  <div class="menu-background">
    <div class="menu-items">
      <a href="#fonts" class="menu-item">Typefaces</a>
      <a href="#journal" class="menu-item">Journal</a>
      <a href="#about" class="menu-item">About</a>
    </div>
  </div>
  <div class="circle-hamburger"></div>
</div>

<!-- ====== STICKY NAVIGATION MENU ====== -->
<nav class="sticky-nav">
  <div class="nav-brand">Nomad Type</div>
  <div class="nav-links">
    <a href="#fonts" class="nav-link">Typefaces</a>
    <a href="#journal" class="nav-link">Journal</a>
    <a href="#about" class="nav-link">About</a>
  </div>
</nav>

<!-- ====== MOBILE HAMBURGER CIRCLE ====== -->
<div class="mobile-hamburger-circle" id="mobileHamburgerCircle"></div>

<!-- ====== MOBILE OVERLAY MENU ====== -->
<div class="mobile-overlay" id="mobileOverlay">
  <div class="mobile-overlay-content">
    <div class="mobile-menu-header">
      <h2>Nomad Type</h2>
      <button class="close-btn" id="closeMobileMenu"></button>
    </div>
    <nav class="mobile-menu-nav">
      <a href="#fonts" class="mobile-menu-link">Typefaces</a>
      <a href="#" class="mobile-menu-link">Licensing</a>
      <a href="#about" class="mobile-menu-link">About</a>
      <a href="#journal" class="mobile-menu-link">Journal</a>
      <a href="#" class="mobile-menu-link">Trial Fonts</a>
      <a href="#" class="mobile-menu-link">FAQ</a>
    </nav>
    <div class="mobile-menu-footer">
      <p>© Nomad Type. All Rights Reserved 2025</p>
    </div>
  </div>
</div>
`;

// Load homepage header component (no cover header)
function loadHomepageHeader() {
  const headerContainer = document.getElementById('header-container');
  
  if (headerContainer) {
    headerContainer.innerHTML = homepageHeaderHTML;
  }
}
