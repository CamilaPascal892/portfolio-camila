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

// Selecciona todos los links del menú
const navLinks = document.querySelectorAll('.nav-link');
const secciones = document.querySelectorAll('.seccion');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (!targetSection) return;

    // Mostrar contenido oculto si está oculto
    const contenido = document.getElementById('contenido-oculto');
    if (contenido.style.display === "none" || contenido.style.display === "") {
      contenido.style.display = "block";
      secciones.forEach((sec, i) => {
        setTimeout(() => {
          sec.classList.add("visible");
        }, i * 200);
      });
    }

    // Scroll suave
    targetSection.scrollIntoView({ behavior: 'smooth' });

    // Actualizar clase active en menú
    navLinks.forEach(n => n.classList.remove('active'));
    link.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY + window.innerHeight / 3;
  secciones.forEach(sec => {
    if (scrollPos > sec.offsetTop) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const btnConoceme = document.getElementById("btnConoceme");
  const modal = document.getElementById("modal");
  const cerrarModal = document.getElementById("cerrarModal");

  btnConoceme.addEventListener("click", function (e) {
    e.preventDefault();
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
});

