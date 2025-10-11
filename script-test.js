

    function updateFontTargets(targets, family, weight) {
      targets.forEach(el => { el.style.fontFamily = family; el.style.fontWeight = String(weight); });
    }

    function initTypingControls() {
      const fontMap = JSON.parse(document.getElementById('fontMap').textContent);
      document.querySelectorAll('.type-tester').forEach(section => {
        const textArea = section.querySelector('.type-area');
        const size = section.querySelector('.size');
        const leading = section.querySelector('.leading');
        const spacing = section.querySelector('.spacing');
        const select = section.querySelector('.font-select');
        const alignWrap = section.querySelector('.align-buttons');

        if (!textArea) return;

        // Init from computed styles
        const cs = getComputedStyle(textArea);
        size.value = parseFloat(cs.fontSize) || 40;
        leading.value = (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 1.2).toFixed(2);
        const ls = parseFloat(cs.letterSpacing);
        spacing.value = isNaN(ls) ? 0 : (ls / parseFloat(cs.fontSize)).toFixed(2);

        // Sliders
        size.addEventListener('input', () => { textArea.style.fontSize = size.value + 'px'; });
        leading.addEventListener('input', () => { textArea.style.lineHeight = leading.value; });
        spacing.addEventListener('input', () => { textArea.style.letterSpacing = spacing.value + 'em'; });

        // Font selector, apply both family and weight
        const applySelect = () => {
          const cfg = fontMap[select.value] || { family: 'sans-serif', weight: 400 };
          textArea.style.fontFamily = cfg.family;
          textArea.style.fontWeight = String(cfg.weight);
        };
        select.addEventListener('change', applySelect);
        applySelect();

        // Align buttons, delegation
        if (alignWrap) {
          alignWrap.addEventListener('click', e => {
            const btn = e.target.closest('.icon-btn');
            if (!btn) return;
            textArea.style.textAlign = btn.dataset.align || 'left';
            alignWrap.querySelectorAll('.icon-btn').forEach(b => b.classList.toggle('is-active', b === btn));
          });
        }

        // Direction auto detect on input
        const rtlRegex = /[\u0590-\u08FF]/; // Hebrew and Arabic ranges
        const updateDir = () => {
          const t = textArea.innerText.trim();
          const first = t.charAt(0);
          const dir = rtlRegex.test(first) ? 'rtl' : 'ltr';
          textArea.setAttribute('dir', dir);
        };
        textArea.addEventListener('input', updateDir);
        updateDir();
      });
    }

    function initGlyphGrid() {
      const grid = document.getElementById('grid');
      const preview = document.getElementById('preview');
      const details = document.getElementById('details');
      const weightSel = document.getElementById('weight');
      const fontMap = JSON.parse(document.getElementById('fontMap').textContent);
      const glyphMap = JSON.parse(document.getElementById('glyphMap').textContent);

      const key = 'Safra2';
      const chars = [...(glyphMap[key] || glyphMap.default || '')];
      grid.innerHTML = '';

      chars.forEach(ch => {
        const cell = document.createElement('div');
        cell.className = 'char-cell';
        cell.setAttribute('data-char', ch);
        cell.addEventListener('mouseover', () => {
          if (preview) preview.setAttribute('data-preview', ch);
          if (details) {
            const code = ch.codePointAt(0);
            details.innerHTML = `Unicode decimal: ${code}<br>Unicode hex: ${code.toString(16).toUpperCase().padStart(4,'0')}<br>HTML entity: &#x${code.toString(16).toUpperCase()};`;
          }
        });
        grid.appendChild(cell);
      });

      const apply = () => {
        const cfg = fontMap[weightSel.value] || { family: 'sans-serif', weight: 400 };
        updateFontTargets(document.querySelectorAll('.char-cell'), cfg.family, cfg.weight);
        if (preview) { preview.style.fontFamily = cfg.family; preview.style.fontWeight = String(cfg.weight); }
      };
      
      // Expose changeWeight function globally for custom dropdown
      window.changeWeight = (value) => {
        weightSel.value = value;
        apply();
      };
      
      weightSel.addEventListener('change', apply);
      apply();
    }

    function adjustPreviewHeight() {
  const sampleCell = document.querySelector('.char-cell');
  const preview = document.getElementById('preview');
  const leftPanel = document.querySelector('.left-panel');
  if (!sampleCell || !preview || !leftPanel) return;

  const cellHeight = sampleCell.offsetHeight;
  const width = window.innerWidth;
  let cellCount, panelWidth;

  if (width <= 600) {
    cellCount = 6;
    preview.style.width = '100%';
    leftPanel.style.width = '100%';
    const previewWidth = leftPanel.offsetWidth;
    const cellSize = previewWidth / cellCount;
    preview.style.height = `${cellSize * cellCount}px`;
  } else {
    cellCount = width <= 984 ? 3 : width <= 1305 ? 4 : 5;
    panelWidth = cellHeight * cellCount;
    preview.style.width = `${panelWidth}px`;
    preview.style.height = `${cellHeight * cellCount}px`;
    leftPanel.style.width = `${panelWidth}px`;
  }
}

