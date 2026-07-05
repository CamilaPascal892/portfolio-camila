// Inicialización de Partículas de Fondo
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 60,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "size": {
      "value": 3
    },
    "move": {
      "enable": true,
      "speed": 2
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    }
  }
});

// Selección de elementos DOM
const landingScreen = document.getElementById('landing-screen');
const mainCard = document.getElementById('main-card');
const btnConoceme = document.getElementById('btnConoceme');
const navLinks = document.querySelectorAll('.nav-link');
const secciones = document.querySelectorAll('.seccion');
const cardBody = document.querySelector('.card-body');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Variables para el Slider de Proyectos
let currentSlide = 0;
let filteredCards = [];

// Función para mostrar el panel principal (dashboard flotante)
const showDashboard = () => {
  if (!landingScreen.classList.contains('oculto')) {
    landingScreen.classList.add('oculto');
    
    setTimeout(() => {
      landingScreen.style.display = "none";
      mainCard.style.display = "flex";
      
      // Pequeño timeout para renderizado de display flex antes de calcular anchos
      setTimeout(() => {
        mainCard.classList.remove('oculto');
        initSlider();
      }, 50);
    }, 450);
  }
};

// --- GESTOS DE ENTRADA (RUEDA Y TOUCH) ---
window.addEventListener('wheel', (e) => {
  if (e.deltaY > 0) {
    showDashboard();
  }
});

let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  const touchEndY = e.touches[0].clientY;
  if (touchStartY - touchEndY > 30) { // Deslizar hacia arriba
    showDashboard();
  }
}, { passive: true });

// --- CONTROL DE PESTAÑAS (SPA) ---
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    // Cambiar sección activa
    secciones.forEach(sec => sec.classList.remove('active'));
    targetSection.classList.add('active');

    // Cambiar enlace activo
    navLinks.forEach(n => n.classList.remove('active'));
    link.classList.add('active');

    // Resetear el scroll del cuerpo de la tarjeta
    cardBody.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Si se activa proyectos, reinicializar slider para recalcular dimensiones
    if (targetId === 'proyectos') {
      setTimeout(initSlider, 100);
    }
  });
});

// --- CAROUSEL / SLIDER DE PROYECTOS CON FILTRADO A NIVEL DOM ---
let masterTarjetas = []; // Almacén en memoria para todas las tarjetas originales

const initSlider = () => {
  const track = document.querySelector('.slider-track');
  if (!track) return;

  // Guardar copia de las tarjetas en memoria en la primera ejecución
  if (masterTarjetas.length === 0) {
    masterTarjetas = Array.from(document.querySelectorAll('.tarjeta'));
  }

  const activeFilter = document.querySelector('.btn-filtro.active').getAttribute('data-filter');
  
  // Filtrar tarjetas
  filteredCards = masterTarjetas.filter(card => {
    const cat = card.getAttribute('data-category');
    return activeFilter === 'all' || cat === activeFilter;
  });

  // Limpiar el track físico y agregar únicamente las tarjetas que corresponden al filtro activo
  track.innerHTML = '';
  filteredCards.forEach(card => {
    track.appendChild(card);
  });

  currentSlide = 0;
  updateSliderPosition();
};

const updateSliderPosition = () => {
  const track = document.querySelector('.slider-track');
  if (!track || filteredCards.length === 0) return;

  const cardsVisible = window.innerWidth > 800 ? 2 : 1;
  const viewportWidth = document.querySelector('.slider-viewport').offsetWidth;
  const gap = 32; // Equivale a las 2rem de gap en CSS
  
  // Calculamos ancho individual de tarjeta
  const cardWidth = (viewportWidth - (cardsVisible - 1) * gap) / cardsVisible;

  // Seteamos el minWidth a cada tarjeta visible en el DOM
  filteredCards.forEach(card => {
    card.style.minWidth = `${cardWidth}px`;
    card.style.width = `${cardWidth}px`;
  });

  // Calculamos desplazamiento
  const offset = -currentSlide * (cardWidth + gap);
  track.style.transform = `translateX(${offset}px)`;

  // Habilitar/Deshabilitar botones de navegación
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide >= filteredCards.length - cardsVisible;
};

// Flechas del Slider
prevBtn.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSliderPosition();
  }
});

nextBtn.addEventListener('click', () => {
  const cardsVisible = window.innerWidth > 800 ? 2 : 1;
  if (currentSlide < filteredCards.length - cardsVisible) {
    currentSlide++;
    updateSliderPosition();
  }
});

// Recalcular posiciones si el navegador cambia de tamaño
window.addEventListener('resize', () => {
  if (mainCard.style.display === "flex") {
    updateSliderPosition();
  }
});

// --- LÓGICA DE MODAL Y FILTROS EN DOM ---
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal");
  const cerrarModal = document.getElementById("cerrarModal");

  // Botón Conoceme Más (Ingreso + Abrir Modal de una vez)
  btnConoceme.addEventListener("click", function (e) {
    e.preventDefault();
    showDashboard();
    modal.classList.add("mostrar");
  });

  cerrarModal.addEventListener("click", function () {
    modal.classList.remove("mostrar");
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("mostrar");
    }
  });

  // Filtros de Proyectos
  const botonesFiltro = document.querySelectorAll('.btn-filtro');

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(btn => btn.classList.remove('active'));
      boton.classList.add('active');

      // Reinicializamos slider, el cual filtrará y reordenará el DOM automáticamente
      initSlider();
    });
  });
});
