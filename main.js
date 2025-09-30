let userTimezone = null;
let intervalId = null;

// Mapa de fallback para offsets que no son zonas IANA
const timezoneFallback = {
  "UTC+12:00": "Pacific/Auckland",
  "UTC+11:00": "Pacific/Noumea",
  "UTC+10:00": "Australia/Sydney",
  "UTC+09:30": "Australia/Adelaide",
  "UTC+09:00": "Asia/Tokyo",
  "UTC+08:00": "Asia/Shanghai",
  "UTC+07:00": "Asia/Bangkok",
  "UTC+06:00": "Asia/Almaty",
  "UTC+05:30": "Asia/Kolkata",
  "UTC+05:00": "Asia/Karachi",
  "UTC+04:00": "Asia/Dubai",
  "UTC+03:00": "Europe/Moscow",
  "UTC+02:00": "Europe/Athens",
  "UTC+01:00": "Europe/Paris",
  "UTC+00:00": "Europe/London",
  "UTC-01:00": "Atlantic/Azores",
  "UTC-02:00": "America/Noronha",
  "UTC-03:00": "America/Sao_Paulo",
  "UTC-04:00": "America/Caracas",
  "UTC-05:00": "America/New_York",
  "UTC-06:00": "America/Mexico_City",
  "UTC-07:00": "America/Denver",
  "UTC-08:00": "America/Los_Angeles",
  "UTC-09:00": "America/Anchorage",
  "UTC-10:00": "Pacific/Honolulu"
};

// Detecta ubicación inicial automáticamente
async function detectarUbicacionYConfigurar() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    actualizarZonaHoraria(data.timezone, data.country_code.toLowerCase(), data.country_name);
  } catch (err) {
    console.error("Error detectando ubicación:", err);
  }
}

// Función central que actualiza todo
function actualizarZonaHoraria(timeZone, countryCode, countryName) {
  userTimezone = timeZone;

  // Zona horaria en el título
  document.querySelector(".clock-container-timezone-title").textContent = `Zona horaria ${timeZone}`;

  // País + bandera
  const countryElement = document.getElementById("countryDisplay");
  countryElement.innerHTML = `<img src="https://flagcdn.com/${countryCode}.svg" alt="Bandera"> ${countryName}`;

  // Actualizar tema según hora
  actualizarTema();

  // Iniciar el reloj
  iniciarReloj();
}

function iniciarReloj() {
  if (intervalId) clearInterval(intervalId);

  function updateClock() {
    if (!userTimezone) return;

    try {
      const ahora = new Date().toLocaleString("en-US", { timeZone: userTimezone });
      const fecha = new Date(ahora);

      const horas = fecha.getHours().toString().padStart(2, "0");
      const minutos = fecha.getMinutes().toString().padStart(2, "0");
      const segundos = fecha.getSeconds().toString().padStart(2, "0");

      document.querySelector(".clock-container-clock-hour").textContent = `${horas}:${minutos}:${segundos} hrs`;
    } catch (err) {
      console.error("Error actualizando reloj:", err);
    }
  }

  updateClock();
  intervalId = setInterval(updateClock, 1000);
}

function actualizarTema() {
  if (!userTimezone) return;

  try {
    const ahora = new Date().toLocaleString("en-US", { timeZone: userTimezone });
    const fecha = new Date(ahora);
    const hora = fecha.getHours();

    if (hora >= 6 && hora < 18) {
      document.body.classList.add("day");
      document.body.classList.remove("night");
      document.getElementById("clock-icon").src = "./assets/sun.png";
    } else {
      document.body.classList.add("night");
      document.body.classList.remove("day");
      document.getElementById("clock-icon").src = "./assets/moon.png";
    }
  } catch (err) {
    console.error("Error actualizando tema:", err);
  }
}

// select 
document.getElementById("country").addEventListener("change", (e) => {
  const tz = e.target.value;
  const countryCode = e.target.options[e.target.selectedIndex].dataset.country;
  const countryName = e.target.options[e.target.selectedIndex].textContent;

  actualizarZonaHoraria(tz, countryCode, countryName);
});

//Input
document.getElementById("countryInput").addEventListener("change", async (e) => {
  const countryName = e.target.value.trim();
  if (!countryName) return;

  try {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=false`);
    const data = await res.json();

    if (data && data[0]) {
      const countryCode = data[0].cca2.toLowerCase();

      // Elegir zona IANA válida o usar fallback
      let tz = data[0].timezones[0];
      if (!tz.includes("/")) {
        tz = timezoneFallback[tz];
        if (!tz) {
          alert("No se encontró una zona horaria válida para este país. Usa el selector.");
          return;
        }
      }

      actualizarZonaHoraria(tz, countryCode, data[0].name.common);
    }
  } catch (err) {
    console.error("No se pudo obtener info del país:", err);
  }
});

// Función para animar nubes
function animarNubes() {
  const left = document.querySelector(".cloud-left");
  const right = document.querySelector(".cloud-right");

  left.style.animation = "none";
  right.style.animation = "none";

  // Reforzar reflow para reiniciar animación
  void left.offsetWidth;
  void right.offsetWidth;

  left.style.animation = "moveCloudLeft 2s ease forwards";
  right.style.animation = "moveCloudRight 2s ease forwards";
}

// Actualizar tema + animar nubes
function actualizarTema() {
  if (!userTimezone) return;

  try {
    const ahora = new Date().toLocaleString("en-US", { timeZone: userTimezone });
    const fecha = new Date(ahora);
    const hora = fecha.getHours();

    if (hora >= 6 && hora < 18) {
      document.body.classList.add("day");
      document.body.classList.remove("night");
      document.getElementById("clock-icon").src = "./assets/sun.png";
    } else {
      document.body.classList.add("night");
      document.body.classList.remove("day");
      document.getElementById("clock-icon").src = "./assets/moon.png";
    }

    animarNubes();
  } catch (err) {
    console.error("Error actualizando tema:", err);
  }
}


// --- Inicialización automática ---
detectarUbicacionYConfigurar();
setInterval(actualizarTema, 5 * 60 * 1000); 