function initParallax() {
  const arabicText = document.querySelector('.cover-title .arabic');
  const latinText = document.querySelector('.cover-title .latin');
  const hebrewText = document.querySelector('.cover-title .hebrew');
  const secondaryBtn = document.querySelector('.btn-secondary');
  const coverHeader = document.querySelector('.cover-header');
  const buttons = document.querySelector('.cover-buttons');
  const stickyTopSection = document.querySelector('.sticky-top-section');
  const stickyGreenLine = document.querySelector('.sticky-green-line');
  const stickyGreenCircle = document.querySelector('.sticky-green-circle');
  const stickyNav = document.querySelector('.sticky-nav');
  
  if (!arabicText || !latinText || !hebrewText || !secondaryBtn || !coverHeader || !buttons) return;

  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    // Different parallax rates for each line - more prominent effect
    const arabicRate = scrolled * -0.6;
    const latinRate = scrolled * -0.4;
    const hebrewRate = scrolled * -0.2;
    
    // Each text line moves at different speeds for dynamic effect
    arabicText.style.transform = `translateY(${arabicRate}px)`;
    latinText.style.transform = `translateY(${latinRate}px)`;
    hebrewText.style.transform = `translateY(${hebrewRate}px)`;
    
    // Add white background to secondary button when scrolled past cover
    const coverBottom = coverHeader.offsetTop + coverHeader.offsetHeight;
    if (scrolled > coverBottom) {
      secondaryBtn.classList.add('scrolled');
    } else {
      secondaryBtn.classList.remove('scrolled');
    }
    
    // Mobile: Fade out sticky buttons before scroll-buttons-section appears
    if (window.innerWidth <= 768) {
      const scrollButtonsSection = document.querySelector('.scroll-buttons-section');
      if (scrollButtonsSection) {
        const sectionTop = scrollButtonsSection.offsetTop;
        const scrollThreshold = sectionTop - 700; // Start fading 1000px before scroll-buttons-section appears
        
        // Debug logging
        // console.log('Mobile buttons debug:', {
        //   scrolled: scrolled,
        //   sectionTop: sectionTop,
        //   scrollThreshold: scrollThreshold,
        //   shouldFadeOut: scrolled >= scrollThreshold,
        //   buttonsOpacity: buttons.style.opacity
        // });
        
        if (scrolled >= scrollThreshold) {
          buttons.style.opacity = '0';
          buttons.style.pointerEvents = 'none';
        } else {
          buttons.style.opacity = '1';
          buttons.style.pointerEvents = 'auto';
        }
      }
    }
    
    // Simple sticky behavior: when buttons reach 29px from top, make them sticky
    const buttonsRect = buttons.getBoundingClientRect();
    const headerRect = coverHeader.getBoundingClientRect();
    
    // Check if header is visible (gray area appears)
    const headerIsVisible = headerRect.bottom > 0; // Any part of header is visible
    
    // Hide sticky top section and show green line when header top reaches -(headerHeight - 30px)
    // Remove green line when header top reaches -(headerHeight)
    // Add opacity transition to sticky-nav and show green circle
    if (stickyTopSection && stickyGreenLine && stickyGreenCircle && stickyNav) {
      const disappearThreshold = -(headerRect.height - 30);
      const greenLineRemoveThreshold = -(headerRect.height);
      
      // Check for nav animation trigger (this runs regardless of header position)
      const shouldTrigger = headerRect.top >= (disappearThreshold + 40);
      if (!shouldTrigger) {
        // Force the transition to start by setting opacity to 0
        stickyNav.style.transition = 'opacity 0.5s ease';
        stickyNav.style.opacity = '0';
      }

      if (headerRect.top <= greenLineRemoveThreshold) {
        // Both sections hidden when header goes beyond full height
        stickyTopSection.style.display = 'none';
        stickyGreenLine.style.display = 'none';
        stickyGreenCircle.style.transition = 'opacity 0.5s ease';
        stickyGreenCircle.style.opacity = '1'; // Circle fully visible (replaces nav)
        stickyNav.style.opacity = '0';
        
        // Mobile: Add solid background to hamburger circle when left circle is fully visible
        if (window.innerWidth <= 768) {
          const mobileHamburgerCircle = document.getElementById('mobileHamburgerCircle');
          if (mobileHamburgerCircle) {
            mobileHamburgerCircle.classList.add('solid');
          }
        }
      } else if (headerRect.top <= disappearThreshold) {
        // Show green line and transition nav to circle when header reaches disappear threshold
        stickyTopSection.style.display = 'none';
        stickyGreenLine.style.display = 'block';
        // Calculate progress for opacity transitions
        const progress = (headerRect.top - greenLineRemoveThreshold) / (disappearThreshold - greenLineRemoveThreshold);
        
        // Only set normal opacity if shouldTrigger is true
        if (shouldTrigger) {
          stickyNav.style.transition = 'opacity 0.5s ease';
          stickyNav.style.opacity = Math.max(0, Math.min(1, progress));
        }
        
        // Green circle appears when nav disappears (independent of scroll progress)
        stickyGreenCircle.style.transition = 'opacity 0.5s ease';
        if (!shouldTrigger) {
          stickyGreenCircle.style.opacity = '1'; // Circle visible when nav is gone
          
          // Mobile: Add solid background to hamburger circle when left circle appears
          if (window.innerWidth <= 768) {
            const mobileHamburgerCircle = document.getElementById('mobileHamburgerCircle');
            if (mobileHamburgerCircle) {
              mobileHamburgerCircle.classList.add('solid');
            }
          }
        } else {
          stickyGreenCircle.style.opacity = '0'; // Circle hidden when nav is visible
          
          // Mobile: Remove solid background when left circle is hidden
          if (window.innerWidth <= 768) {
            const mobileHamburgerCircle = document.getElementById('mobileHamburgerCircle');
            if (mobileHamburgerCircle) {
              mobileHamburgerCircle.classList.remove('solid');
            }
          }
        }
      } else {
        // Show blue shapes when header is above disappear threshold
        stickyTopSection.style.display = 'block';
        stickyGreenLine.style.display = 'none';
        stickyGreenCircle.style.transition = 'opacity 0.5s ease';
        stickyGreenCircle.style.opacity = '0'; // Circle hidden
        if (shouldTrigger) {
          stickyNav.style.transition = 'opacity 0.5s ease';
          stickyNav.style.opacity = '1';
        }
        
        // Mobile: Remove solid background when scrolled back to top
        if (window.innerWidth <= 768) {
          const mobileHamburgerCircle = document.getElementById('mobileHamburgerCircle');
          if (mobileHamburgerCircle) {
            mobileHamburgerCircle.classList.remove('solid');
          }
        }
      }
    }
    
    // Debug logging
    const disappearThreshold = -(headerRect.height - 30);
    const greenLineRemoveThreshold = -(headerRect.height);
    const shouldTrigger = headerRect.top >= (disappearThreshold + 40);
    // console.log('Header debug:', {
    //   headerTop: headerRect.top,
    //   headerHeight: headerRect.height,
    //   disappearThreshold: disappearThreshold,
    //   triggerPoint: disappearThreshold + 40,
    //   shouldTrigger: shouldTrigger
    // });
    
    if (buttonsRect.top <= 29 && !headerIsVisible) {
      // Buttons reached 29px from top AND header is not visible, make them sticky
      buttons.classList.add('sticky');
      // Align navigation with sticky buttons
      document.querySelector('.sticky-nav').style.top = '32px';
    } else {
      // Buttons are above 29px OR header is visible, remove sticky
      buttons.classList.remove('sticky');
      // Reset navigation to original position
      document.querySelector('.sticky-nav').style.top = '50px';
    }
    
    // Add Y transition when nav is about to disappear
    if (!shouldTrigger) {
      document.querySelector('.sticky-nav').style.transition = 'opacity 0.5s ease, top 0.3s ease';
      document.querySelector('.sticky-nav').style.top = '32px'; // Move up when disappearing
    } else {
      document.querySelector('.sticky-nav').style.transition = 'opacity 0.5s ease, top 0.3s ease';
    }
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function handleScroll() {
    ticking = false;
    requestTick();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Initial call
  updateParallax();
}

// ====== AUTO-FIT SYSTEM ======
// Reusable auto-fit functionality for any section

class AutoFitManager {
  constructor() {
    this.sections = new Map();
    this.resizeTimeout = null;
    this.initGlobalListeners();
  }

  // Initialize a section with auto-fit
  initSection(sectionElement, options = {}) {
    const config = {
      minFontSize: 40,
      maxFontSize: 512,
      baseFontSize: 244,
      baseWidth: 1920,
      autoFitOnResize: true,
      autoFitOnFontChange: true,
      disableOnUserInput: true,
      ...options
    };

    const textArea = sectionElement.querySelector('.type-area');
    const sizeSlider = sectionElement.querySelector('.size');
    const fontSelect = sectionElement.querySelector('.font-select');

    if (!textArea || !sizeSlider) {
      console.warn('Auto-fit: Missing required elements (textArea or sizeSlider)');
      return;
    }

    const sectionData = {
      element: sectionElement,
      textArea,
      sizeSlider,
      fontSelect,
      config,
      originalText: textArea.textContent || textArea.innerText,
      autoFitEnabled: true,
      userHasTyped: false,
      sliderBeingSetProgrammatically: false
    };

    this.sections.set(sectionElement, sectionData);
    this.setupSectionListeners(sectionData);
    this.updateSectionSize(sectionData);

    // console.log('Auto-fit initialized for section:', sectionElement.className);
  }

  // Calculate optimal font size to fit text in one line
  calculateFittingSize(sectionData) {
    const { textArea, config } = sectionData;
    
    console.log('calculateFittingSize called for:', textArea?.textContent, 'in section:', sectionData.element);
    
    // Get the actual available width for the text - more accurate calculation
    const containerWidth = textArea.offsetWidth;
    const computedStyle = getComputedStyle(textArea);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    
    // Use almost all available width - very minimal buffer for maximum utilization
    const text = textArea.textContent || textArea.innerText;
    const screenWidth = window.innerWidth;
    
    // Smart buffer based on text length and screen size
    let buffer;
    if (screenWidth <= 768) {
      // Mobile: very aggressive for short text, more conservative for long text
      if (text.length <= 5) {
        buffer = 2; // Short text like "Hello" - use almost all space
      } else if (text.length <= 10) {
        buffer = 8; // Medium text - moderate buffer
      } else {
        buffer = 15; // Long text like "שלום مرحبا Hello" - more conservative
      }
    } else if (screenWidth <= 1024) {
      // Tablet: moderate buffer
      buffer = text.length < 8 ? 8 : 5;
    } else {
      // Desktop: slightly more conservative
      buffer = text.length < 10 ? 12 : 6;
    }
    
    // Safari-specific adjustments - Safari renders text wider than Chrome
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      // Add extra buffer for Safari to prevent overflow
      buffer += text.length > 10 ? 20 : 10; // More buffer for longer text in Safari
    }
    
    const availableWidth = containerWidth - paddingLeft - paddingRight - buffer;

    console.log('Width calculation:', {
      containerWidth,
      paddingLeft,
      paddingRight,
      buffer,
      availableWidth,
      textLength: text.length,
      screenWidth: screenWidth,
      deviceType: screenWidth <= 768 ? 'mobile' : screenWidth <= 1024 ? 'tablet' : 'desktop',
      isSafari: isSafari,
      browser: navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'
    });

    if (!text || !availableWidth) return config.baseFontSize;

    // Create measurement element - Safari-compatible
    const tempElement = document.createElement('span');
    tempElement.style.cssText = `
      position: absolute;
      visibility: hidden;
      white-space: nowrap;
      font-family: ${computedStyle.fontFamily};
      font-weight: ${computedStyle.fontWeight};
      letter-spacing: ${computedStyle.letterSpacing};
      font-size: 100px;
      line-height: ${computedStyle.lineHeight};
      font-kerning: ${computedStyle.fontKerning};
      font-variant-ligatures: ${computedStyle.fontVariantLigatures};
      text-rendering: ${computedStyle.textRendering};
      -webkit-font-smoothing: ${computedStyle.webkitFontSmoothing};
      -webkit-text-stroke: ${computedStyle.webkitTextStroke};
    `;
    tempElement.textContent = text;
    document.body.appendChild(tempElement);

    // Calculate ratio and fitting size
    const textWidthAt100px = tempElement.offsetWidth;
    const ratio = textWidthAt100px / 100;
    const fittingSize = Math.floor(availableWidth / ratio);
    const clampedSize = Math.max(config.minFontSize, Math.min(config.maxFontSize, fittingSize));

    // Binary search for precision - very aggressive range for better fitting
    const searchRange = screenWidth <= 768 ? 100 : 50; // Larger search range on mobile
    let minSize = Math.max(config.minFontSize, clampedSize - searchRange);
    let maxSize = Math.min(config.maxFontSize, clampedSize + searchRange);
    let bestSize = clampedSize;

    for (let i = 0; i < 20; i++) { // More iterations for better precision
      if (maxSize - minSize <= 1) break;

      const testSize = Math.floor((minSize + maxSize) / 2);
      tempElement.style.fontSize = testSize + 'px';

      if (tempElement.offsetWidth <= availableWidth) {
        bestSize = testSize;
        minSize = testSize;
      } else {
        maxSize = testSize;
      }
    }
    
    // Final check: try one size larger to see if we can squeeze it in
    if (bestSize < config.maxFontSize) {
      tempElement.style.fontSize = (bestSize + 1) + 'px';
      if (tempElement.offsetWidth <= availableWidth) {
        bestSize = bestSize + 1;
      }
    }

    document.body.removeChild(tempElement);
    
    console.log('Font size calculation result:', {
      text: text,
      availableWidth: availableWidth,
      fittingSize: fittingSize,
      clampedSize: clampedSize,
      bestSize: bestSize,
      maxFontSize: config.maxFontSize
    });
    
    return bestSize;
  }

  // Calculate responsive font size based on viewport width
  calculateResponsiveSize(sectionData) {
    const { config } = sectionData;
    const currentWidth = window.innerWidth;
    const scaleFactor = Math.max(0.2, Math.min(1.0, currentWidth / config.baseWidth));
    return Math.max(config.minFontSize, Math.round(config.baseFontSize * scaleFactor));
  }

  // Update section font size and slider
  updateSectionSize(sectionData, useFitting = true) {
    const { textArea, sizeSlider, config, autoFitEnabled, userHasTyped } = sectionData;

    if (!autoFitEnabled || userHasTyped) return;

    const newSize = useFitting ? 
      this.calculateFittingSize(sectionData) : 
      this.calculateResponsiveSize(sectionData);

    textArea.style.fontSize = newSize + 'px';
    
    // Update slider without triggering manual mode
    sectionData.sliderBeingSetProgrammatically = true;
    sizeSlider.value = newSize;
    sectionData.sliderBeingSetProgrammatically = false;
  }

  // Setup event listeners for a section
  setupSectionListeners(sectionData) {
    const { textArea, sizeSlider, fontSelect, config, element } = sectionData;

    // Text input detection
    if (config.disableOnUserInput) {
      textArea.addEventListener('input', () => this.checkTextChange(sectionData));
      textArea.addEventListener('paste', () => {
        setTimeout(() => this.checkTextChange(sectionData), 10);
      });
    }

    // Size slider - DISABLE auto-fit and single line when user adjusts
    sizeSlider.addEventListener('mousedown', () => {
      if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
        sectionData.autoFitEnabled = false;
        // Allow normal paragraph behavior (multi-line)
        textArea.style.whiteSpace = 'normal';
        console.log('Auto-fit disabled: User started adjusting size');
      }
      // Disable transition for immediate response
      textArea.style.transition = 'none';
    });
    sizeSlider.addEventListener('input', () => {
      if (!sectionData.sliderBeingSetProgrammatically) {
        if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
          sectionData.autoFitEnabled = false;
          // Allow normal paragraph behavior (multi-line)
          textArea.style.whiteSpace = 'normal';
          console.log('Auto-fit disabled: User adjusted size');
        }
        textArea.style.fontSize = sizeSlider.value + 'px';
      }
    });
    sizeSlider.addEventListener('mouseup', () => {
      // Re-enable transition after user stops dragging
      setTimeout(() => {
        textArea.style.transition = '';
      }, 100);
    });
    // Handle touch events for mobile
    sizeSlider.addEventListener('touchstart', () => {
      if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
        sectionData.autoFitEnabled = false;
        textArea.style.whiteSpace = 'normal';
        console.log('Auto-fit disabled: User started adjusting size (touch)');
      }
      textArea.style.transition = 'none';
    });
    sizeSlider.addEventListener('touchend', () => {
      setTimeout(() => {
        textArea.style.transition = '';
      }, 100);
    });

    // Line height slider - DISABLE auto-fit and single line when user adjusts
    const leadingSlider = element.querySelector('.leading');
    if (leadingSlider) {
      leadingSlider.addEventListener('mousedown', () => {
        if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
          sectionData.autoFitEnabled = false;
          // Allow normal paragraph behavior (multi-line)
          textArea.style.whiteSpace = 'normal';
          console.log('Auto-fit disabled: User started adjusting line height');
        }
      });
      leadingSlider.addEventListener('input', () => {
        if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
          sectionData.autoFitEnabled = false;
          // Allow normal paragraph behavior (multi-line)
          textArea.style.whiteSpace = 'normal';
          console.log('Auto-fit disabled: User adjusted line height');
        }
      });
    }

    // Letter spacing slider - DISABLE auto-fit and single line when user adjusts
    const spacingSlider = element.querySelector('.spacing');
    if (spacingSlider) {
      spacingSlider.addEventListener('mousedown', () => {
        if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
          sectionData.autoFitEnabled = false;
          // Allow normal paragraph behavior (multi-line)
          textArea.style.whiteSpace = 'normal';
          console.log('Auto-fit disabled: User started adjusting letter spacing');
        }
      });
      spacingSlider.addEventListener('input', () => {
        if (sectionData.autoFitEnabled && !sectionData.userHasTyped) {
          sectionData.autoFitEnabled = false;
          // Allow normal paragraph behavior (multi-line)
          textArea.style.whiteSpace = 'normal';
          console.log('Auto-fit disabled: User adjusted letter spacing');
        }
      });
    }

    // Font change detection - KEEP auto-fit enabled
    if (fontSelect && config.autoFitOnFontChange) {
      fontSelect.addEventListener('change', () => {
        setTimeout(() => this.updateSectionSize(sectionData), 10);
        setTimeout(() => this.updateSectionSize(sectionData), 100);
        setTimeout(() => this.updateSectionSize(sectionData), 300);
      });
    }

    // Alignment buttons - DON'T disable auto-fit, just update alignment
    const alignButtons = element.querySelectorAll('.align-left, .align-center, .align-right');
    alignButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update alignment without disabling auto-fit
        const alignment = button.dataset.align;
        textArea.style.textAlign = alignment;
        
        // Update active state
        alignButtons.forEach(btn => btn.classList.remove('is-active'));
        button.classList.add('is-active');
        
        // Recalculate size after alignment change
        setTimeout(() => this.updateSectionSize(sectionData), 10);
      });
    });

    // Style change detection
    const observer = new MutationObserver(() => {
      setTimeout(() => this.updateSectionSize(sectionData), 50);
    });

    observer.observe(textArea, {
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  // Check if text has changed from original
  checkTextChange(sectionData) {
    const { textArea, originalText } = sectionData;
    const currentText = textArea.textContent || textArea.innerText;
    const hasChanged = currentText !== originalText;

    if (hasChanged && !sectionData.userHasTyped) {
      sectionData.userHasTyped = true;
      sectionData.autoFitEnabled = false;
      // Allow normal paragraph behavior (multi-line)
      textArea.style.whiteSpace = 'normal';
      console.log('Auto-fit disabled: User typed new text');
    } else if (!hasChanged && sectionData.userHasTyped) {
      sectionData.userHasTyped = false;
      sectionData.autoFitEnabled = true;
      // Restore single line behavior when auto-fit is re-enabled
      textArea.style.whiteSpace = 'nowrap';
      console.log('Auto-fit re-enabled: Text restored to original');
    }
  }

  // Global resize handler
  initGlobalListeners() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => {
        // Update max font size for all sections based on new screen width and text length
        const screenWidth = window.innerWidth;
        
        this.sections.forEach((sectionData) => {
          const text = sectionData.textArea.textContent || sectionData.textArea.innerText;
          let responsiveMaxFontSize;
          
          if (screenWidth <= 768) {
            // Mobile: adjust based on text length
            if (text.length <= 5) {
              // Short text like "Hello" - allow very large fonts
              responsiveMaxFontSize = Math.min(400, Math.max(150, Math.floor(screenWidth * 0.35)));
            } else if (text.length <= 10) {
              // Medium text - moderate max size
              responsiveMaxFontSize = Math.min(300, Math.max(120, Math.floor(screenWidth * 0.28)));
            } else {
              // Long text like "שלום مرحبا Hello" - more conservative
              responsiveMaxFontSize = Math.min(200, Math.max(80, Math.floor(screenWidth * 0.20)));
            }
          } else if (screenWidth <= 1024) {
            // Tablet: 30% of screen width
            responsiveMaxFontSize = Math.min(450, Math.max(120, Math.floor(screenWidth * 0.30)));
          } else {
            // Desktop: 25% of screen width
            responsiveMaxFontSize = Math.min(512, Math.max(100, Math.floor(screenWidth * 0.25)));
          }
          
          // Update the config with new max font size
          sectionData.config.maxFontSize = responsiveMaxFontSize;
          
          if (sectionData.config.autoFitOnResize) {
            this.updateSectionSize(sectionData);
          }
        });
      }, 16);
    });
  }

  // Public methods for manual control
  enableAutoFit(sectionElement) {
    const sectionData = this.sections.get(sectionElement);
    if (sectionData) {
      sectionData.autoFitEnabled = true;
      sectionData.userHasTyped = false;
      this.updateSectionSize(sectionData);
    }
  }

  disableAutoFit(sectionElement) {
    const sectionData = this.sections.get(sectionElement);
    if (sectionData) {
      sectionData.autoFitEnabled = false;
    }
  }

  resetToOriginal(sectionElement) {
    const sectionData = this.sections.get(sectionElement);
    if (sectionData) {
      sectionData.textArea.textContent = sectionData.originalText;
      this.enableAutoFit(sectionElement);
    }
  }
}

