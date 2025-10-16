// Header HTML content as a string
const headerHTML = `
<!-- ====== STICKY TOP SECTION ====== -->
<div class="sticky-top-section">
  <div class="svg-shape left"></div>
  <div class="svg-shape center"></div>
  <div class="svg-shape right"></div>
</div>

<!-- ====== STICKY GREEN LINE ====== -->
<div class="sticky-green-line"></div>

<!-- ====== STICKY GREEN CIRCLE ====== -->
<div class="sticky-green-circle">
  <div class="circle-marquee">
    <div class="circle-marquee-content">Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type Nomad Type  </div>
  </div>
  <div class="menu-background">
    <div class="menu-items">
      <a href="index.html" class="menu-item">Typefaces</a>
      <a href="journal.html" class="menu-item">Journal</a>
      <a href="about.html" class="menu-item">About</a>
    </div>
  </div>
  <div class="circle-hamburger"></div>
</div>

<!-- ====== STICKY NAVIGATION MENU ====== -->
<nav class="sticky-nav">
  <div class="nav-brand"><a href="index.html">Nomad Type</a></div>
  <div class="nav-links">
    <a href="index.html" class="nav-link">Typefaces</a>
    <a href="journal.html" class="nav-link">Journal</a>
    <a href="about.html" class="nav-link">About</a>
  </div>
</nav>

<!-- ====== MOBILE HAMBURGER CIRCLE ====== -->
<div class="mobile-hamburger-circle" id="mobileHamburgerCircle"></div>

<!-- ====== MOBILE OVERLAY MENU ====== -->
<div class="mobile-overlay" id="mobileOverlay">
  <div class="mobile-overlay-content">
    <div class="mobile-menu-header">
      <h2><a href="index.html">Nomad Type</a></h2>
      <button class="close-btn" id="closeMobileMenu"></button>
    </div>
    <nav class="mobile-menu-nav">
      <a href="index.html" class="mobile-menu-link">Typefaces</a>
      <a href="licensing.html" class="mobile-menu-link">Licensing</a>
      <a href="about.html" class="mobile-menu-link">About</a>
      <a href="journal.html" class="mobile-menu-link">Journal</a>
      <a href="trial-fonts.html" class="mobile-menu-link">Trial Fonts</a>
      <a href="faq.html" class="mobile-menu-link">FAQ</a>
    </nav>
    <div class="mobile-menu-footer">
      <p>© Nomad Type. All Rights Reserved 2025</p>
    </div>
  </div>
</div>

<!-- ====== COVER HEADER ====== -->
<header class="cover-header">
  <div class="parallax-content">
    <div class="cover-title" id="coverTitleContainer">
      <!-- Title will be inserted here dynamically -->
    </div>
  </div>
</header>

<!-- ====== STICKY BUTTONS ====== -->
<div class="cover-buttons">
  <button class="btn btn-primary" id="trialBtn">Download Trial</button>
  <button class="btn btn-secondary" id="buyBtn">Buy Now</button>
</div>
`;

// Load header component
function loadHeader(titleHTML = '') {
  const headerContainer = document.getElementById('header-container');
  
  if (headerContainer) {
    headerContainer.innerHTML = headerHTML;
    
    // Set the cover title with pure HTML
    const coverTitleContainer = document.getElementById('coverTitleContainer');
    if (coverTitleContainer && titleHTML) {
      coverTitleContainer.innerHTML = titleHTML;
    }
  }
}

