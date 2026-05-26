/**
 * FORTIS LEGAL SOLUTIONS - APPLICATION CONTROLLER
 * Orchestrates all premium UX interactions, animated stats counters,
 * interactive branch selection maps, service modals, and validated planners.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all core controllers
  initNavigation();
  initStatsCounters();
  initServiceModals();
  initBranchSwitcher();
  initConsultationForm();
  initTechMockupAnimation();
  initScrollReveal();
});

/* ==========================================================================
   1. Glassmorphic Navigation & Hamburger Menu
   ========================================================================== */
function initNavigation() {
  const header = document.getElementById("header");
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // Sticky navbar shrink on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll active link highlight
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });

  // Mobile hamburger menu toggle
  hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    navMenu.classList.toggle("active");
    
    // Prevent body scrolling when menu is open
    if (navMenu.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking any nav link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerMenu.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });
}

/* ==========================================================================
   2. Numeric Viewport Counter Engine
   ========================================================================== */
function initStatsCounters() {
  const statNumbers = document.querySelectorAll(".stat-number");
  
  if (statNumbers.length === 0) return;

  const countOptions = {
    threshold: 0.5,
    rootMargin: "0px"
  };

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        animateCounter(target);
        observer.unobserve(target); // Animate only once
      }
    });
  }, countOptions);

  statNumbers.forEach((stat) => {
    countObserver.observe(stat);
  });
}

function animateCounter(element) {
  const target = +element.getAttribute("data-target");
  const duration = 2000; // 2 seconds animation
  const stepTime = 30; // ms per frame
  const steps = duration / stepTime;
  const increment = target / steps;
  
  let currentVal = 0;
  let currentStep = 0;

  const timer = setInterval(() => {
    currentStep++;
    currentVal += increment;
    
    if (currentStep >= steps) {
      clearInterval(timer);
      element.textContent = target + (target === 15 || target === 6 ? "+" : target === 1000 ? "+" : "");
    } else {
      element.textContent = Math.floor(currentVal) + (target === 15 || target === 6 ? "+" : target === 1000 ? "+" : "");
    }
  }, stepTime);
}

/* ==========================================================================
   3. Service Modals Controller
   ========================================================================== */
function initServiceModals() {
  const serviceCards = document.querySelectorAll(".service-card");
  
  serviceCards.forEach((card) => {
    const serviceType = card.getAttribute("data-service");
    if (serviceType) {
      card.addEventListener("click", () => {
        openServiceModal(serviceType);
      });
    }
  });
}

function openServiceModal(serviceId) {
  const modal = document.getElementById(`modal-${serviceId}`);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }
}

function closeModals() {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.classList.remove("active");
  });
  document.body.style.overflow = ""; // Re-enable scroll
}

// Global scope helpers for HTML onclick events
window.openServiceModal = openServiceModal;
window.closeModals = closeModals;

window.setFormService = function(serviceId) {
  const serviceDropdown = document.getElementById("selectedService");
  if (serviceDropdown) {
    serviceDropdown.value = serviceId;
  }
};

window.setFormBranch = function(branchId) {
  const branchDropdown = document.getElementById("preferredBranch");
  if (branchDropdown) {
    branchDropdown.value = branchId;
  }
};

/* ==========================================================================
   4. Interactive Branch Switcher (Tamil Nadu Offices)
   ========================================================================== */
function initBranchSwitcher() {
  const cityPills = document.querySelectorAll(".city-pill");
  const branchCards = document.querySelectorAll(".branch-card");
  const genericCard = document.getElementById("branch-generic");
  const genericName = document.getElementById("genericBranchName");

  cityPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      // Toggle active states on pills
      cityPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      const city = pill.getAttribute("data-city");

      // Hide all branch cards
      branchCards.forEach((card) => card.classList.remove("active"));

      if (city === "chennai") {
        document.getElementById("branch-chennai").classList.add("active");
      } else if (city === "erode") {
        document.getElementById("branch-erode").classList.add("active");
      } else {
        // Dynamic generic card customization
        const formattedCityName = city.charAt(0).toUpperCase() + city.slice(1);
        genericName.textContent = `${formattedCityName} Chambers`;
        genericCard.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   5. Interactive Form Validator & Asynchronous Simulation
   ========================================================================== */
function initConsultationForm() {
  const form = document.getElementById("consultationForm");
  if (!form) return;

  const inputs = {
    name: document.getElementById("clientName"),
    email: document.getElementById("clientEmail"),
    phone: document.getElementById("clientPhone"),
    details: document.getElementById("caseDetails")
  };

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    details: document.getElementById("detailsError")
  };

  // Real-time visual feedback on typing
  Object.keys(inputs).forEach((key) => {
    const input = inputs[key];
    input.addEventListener("input", () => {
      validateField(key, input, errors[key]);
    });
  });

  // Form submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    Object.keys(inputs).forEach((key) => {
      const isValid = validateField(key, inputs[key], errors[key]);
      if (!isValid) isFormValid = false;
    });

    if (isFormValid) {
      executeFormSubmission(form);
    }
  });
}

function validateField(type, input, errorElement) {
  let isValid = true;
  const val = input.value.trim();

  if (type === "name") {
    isValid = val.length >= 3;
  } else if (type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    isValid = emailRegex.test(val);
  } else if (type === "phone") {
    const phoneRegex = /^[6-9]\d{9}$/; // Standard Indian 10-digit mobile
    isValid = phoneRegex.test(val);
  } else if (type === "details") {
    isValid = val.length >= 10;
  }

  if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    if (errorElement) errorElement.style.display = "none";
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    if (errorElement) errorElement.style.display = "block";
  }

  return isValid;
}

function executeFormSubmission(form) {
  const statusElement = document.getElementById("formStatus");
  const submitButton = form.querySelector("button[type='submit']");
  
  // Enter loading state
  statusElement.className = "form-status loading";
  statusElement.textContent = "Routing planner information securely to counsel chambers...";
  submitButton.disabled = true;
  submitButton.style.opacity = "0.7";

  // Simulate remote processing lag
  setTimeout(() => {
    // Show premium success notification
    statusElement.className = "form-status success";
    statusElement.innerHTML = `
      <strong>Enquiry Registered Successfully!</strong><br>
      A Senior Advocate from Fortis Legal Solutions will contact you within 24 hours.
    `;
    
    // Reset fields and valid flags
    form.reset();
    const validatedInputs = form.querySelectorAll(".form-input");
    validatedInputs.forEach((input) => {
      input.classList.remove("valid");
    });
    
    submitButton.disabled = false;
    submitButton.style.opacity = "1";

    // Auto fadeout success block after 8 seconds
    setTimeout(() => {
      statusElement.style.display = "none";
    }, 8000);
  }, 1800);
}

/* ==========================================================================
   6. Technology Spotlight Mockup Chart Micro-interactions
   ========================================================================== */
function initTechMockupAnimation() {
  const chartBars = document.querySelectorAll(".chart-bar");
  if (chartBars.length === 0) return;

  // Periodically highlight random chart bars to represent analytical flow
  setInterval(() => {
    chartBars.forEach((bar) => bar.classList.remove("active"));
    
    const randomCount = Math.floor(Math.random() * 3) + 1; // Highlight 1-3 bars
    for (let i = 0; i < randomCount; i++) {
      const randomIndex = Math.floor(Math.random() * chartBars.length);
      chartBars[randomIndex].classList.add("active");
    }
  }, 2000);
}

/* ==========================================================================
   7. Scroll Reveal Animation Engine
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  
  if (revealElements.length === 0) return;

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });
}