// Global auto-fit manager instance
const autoFitManager = new AutoFitManager();

function initResponsiveSection() {
  const responsiveSections = document.querySelectorAll('.responsive-section');
  if (responsiveSections.length === 0) {
    console.log('No responsive sections found');
    return;
  }

  // Initialize all responsive sections with auto-fit
  responsiveSections.forEach((section, index) => {
    console.log(`Initializing section ${index + 1}:`, section);
    
    const textArea = section.querySelector('.type-area');
    const sizeSlider = section.querySelector('.size');
    const fontSelect = section.querySelector('.font-select');
    
    console.log(`Section ${index + 1} elements:`, {
      textArea: !!textArea,
      sizeSlider: !!sizeSlider,
      fontSelect: !!fontSelect,
      textContent: textArea?.textContent
    });
    
    // Calculate responsive max font size based on screen width and text length
    const screenWidth = window.innerWidth;
    const text = textArea.textContent || textArea.innerText;
    let responsiveMaxFontSize;
    
    if (screenWidth <= 768) {
      // Mobile: adjust based on text length
      if (text.length <= 5) {
        // Short text like "Hello" - allow very large fonts
        responsiveMaxFontSize = Math.min(400, Math.max(150, Math.floor(screenWidth * 0.35)));
      } else if (text.length <= 10) {
        // Medium text - moderate max size
        responsiveMaxFontSize = Math.min(300, Math.max(120, Math.floor(screenWidth * 0.28)));
      } else {
        // Long text like "שלום مرحبا Hello" - more conservative
        responsiveMaxFontSize = Math.min(200, Math.max(80, Math.floor(screenWidth * 0.20)));
      }
    } else if (screenWidth <= 1024) {
      // Tablet: 30% of screen width
      responsiveMaxFontSize = Math.min(450, Math.max(120, Math.floor(screenWidth * 0.30)));
    } else {
      // Desktop: 25% of screen width
      responsiveMaxFontSize = Math.min(512, Math.max(100, Math.floor(screenWidth * 0.25)));
    }
    
    autoFitManager.initSection(section, {
      minFontSize: 40,
      maxFontSize: responsiveMaxFontSize,
      baseFontSize: 244,
      baseWidth: 1920,
      autoFitOnResize: true,
      autoFitOnFontChange: true,
      disableOnUserInput: true
    });

    console.log(`Responsive section ${index + 1} initialized with maxFontSize: ${responsiveMaxFontSize}px (screen width: ${screenWidth}px)`);

    // Force immediate auto-fit on page load (multiple attempts to catch it early)
    setTimeout(() => {
      const sectionData = autoFitManager.sections.get(section);
      if (sectionData) {
        console.log(`Immediate auto-fit on page load - Section ${index + 1}`);
        autoFitManager.updateSectionSize(sectionData);
      }
    }, 0);

    setTimeout(() => {
      const sectionData = autoFitManager.sections.get(section);
      if (sectionData) {
        console.log(`Delayed auto-fit on page load - Section ${index + 1}`);
        autoFitManager.updateSectionSize(sectionData);
      }
    }, 100);

    setTimeout(() => {
      const sectionData = autoFitManager.sections.get(section);
      if (sectionData) {
        console.log(`Final auto-fit on page load - Section ${index + 1}`);
        autoFitManager.updateSectionSize(sectionData);
      }
    }, 300);
  });

  // Add global functions for testing
  window.testAutoFit = () => {
    responsiveSections.forEach(section => {
      autoFitManager.updateSectionSize(autoFitManager.sections.get(section));
    });
  };

  window.resetAutoFit = () => {
    responsiveSections.forEach(section => {
      autoFitManager.resetToOriginal(section);
    });
  };

  // Function to create a new responsive section
  window.createResponsiveSection = (containerId = 'main-content') => {
    const container = document.getElementById(containerId) || document.querySelector('.content-wrapper');
    if (!container) {
      console.error('Container not found');
      return;
    }

    const sectionCount = document.querySelectorAll('.responsive-section').length + 1;
    
    const newSection = document.createElement('section');
    newSection.className = 'type-tester responsive-section';
    newSection.innerHTML = `
      <div class="controls">
        <div class="sliders-wrapper">
          <label class="label-custom" for="size-${sectionCount}">Size</label>
          <input class="size" id="size-${sectionCount}" type="range" min="16" max="512" />
          <label class="label-custom" for="leading-${sectionCount}">Leading</label>
          <input class="leading" id="leading-${sectionCount}" type="range" min="0.5" max="2" step="0.05" />
          <label class="label-custom" for="spacing-${sectionCount}">Letter Spacing</label>
          <input class="spacing" id="spacing-${sectionCount}" type="range" min="-0.1" max="0.1" step="0.01" />
        </div>
        <div class="font-align-wrapper">
          <div class="font-wrapper">
            <div class="custom-select font-select-custom" data-section="${sectionCount}">
              <div class="select-header">
                <span class="select-value">Safra Sans Bold</span>
                <span class="select-arrow"></span>
              </div>
              <div class="select-options">
                <div class="select-option" data-value="Safra Regular">Safra Regular</div>
                <div class="select-option" data-value="Safra Bold">Safra Bold</div>
                <div class="select-option" data-value="Safra Sans Regular">Safra Sans Regular</div>
                <div class="select-option" data-value="Safra Sans Bold">Safra Sans Bold</div>
              </div>
            </div>
            <select class="font-select" aria-label="Font and weight" style="display: none;">
              <option value="Safra Regular">Safra Regular</option>
              <option value="Safra Bold">Safra Bold</option>
              <option value="Safra Sans Regular">Safra Sans Regular</option>
              <option value="Safra Sans Bold" selected>Safra Sans Bold</option>
            </select>
          </div>
          <div class="align-buttons" role="group" aria-label="Align">
            <button class="icon-btn align-left" type="button" data-align="left" aria-label="Align left"></button>
            <button class="icon-btn align-center is-active" type="button" data-align="center" aria-label="Align center"></button>
            <button class="icon-btn align-right" type="button" data-align="right" aria-label="Align right"></button>
          </div>
        </div>
      </div>
      <div class="type-area column-count-1 responsive-text" contenteditable="true" dir="rtl" style="font-family: 'Safra Sans'; font-weight: 700; font-size: 244px; line-height: 1; letter-spacing: -0.035em; text-align: center; white-space: nowrap;">שלום مرحبا Hello</div>
    `;

    // Insert before the last section (before footer or other content)
    const lastSection = container.querySelector('section:last-of-type');
    if (lastSection) {
      container.insertBefore(newSection, lastSection);
    } else {
      container.appendChild(newSection);
    }

    // Initialize the new section
    autoFitManager.initSection(newSection, {
      minFontSize: 40,
      maxFontSize: 244,
      baseFontSize: 244,
      baseWidth: 1920,
      autoFitOnResize: true,
      autoFitOnFontChange: true,
      disableOnUserInput: true
    });

    console.log(`New responsive section ${sectionCount} created and initialized`);
    return newSection;
  };

  // Add carousel testing functions
  window.testCarousel = (carouselId) => {
    const track = document.getElementById(carouselId);
    if (track) {
      console.log(`Testing carousel ${carouselId}`);
      track.style.transform = 'translateX(-100%)';
      setTimeout(() => {
        track.style.transform = 'translateX(0%)';
      }, 1000);
    }
  };

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      window.testAutoFit();
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      window.resetAutoFit();
    }
  });
}

// ====== CAROUSEL FUNCTIONALITY ======
function initCarousels() {
  const carousels = [
    { 
      track: 'carousel-a', 
      indicators: 'indicators-a', 
      totalSlides: 5,
      interval: 7500, // 7.5 seconds for left carousel
      delay: 2000 // 2 second delay for left carousel
    },
    { 
      track: 'carousel-b', 
      indicators: 'indicators-b', 
      totalSlides: 4,
      interval: 5500, // 5.5 seconds for right carousel
      delay: 4500 // 4.5 second delay for right carousel
    }
  ];

  carousels.forEach(carousel => {
    const track = document.getElementById(carousel.track);
    const indicators = document.getElementById(carousel.indicators);
    const container = track.closest('.carousel-container');
    
    if (!track || !indicators || !container) return;

    // Set aspect ratio and ensure all images are loaded before starting carousel
    const allImages = track.querySelectorAll('img');
    let loadedImages = 0;
    let aspectRatioSet = false;
    
    function setAspectRatio(img) {
      if (!aspectRatioSet && img.naturalWidth > 0 && img.naturalHeight > 0) {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        container.style.aspectRatio = `${aspectRatio}`;
        console.log(`Carousel ${carousel.track}: Aspect ratio set to ${aspectRatio}`);
        aspectRatioSet = true;
      }
    }
    
    allImages.forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        loadedImages++;
        setAspectRatio(img);
      } else {
        img.onload = () => {
          loadedImages++;
          setAspectRatio(img);
          if (loadedImages === allImages.length) {
            console.log(`Carousel ${carousel.track}: All images loaded`);
          }
        };
        img.onerror = () => {
          loadedImages++;
          console.warn(`Carousel ${carousel.track}: Image failed to load: ${img.src}`);
          if (loadedImages === allImages.length) {
            console.log(`Carousel ${carousel.track}: All images processed`);
          }
        };
      }
    });
    
    // Fallback: if no aspect ratio is set after 2 seconds, use default
    setTimeout(() => {
      if (!aspectRatioSet) {
        container.style.aspectRatio = '4/3'; // Default fallback
        console.log(`Carousel ${carousel.track}: Using default aspect ratio 4/3`);
      }
    }, 2000);

    let currentSlide = 0;
    let autoPlayInterval;

    function updateCarousel() {
      const translateX = -currentSlide * 100;
      track.style.transform = `translateX(${translateX}%)`;
      
      // Update indicators (only show indicators for original slides)
      const indicatorElements = indicators.querySelectorAll('.indicator');
      const indicatorIndex = currentSlide % carousel.totalSlides;
      indicatorElements.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === indicatorIndex);
      });
    }

    function nextSlide() {
      currentSlide++;
      console.log(`Carousel ${carousel.track}: Moving to slide ${currentSlide}`);
      
      // When we reach the end of the original slides, jump to the duplicate set
      if (currentSlide >= carousel.totalSlides) {
        console.log(`Carousel ${carousel.track}: Reached end, jumping to duplicates`);
        updateCarousel();
        
        // After transition completes, reset to beginning seamlessly
        const transitionDuration = carousel.track === 'carousel-b' ? 2700 : 2000; // 2.7s for right, 2s for left
        setTimeout(() => {
          currentSlide = 0;
          track.style.transition = 'none'; // Disable transition for instant jump
          updateCarousel();
          // Re-enable transition after a brief delay
          setTimeout(() => {
            const transitionSpeed = carousel.track === 'carousel-b' ? '2.7s' : '2s';
            track.style.transition = `transform ${transitionSpeed} ease-in-out`;
          }, 10);
        }, transitionDuration); // Wait for the transition to complete
      } else {
        updateCarousel();
      }
    }

    function goToSlide(slideIndex) {
      currentSlide = slideIndex;
      updateCarousel();
    }

    // Auto-play functionality
    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, carousel.interval);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    // Indicator click handlers
    const indicatorElements = indicators.querySelectorAll('.indicator');
    indicatorElements.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        stopAutoPlay();
        startAutoPlay(); // Restart auto-play after manual interaction
      });
    });

    // Pause on hover
    const carouselContainer = track.closest('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopAutoPlay);
      carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }

    // Initialize
    updateCarousel();
    
    // Start auto-play with delay for right carousel
    if (carousel.delay > 0) {
      setTimeout(() => {
        console.log(`Starting carousel ${carousel.track} with ${carousel.interval}ms interval`);
        startAutoPlay();
      }, carousel.delay);
    } else {
      console.log(`Starting carousel ${carousel.track} with ${carousel.interval}ms interval`);
      startAutoPlay();
    }
  });
}

// ====== INVERT TOGGLE FUNCTIONALITY ======
function initInvertToggle() {
  const invertToggle = document.getElementById('invertToggle');
  const body = document.body;
  
  if (!invertToggle) return;
  
  // Check if inverted state is saved in localStorage
  const isInverted = localStorage.getItem('safra-inverted') === 'true';
  if (isInverted) {
    body.classList.add('inverted');
  }
  
  invertToggle.addEventListener('click', function() {
    body.classList.toggle('inverted');
    
    // Save state to localStorage
    const isCurrentlyInverted = body.classList.contains('inverted');
    localStorage.setItem('safra-inverted', isCurrentlyInverted.toString());
    
    console.log('Invert toggle:', isCurrentlyInverted ? 'ON' : 'OFF');
  });
}

// ====== CUSTOM DROPDOWN FUNCTIONALITY ======
function initCustomDropdown() {
  // Initialize all custom dropdowns
  const customSelects = document.querySelectorAll('.custom-select');
  
  customSelects.forEach(customSelect => {
    const selectHeader = customSelect.querySelector('.select-header');
    const selectValue = customSelect.querySelector('.select-value');
    const selectOptions = customSelect.querySelectorAll('.select-option');
    const section = customSelect.getAttribute('data-section');

    // Toggle dropdown
    selectHeader.addEventListener('click', function(e) {
      e.stopPropagation();
      customSelect.classList.toggle('open');
    });

    // Handle option selection
    selectOptions.forEach(option => {
      option.addEventListener('click', function(e) {
        e.stopPropagation();
        const value = this.getAttribute('data-value');
        const text = this.textContent;
        
        // Update display value
        selectValue.textContent = text;
        
        // Close dropdown
        customSelect.classList.remove('open');
        
        // Find and trigger the corresponding hidden select
        const hiddenSelect = customSelect.parentElement.querySelector('.font-select');
        if (hiddenSelect) {
          hiddenSelect.value = value;
          hiddenSelect.dispatchEvent(new Event('change'));
        }
        
        // Special handling for glyph grid
        if (customSelect.id === 'weight-select') {
          if (window.changeWeight) {
            window.changeWeight(value);
          }
        }
      });
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    customSelects.forEach(customSelect => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open');
      }
    });
  });
}

// ====== OVERLAY FORMS FUNCTIONALITY ======
function initOverlayForms() {
  const trialBtn = document.getElementById('trialBtn');
  const buyBtn = document.getElementById('buyBtn');
  const trialOverlay = document.getElementById('trialOverlay');
  const buyOverlay = document.getElementById('buyOverlay');
  const closeTrial = document.getElementById('closeTrial');
  const closeBuy = document.getElementById('closeBuy');

  // Open trial form
  if (trialBtn && trialOverlay) {
    trialBtn.addEventListener('click', function() {
      trialOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Recalculate viewport height for iOS Safari
      if (window.innerWidth <= 768) {
        setViewportHeight();
      }
    });
  }

  // Open buy form
  if (buyBtn && buyOverlay) {
    buyBtn.addEventListener('click', function() {
      buyOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Recalculate viewport height for iOS Safari
      if (window.innerWidth <= 768) {
        setViewportHeight();
      }
    });
  }

  // Close trial form
  if (closeTrial && trialOverlay) {
    closeTrial.addEventListener('click', function() {
      trialOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form after overlay closes
      setTimeout(() => {
        document.getElementById('trialFormContent').reset();
        document.getElementById('trialFormContent').style.display = '';
        document.getElementById('trialSuccessMessage').style.display = 'none';
        
        const submitBtn = document.querySelector('.trial-form button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }, 600);
    });
  }

  // Close buy form
  if (closeBuy && buyOverlay) {
    closeBuy.addEventListener('click', function() {
      buyOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form after overlay closes
      setTimeout(() => {
        document.getElementById('buyFormContent').reset();
        document.getElementById('buyIntroText').style.display = '';
        document.getElementById('buyFormContent').style.display = '';
        document.getElementById('buySuccessMessage').style.display = 'none';
        
        const submitBtn = document.querySelector('.buy-form button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Request';
        }
      }, 600);
    });
  }
  
  // Handle "Continue to website" buttons
  const trialSuccessBtn = document.getElementById('trialSuccessBtn');
  const buySuccessBtn = document.getElementById('buySuccessBtn');
  
  if (trialSuccessBtn && trialOverlay) {
    trialSuccessBtn.addEventListener('click', function() {
      // Close overlay
      trialOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form and show it again after overlay animation completes
      setTimeout(() => {
        document.getElementById('trialFormContent').reset();
        document.getElementById('trialFormContent').style.display = '';
        document.getElementById('trialSuccessMessage').style.display = 'none';
        
        // Reset submit button
        const submitBtn = document.querySelector('.trial-form button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }, 600);
    });
  }
  
  if (buySuccessBtn && buyOverlay) {
    buySuccessBtn.addEventListener('click', function() {
      // Close overlay
      buyOverlay.classList.remove('active');
      document.body.style.overflow = '';
      
      // Reset form and show it again after overlay animation completes
      setTimeout(() => {
        document.getElementById('buyFormContent').reset();
        document.getElementById('buyIntroText').style.display = '';
        document.getElementById('buyFormContent').style.display = '';
        document.getElementById('buySuccessMessage').style.display = 'none';
        
        // Reset submit button
        const submitBtn = document.querySelector('.buy-form button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Request';
        }
      }, 600);
    });
  }

  // Close overlays when clicking outside
  document.addEventListener('click', function(e) {
    if (trialOverlay && trialOverlay.classList.contains('active')) {
      const scrollTrialBtn = document.getElementById('scrollTrialBtn');
      if (!trialOverlay.contains(e.target) && !trialBtn.contains(e.target) && !scrollTrialBtn.contains(e.target)) {
        trialOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after overlay closes
        setTimeout(() => {
          document.getElementById('trialFormContent').reset();
          document.getElementById('trialFormContent').style.display = '';
          document.getElementById('trialSuccessMessage').style.display = 'none';
          
          const submitBtn = document.querySelector('.trial-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
          }
        }, 600);
      }
    }
    
    if (buyOverlay && buyOverlay.classList.contains('active')) {
      const scrollBuyBtn = document.getElementById('scrollBuyBtn');
      if (!buyOverlay.contains(e.target) && !buyBtn.contains(e.target) && !scrollBuyBtn.contains(e.target)) {
        buyOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after overlay closes
        setTimeout(() => {
          document.getElementById('buyFormContent').reset();
          document.getElementById('buyIntroText').style.display = '';
          document.getElementById('buyFormContent').style.display = '';
          document.getElementById('buySuccessMessage').style.display = 'none';
          
          const submitBtn = document.querySelector('.buy-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Request';
          }
        }, 600);
      }
    }
  });

  // Close overlays with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (trialOverlay && trialOverlay.classList.contains('active')) {
        trialOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after overlay closes
        setTimeout(() => {
          document.getElementById('trialFormContent').reset();
          document.getElementById('trialFormContent').style.display = '';
          document.getElementById('trialSuccessMessage').style.display = 'none';
          
          const submitBtn = document.querySelector('.trial-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
          }
        }, 600);
      }
      if (buyOverlay && buyOverlay.classList.contains('active')) {
        buyOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form after overlay closes
        setTimeout(() => {
          document.getElementById('buyFormContent').reset();
          document.getElementById('buyIntroText').style.display = '';
          document.getElementById('buyFormContent').style.display = '';
          document.getElementById('buySuccessMessage').style.display = 'none';
          
          const submitBtn = document.querySelector('.buy-form button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Request';
          }
        }, 600);
      }
    }
  });

  // Form submission handlers
  const trialForm = document.querySelector('.trial-form');
  const buyForm = document.querySelector('.buy-form');

  if (trialForm) {
    trialForm.addEventListener('submit', function(e) {
      e.preventDefault();
      sendTrialEmail();
    });
  }

  if (buyForm) {
    buyForm.addEventListener('submit', function(e) {
      e.preventDefault();
      sendBuyEmail();
    });
  }
}

// ====== COLLAPSIBLE SECTIONS ======
function initCollapsibleSections() {
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  
  collapsibleHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isActive = this.classList.contains('active');
      
      // Toggle active class on header
      this.classList.toggle('active');
      
      // Toggle active class on content
      content.classList.toggle('active');
    });
  });
}

// ====== CHECKBOX FUNCTIONALITY ======
function initCheckboxLogic() {
  // Find all family checkboxes in the buy form
  const buyForm = document.querySelector('.buy-form');
  if (!buyForm) return;

  const fullFamilyCheckbox = buyForm.querySelector('input[name="family"][value="entire"]');
  const individualCheckboxes = buyForm.querySelectorAll('input[name="family"]:not([value="entire"])');

  if (!fullFamilyCheckbox || individualCheckboxes.length === 0) return;

  // When "Full Family" is checked/unchecked, check/uncheck all individual options
  fullFamilyCheckbox.addEventListener('change', function() {
    individualCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
  });

  // When any individual option is unchecked, uncheck "Full Family"
  individualCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if (!this.checked) {
        fullFamilyCheckbox.checked = false;
      } else {
        // If all individual options are checked, check "Full Family"
        const allChecked = Array.from(individualCheckboxes).every(cb => cb.checked);
        if (allChecked) {
          fullFamilyCheckbox.checked = true;
        }
      }
    });
  });
}

// ====== TRIAL FORM CONDITIONAL LOGIC ======
function initTrialFormLogic() {
  const useTypeRadios = document.querySelectorAll('input[name="useType"]');
  const clientFields = document.getElementById('clientFields');
  const studentFields = document.getElementById('studentFields');
  const clientConsent = document.getElementById('clientConsent');
  const studentConsent = document.getElementById('studentConsent');

  if (!useTypeRadios.length || !clientFields || !studentFields) return;

  useTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Hide all conditional sections first
      clientFields.style.display = 'none';
      studentFields.style.display = 'none';
      clientConsent.style.display = 'none';
      studentConsent.style.display = 'none';

      // Show relevant sections based on selection
      if (this.value === 'Client') {
        clientFields.style.display = 'block';
        clientConsent.style.display = 'block';
      } else if (this.value === 'Student') {
        studentFields.style.display = 'block';
        studentConsent.style.display = 'block';
      }
    });
  });
}

// ====== GSAP DRAGGABLE MARQUEE ======
function initDraggableMarquee() {
  const marqueeContents = document.querySelectorAll('.marquee-content');
  if (!marqueeContents.length || typeof gsap === 'undefined') return;

  marqueeContents.forEach((marqueeContent, index) => {
    // Remove CSS animation to avoid conflicts
    marqueeContent.style.animation = 'none';

    const texts = marqueeContent.querySelectorAll('.marquee-text, .marquee-img');
    if (texts.length === 0) return;

    // Different speeds for different marquees
    const speed = index === 0 ? 1.5 : 0.8; // First marquee (top) = 1.5, second marquee (bottom) = 0.8
    const paddingRight = index === 0 ? 60 : 100; // First marquee (top) = 60px, second marquee (bottom) = 100px

    // Create horizontal loop with GSAP
    const tl = horizontalLoop(texts, {
      repeat: -1,
      speed: speed,
      draggable: true,
      reversed: false,
      paddingRight: paddingRight
    });

    // Add hover functionality to the entire marquee content
    marqueeContent.addEventListener("mouseenter", () => {
      gsap.to(tl, {timeScale: 0.25, overwrite: true, duration: 0.5});
    });
    marqueeContent.addEventListener("mouseleave", () => {
      gsap.to(tl, {timeScale: 1, overwrite: true, duration: 0.5});
    });

    // Debug: Track speed of each span
    let lastPositions = [];
    let debugInterval;
    
    function startDebug() {
      lastPositions = Array.from(texts).map(el => ({
        element: el,
        xPercent: gsap.getProperty(el, "xPercent") || 0,
        timestamp: Date.now()
      }));
      
      debugInterval = setInterval(() => {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastPositions[0].timestamp;
        
        texts.forEach((el, i) => {
          const currentXPercent = gsap.getProperty(el, "xPercent") || 0;
          const lastXPercent = lastPositions[i].xPercent;
          const speed = Math.abs(currentXPercent - lastXPercent) / (timeDiff / 1000); // % per second
          
          // console.log(`Marquee ${index}, Span ${i}: Speed = ${speed.toFixed(2)}% per second, Position = ${currentXPercent.toFixed(2)}%`);
          
          lastPositions[i] = {
            element: el,
            xPercent: currentXPercent,
            timestamp: currentTime
          };
        });
        // console.log('---');
      }, 1000); // Check every second
    }
    
    // Start debugging after a short delay to let the animation begin
    setTimeout(startDebug, 1000);
  });

  // GSAP Horizontal Loop function (from CodePen example)
  function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({repeat: config.repeat, paused: config.paused, defaults: {ease: "none"}, onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)}),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
        populateWidths = () => items.forEach((el, i) => {
          widths[i] = parseFloat(gsap.getProperty(el, "width", "px"));
          xPercents[i] = snap(parseFloat(gsap.getProperty(el, "x", "px")) / widths[i] * 100 + gsap.getProperty(el, "xPercent"));
        }),
        getTotalWidth = () => items[length-1].offsetLeft + xPercents[length-1] / 100 * widths[length-1] - startX + items[length-1].offsetWidth * gsap.getProperty(items[length-1], "scaleX") + (parseFloat(config.paddingRight) || 0),
        totalWidth, curX, distanceToStart, distanceToLoop, item, i;
    
    populateWidths();
    gsap.set(items, {
      xPercent: i => xPercents[i]
    });
    gsap.set(items, {x: 0});
    totalWidth = getTotalWidth();
    
    for (i = 0; i < length; i++) {
      item = items[i];
      curX = xPercents[i] / 100 * widths[i];
      distanceToStart = item.offsetLeft + curX - startX;
      distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
      tl.to(item, {xPercent: snap((curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
        .fromTo(item, {xPercent: snap((curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    
    function toIndex(index, vars) {
      vars = vars || {};
      (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length);
      let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
      if (time > tl.time() !== index > curIndex) {
        vars.modifiers = {time: gsap.utils.wrap(0, tl.duration())};
        time += tl.duration() * (index > curIndex ? 1 : -1);
      }
      curIndex = newIndex;
      vars.overwrite = true;
      return tl.tweenTo(time, vars);
    }
    
    tl.next = vars => toIndex(curIndex+1, vars);
    tl.previous = vars => toIndex(curIndex-1, vars);
    tl.current = () => curIndex;
    tl.toIndex = (index, vars) => toIndex(index, vars);
    tl.updateIndex = () => curIndex = Math.round(tl.progress() * (items.length - 1));
    tl.times = times;
    tl.progress(1, true).progress(0, true);
    
    if (config.reversed) {
      tl.vars.onReverseComplete();
      tl.reverse();
    }
    
    if (config.draggable && typeof(Draggable) === "function") {
      let proxy = document.createElement("div"),
          wrap = gsap.utils.wrap(0, 1),
          ratio, startProgress, draggable, dragSnap, roundFactor,
          align = () => tl.progress(wrap(startProgress + (draggable.startX - draggable.x) * ratio)),
          syncIndex = () => tl.updateIndex();
      
      draggable = Draggable.create(proxy, {
        trigger: items[0].parentNode,
        type: "x",
        onPress() {
          startProgress = tl.progress();
          tl.progress(0);
          populateWidths();
          totalWidth = getTotalWidth();
          ratio = 1 / totalWidth;
          dragSnap = totalWidth / items.length;
          roundFactor = Math.pow(10, ((dragSnap + "").split(".")[1] || "").length);
          tl.progress(startProgress);
        },
        onDrag: align,
        onThrowUpdate: align,
        inertia: true,
        snap: value => {
          let n = Math.round(parseFloat(value) / dragSnap) * dragSnap * roundFactor;
          return (n - n % 1) / roundFactor;
        },
        onRelease: syncIndex,
        onThrowComplete: () => gsap.set(proxy, {x: 0}) && syncIndex()
      })[0];
    }
    
    return tl;
  }
}

// ====== CIRCLE MARQUEE ======
function initCircleMarquee() {
  const circleMarqueeContent = document.querySelector('.circle-marquee-content');
  if (!circleMarqueeContent || typeof gsap === 'undefined') return;

  // Get total width of all content
  const totalWidth = circleMarqueeContent.offsetWidth;
  const circleWidth = 36; // Circle width
  
  // Set initial position
  gsap.set(circleMarqueeContent, { x: circleWidth });
  
  // Simple infinite scroll
  gsap.to(circleMarqueeContent, {
    x: circleWidth - totalWidth,
    duration: totalWidth / 25,
    ease: "none",
    repeat: -1
  });
}

// ====== DYNAMIC MENU WIDTH ======
function initDynamicMenuWidth() {
  const stickyGreenCircle = document.querySelector('.sticky-green-circle');
  const menuBackground = document.querySelector('.menu-background');
  const menuItems = document.querySelector('.menu-items');
  
  if (!stickyGreenCircle || !menuBackground || !menuItems) return;

  // Calculate the content width
  function calculateMenuWidth() {
    // Create a temporary clone to measure
    const tempClone = menuItems.cloneNode(true);
    tempClone.style.position = 'absolute';
    tempClone.style.visibility = 'hidden';
    tempClone.style.opacity = '1';
    tempClone.style.width = 'auto';
    tempClone.style.display = 'flex';
    
    // Add to DOM temporarily
    document.body.appendChild(tempClone);
    
    // Measure the width
    const contentWidth = tempClone.offsetWidth;
    
    // Remove temporary clone
    document.body.removeChild(tempClone);
    
    // Calculate total width with full padding (36px on each side)
    const totalWidth = contentWidth + 72;
    
    // Set CSS variables for animation
    stickyGreenCircle.style.setProperty('--menu-width', totalWidth + 'px');
    stickyGreenCircle.style.setProperty('--menu-padding', '0 36px');
  }

  // Calculate after a short delay to ensure DOM is ready
  setTimeout(calculateMenuWidth, 100);
  window.addEventListener('resize', calculateMenuWidth);
}


// ====== STICKY NAVIGATION ======
function initStickyNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ====== SCROLL BUTTONS ======
function initScrollButtons() {
  const scrollButtons = document.querySelector('.scroll-buttons');
  const scrollSection = document.querySelector('.scroll-buttons-section');
  
  if (!scrollButtons || !scrollSection || typeof gsap === 'undefined') return;

  // Use GSAP ScrollTrigger for smooth animations
  gsap.registerPlugin(ScrollTrigger);
  
  ScrollTrigger.create({
    trigger: scrollSection,
    start: "top bottom",
    end: "bottom top",
    scrub: 0.3, // Smooth scrubbing
    onUpdate: (self) => {
      const progress = self.progress;
      
      // 0-45% progress: small buttons
      // 45-80% progress: large buttons
      // 80-100% progress: small buttons
      // Don't add 'large' class on mobile
      if (window.innerWidth > 768) {
        if (progress > 0.45 && progress <= 0.8) {
          scrollButtons.classList.add('large');
        } else {
          scrollButtons.classList.remove('large');
        }
      } else {
        // On mobile, always remove 'large' class
        scrollButtons.classList.remove('large');
      }
    }
  });
}


function initInitialNavState() {
  const stickyNav = document.querySelector('.sticky-nav');
  const stickyGreenCircle = document.querySelector('.sticky-green-circle');
  const coverHeader = document.querySelector('.cover-header');
  
  if (!stickyNav || !stickyGreenCircle || !coverHeader) return;
  
  // Check initial scroll position
  const headerRect = coverHeader.getBoundingClientRect();
  const disappearThreshold = -(headerRect.height - 30);
  const shouldTrigger = headerRect.top >= (disappearThreshold + 40);
  
  if (!shouldTrigger) {
    // We're already past the trigger point, hide nav and show circle
    stickyNav.style.transition = 'none'; // No transition on initial load
    stickyNav.style.opacity = '0';
    stickyNav.style.top = '32px';
    
    stickyGreenCircle.style.transition = 'none'; // No transition on initial load
    stickyGreenCircle.style.opacity = '1';
  }
}

function initScrollButtonClicks() {
  // Simple click handler for scroll buttons
  document.addEventListener('click', function(e) {
    if (e.target.id === 'scrollTrialBtn') {
      const trialOverlay = document.getElementById('trialOverlay');
      if (trialOverlay) {
        trialOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Recalculate viewport height for iOS Safari
        if (window.innerWidth <= 768) {
          setViewportHeight();
        }
      }
    }
    
    if (e.target.id === 'scrollBuyBtn') {
      const buyOverlay = document.getElementById('buyOverlay');
      if (buyOverlay) {
        buyOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Recalculate viewport height for iOS Safari
        if (window.innerWidth <= 768) {
          setViewportHeight();
        }
      }
    }
  });
}

// ====== MOBILE MENU ======
function initMobileMenu() {
  const mobileHamburgerCircle = document.getElementById('mobileHamburgerCircle');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeBtn = document.getElementById('closeMobileMenu');
  
  if (!mobileHamburgerCircle || !mobileOverlay || !closeBtn) return;
  
  // Show/hide based on screen size
  function updateVisibility() {
    if (window.innerWidth <= 768) {
      mobileHamburgerCircle.style.display = 'block';
    } else {
      mobileHamburgerCircle.style.display = 'none';
      mobileOverlay.classList.remove('active');
    }
  }
  
  // Initial visibility check
  updateVisibility();
  
  // Open menu
  mobileHamburgerCircle.addEventListener('click', () => {
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Recalculate viewport height for iOS Safari
    if (window.innerWidth <= 768) {
      setViewportHeight();
    }
  });
  
  // Close menu
  closeBtn.addEventListener('click', () => {
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // Close menu when clicking overlay background
  mobileOverlay.addEventListener('click', (e) => {
    if (e.target === mobileOverlay) {
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', updateVisibility);
}

function boot() { 
  initStickyNav();
  initScrollButtons();
  initScrollButtonClicks();
  initTypingControls(); 
  initGlyphGrid(); 
  adjustPreviewHeight(); 
  initParallax();
  initResponsiveSection();
  initCarousels();
  initInvertToggle();
  initMobileMenu();
  initCustomDropdown();
  initOverlayForms();
  initCollapsibleSections();
  initCheckboxLogic();
  initTrialFormLogic();
  initDraggableMarquee();
  initCircleMarquee();
  initDynamicMenuWidth();
  initInitialNavState();
  
  // Additional immediate auto-fit for responsive section
  setTimeout(() => {
    const responsiveSection = document.querySelector('.responsive-section');
    if (responsiveSection) {
      const textArea = responsiveSection.querySelector('.responsive-text');
      if (textArea) {
        // Force single line and trigger auto-fit
        textArea.style.whiteSpace = 'nowrap';
        
        const sectionData = autoFitManager.sections.get(responsiveSection);
        if (sectionData) {
          console.log('Emergency auto-fit triggered');
          autoFitManager.updateSectionSize(sectionData);
        }
      }
    }
  }, 50);
}

document.addEventListener('DOMContentLoaded', boot); 
window.addEventListener('resize', () => {
  adjustPreviewHeight();
  // The responsive section resize is handled within initResponsiveSection
});

// ====== FIX MOBILE VIEWPORT HEIGHT ISSUE ======
// Based on: https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
function setViewportHeight() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set initial viewport height
setViewportHeight();

// Store the initial height to detect significant changes
let initialHeight = window.innerHeight;
let lastHeight = window.innerHeight;

// Update viewport height only on significant resize events (orientation change, major resize)
// This prevents jumping when Safari address bar appears/disappears during scroll
window.addEventListener('resize', () => {
  const currentHeight = window.innerHeight;
  const heightDifference = Math.abs(currentHeight - lastHeight);
  
  // Only update if the height change is significant (orientation change or major resize)
  // This prevents updates when Safari address bar shows/hides during scroll
  if (heightDifference > 100 || 
      (window.innerWidth > window.innerHeight && lastHeight < window.innerHeight) || // Landscape
      (window.innerWidth < window.innerHeight && lastHeight > window.innerHeight)) { // Portrait
    setViewportHeight();
    lastHeight = currentHeight;
  }
});

// Also update on orientation change for better reliability
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    setViewportHeight();
    lastHeight = window.innerHeight;
  }, 100);
});

// ====== ARABIC LETTER-SPACING FIX FOR SAFARI ======
// Detect Arabic characters and wrap them in spans with no letter-spacing
function isArabic(char) {
  // Arabic Unicode ranges
  const arabicRanges = [
    [0x0600, 0x06FF], // Arabic
    [0x0750, 0x077F], // Arabic Supplement
    [0x08A0, 0x08FF], // Arabic Extended-A
    [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
    [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
  ];
  
  const code = char.charCodeAt(0);
  return arabicRanges.some(([start, end]) => code >= start && code <= end);
}

function wrapArabicCharacters() {
  // Only apply on Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (!isSafari) return;
  
  const typeAreas = document.querySelectorAll('.type-area');
  
  typeAreas.forEach(typeArea => {
    // Check if this is the responsive section
    const isResponsiveSection = typeArea.closest('.responsive-section');
    
    // Always process - don't skip based on flag for live updates
    const text = typeArea.textContent;
    let newHTML = '';
    let currentArabicGroup = '';
    let currentNonArabicGroup = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (isArabic(char)) {
        // If we were building a non-Arabic group, flush it first
        if (currentNonArabicGroup) {
          newHTML += currentNonArabicGroup;
          currentNonArabicGroup = '';
        }
        // Add to Arabic group
        currentArabicGroup += char;
      } else {
        // If we were building an Arabic group, flush it first
        if (currentArabicGroup) {
          // For responsive section, use CSS class only (no inline styles)
          // For other sections, use inline styles for stronger override
          if (isResponsiveSection) {
            newHTML += `<span class="arabic-no-spacing" dir="rtl">${currentArabicGroup}</span>`;
          } else {
            newHTML += `<span class="arabic-no-spacing" dir="rtl" style="letter-spacing: 0 !important; direction: rtl;">${currentArabicGroup}</span>`;
          }
          currentArabicGroup = '';
        }
        // Add to non-Arabic group
        currentNonArabicGroup += char;
      }
    }
    
    // Flush any remaining groups
    if (currentArabicGroup) {
      if (isResponsiveSection) {
        newHTML += `<span class="arabic-no-spacing" dir="rtl">${currentArabicGroup}</span>`;
      } else {
        newHTML += `<span class="arabic-no-spacing" dir="rtl" style="letter-spacing: 0 !important; direction: rtl;">${currentArabicGroup}</span>`;
      }
    }
    if (currentNonArabicGroup) {
      newHTML += currentNonArabicGroup;
    }
    
    // Only update if content has changed
    if (typeArea.innerHTML !== newHTML) {
      // Store cursor position before updating
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      let cursorOffset = 0;
      let isInArabicContext = false;
      
      if (range && range.startContainer.nodeType === Node.TEXT_NODE) {
        cursorOffset = range.startOffset;
        // Check if cursor is in Arabic text
        const textNode = range.startContainer;
        const textBeforeCursor = textNode.textContent.substring(0, cursorOffset);
        isInArabicContext = textBeforeCursor.split('').some(char => isArabic(char));
      }
      
      typeArea.innerHTML = newHTML;
      
      // Simple cursor restoration - place at end if in Arabic context
      if (range && isInArabicContext) {
        setTimeout(() => {
          try {
            // Find the last text node in the element
            const walker = document.createTreeWalker(
              typeArea,
              NodeFilter.SHOW_TEXT,
              null,
              false
            );
            
            let lastTextNode = null;
            while (walker.nextNode()) {
              lastTextNode = walker.currentNode;
            }
            
            if (lastTextNode) {
              const newRange = document.createRange();
              newRange.setStart(lastTextNode, lastTextNode.textContent.length);
              newRange.setEnd(lastTextNode, lastTextNode.textContent.length);
              
              selection.removeAllRanges();
              selection.addRange(newRange);
              
              // Ensure RTL direction
              typeArea.style.direction = 'rtl';
              typeArea.setAttribute('dir', 'rtl');
            }
          } catch (e) {
            console.log('Cursor restoration failed:', e);
          }
        }, 10);
      }
      
      // If this is the responsive section, trigger auto-fit recalculation
      if (isResponsiveSection) {
        const sectionData = autoFitManager?.sections?.get(typeArea.closest('.responsive-section'));
        if (sectionData) {
          // Small delay to ensure DOM is updated
          setTimeout(() => {
            autoFitManager.updateSectionSize(sectionData);
          }, 50);
        }
      }
    }
  });
}

// Run on page load and when content changes
document.addEventListener('DOMContentLoaded', wrapArabicCharacters);

// Update Arabic character wrapping in real-time when user types
function setupLiveArabicUpdate() {
  const typeAreas = document.querySelectorAll('.type-area');
  
  typeAreas.forEach(typeArea => {
    let isTyping = false;
    let typingTimeout;
    
    // Listen for keydown to detect when user starts typing
    typeArea.addEventListener('keydown', function() {
      isTyping = true;
      clearTimeout(typingTimeout);
    });
    
    // Listen for input events but delay processing until user stops typing
    typeArea.addEventListener('input', function() {
      isTyping = true;
      clearTimeout(typingTimeout);
      
      // Only process after user has stopped typing for a longer period
      typingTimeout = setTimeout(() => {
        isTyping = false;
        wrapArabicCharacters();
      }, 500); // Increased delay to avoid splitting words
    });
    
    // Handle paste events immediately
    typeArea.addEventListener('paste', function() {
      clearTimeout(typingTimeout);
      setTimeout(() => {
        wrapArabicCharacters();
      }, 100);
    });
    
    // Also use MutationObserver but only when not actively typing
    const observer = new MutationObserver(function(mutations) {
      if (!isTyping) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' || mutation.type === 'characterData') {
            clearTimeout(typeArea.arabicUpdateTimeout);
            typeArea.arabicUpdateTimeout = setTimeout(() => {
              wrapArabicCharacters();
            }, 100);
          }
        });
      }
    });
    
    // Start observing
    observer.observe(typeArea, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });
}

// Setup live updates when DOM is ready
document.addEventListener('DOMContentLoaded', setupLiveArabicUpdate);

// ====== EMAILJS INITIALIZATION ======
// Initialize EmailJS with your public key when the page loads
document.addEventListener('DOMContentLoaded', function() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('SY_sCUJHCR5MtWgI5'); // Replace with your actual public key from EmailJS dashboard
  } else {
    console.error('EmailJS library not loaded');
  }
});

// ====== EMAILJS FUNCTIONS ======
function sendTrialEmail() {
  // Get error message element
  const errorMsg = document.getElementById('trialError');
  
  // Check if consent is checked
  const consentCheckbox = document.querySelector('.trial-form input[name="consent"]:checked');
  if (!consentCheckbox) {
    errorMsg.textContent = 'Please accept the consent agreement before submitting.';
    errorMsg.style.display = 'block';
    // Scroll to error message on mobile
    if (window.innerWidth <= 768) {
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Hide error message if it was showing
  errorMsg.style.display = 'none';
  
  // Get submit button and show loading
  const submitBtn = document.querySelector('.trial-form button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Sending...';
  
  // Get the use type (client or student)
  const useType = document.querySelector('input[name="useType"]:checked')?.value;
  
  // Get detailed information based on use type
  let company = '';
  let clientName = '';
  let clientWebsite = '';
  let institutionName = '';
  let graduationYear = '';
  
  if (useType === 'Client') {
    company = document.getElementById('clientCompany')?.value || '';
    clientName = document.getElementById('clientName')?.value || '';
    clientWebsite = document.getElementById('clientWebsite')?.value || '';
  } else if (useType === 'Student') {
    institutionName = document.getElementById('institutionName')?.value || '';
    graduationYear = document.getElementById('graduationYear')?.value || '';
  }
  
  // Get font name from the form header (remove "Download " prefix)
  const fontRequested = (document.querySelector('#trialOverlay .form-header h2')?.textContent?.trim() || 'Font Request').replace(/^Download\s+/i, '');
  
  const templateParams = {
    from_name: document.getElementById('trialName').value,
    from_email: document.getElementById('trialEmail').value,
    font_requested: fontRequested,
    use_type: useType,
    // Client project details
    company: company,
    client_name: clientName,
    client_website: clientWebsite,
    // Student work details
    institution_name: institutionName,
    graduation_year: graduationYear,
    // Consent
    consent: document.querySelector('input[name="consent"]:checked') ? 'Yes' : 'No'
  };

  emailjs.send('service_fzf0ivr', 'template_7un2cmq', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      submitBtn.innerHTML = '✓ Sent!';
      setTimeout(() => {
        // Hide form and show success message
        document.getElementById('trialFormContent').style.display = 'none';
        document.getElementById('trialSuccessMessage').style.display = 'block';
      }, 500);
    }, function(error) {
      console.log('FAILED...', error);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert('Sorry, there was an error. Please try again.');
    });
}

function sendBuyEmail() {
  // Get error message element
  const errorMsg = document.getElementById('buyError');
  
  // Check if at least one font is selected
  const selectedFontsCheckboxes = document.querySelectorAll('.buy-form input[name="family"]:checked');
  if (selectedFontsCheckboxes.length === 0) {
    errorMsg.textContent = 'Please select at least one font.';
    errorMsg.style.display = 'block';
    // Scroll to error message on mobile
    if (window.innerWidth <= 768) {
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Check if at least one intended use is selected
  const selectedUses = document.querySelectorAll('.buy-form input[name="use"]:checked');
  console.log('Selected uses count:', selectedUses.length);
  console.log('Selected uses:', selectedUses);
  if (selectedUses.length === 0) {
    errorMsg.textContent = 'Please select at least one intended use.';
    errorMsg.style.display = 'block';
    // Scroll to error message on mobile
    if (window.innerWidth <= 768) {
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Check if consent is checked
  const consentCheckbox = document.querySelector('.buy-form input[name="consent"]:checked');
  if (!consentCheckbox) {
    errorMsg.textContent = 'Please accept the consent agreement before submitting.';
    errorMsg.style.display = 'block';
    // Scroll to error message on mobile
    if (window.innerWidth <= 768) {
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  // Hide error message if it was showing
  errorMsg.style.display = 'none';
  
  // Get submit button and show loading
  const submitBtn = document.querySelector('.buy-form button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Sending...';
  
  // Get font name from the form header (remove "Buy " prefix)
  const fontRequested = (document.querySelector('#buyOverlay .form-header h2')?.textContent?.trim() || 'Font Request').replace(/^Buy\s+/i, '');
  
  // Get selected fonts (excluding Full Family)
  const selectedFonts = Array.from(document.querySelectorAll('.buy-form input[name="family"]:checked'))
    .map(checkbox => {
      // Get the label text content and extract just the font name
      const label = checkbox.closest('label');
      return label ? label.textContent.trim() : checkbox.value;
    })
    .filter(fontName => !fontName.includes('Full Family'))
    .join(', ');
  
  // Check if Full Family is selected
  const fullFamilySelected = Array.from(document.querySelectorAll('.buy-form input[name="family"]:checked'))
    .some(checkbox => {
      const label = checkbox.closest('label');
      return label && label.textContent.includes('Full Family');
    });
  
  // Get intended uses
  const intendedUses = Array.from(document.querySelectorAll('.buy-form input[name="use"]:checked'))
    .map(checkbox => checkbox.value)
    .join(', ');
  
  const templateParams = {
    from_name: document.getElementById('buyName').value,
    from_email: document.getElementById('buyEmail').value,
    company: document.getElementById('buyCompany').value,
    font_requested: fontRequested,
    selected_fonts: selectedFonts,
    full_family: fullFamilySelected ? 'Yes' : 'No',
    intended_use: intendedUses,
    consent: document.querySelector('.buy-form input[name="consent"]:checked') ? 'Yes' : 'No'
  };

  emailjs.send('service_fzf0ivr', 'template_y27yzjn', templateParams)
    .then(function(response) {
      console.log('SUCCESS!', response.status, response.text);
      submitBtn.innerHTML = '✓ Sent!';
      setTimeout(() => {
        // Hide intro text and form, show success message
        document.getElementById('buyIntroText').style.display = 'none';
        document.getElementById('buyFormContent').style.display = 'none';
        document.getElementById('buySuccessMessage').style.display = 'block';
      }, 500);
    }, function(error) {
      console.log('FAILED...', error);
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      alert('Sorry, there was an error. Please try again.');
    });
}
