let intervalId;
let currentTime;

function showTime(timeZone) {
  if (intervalId) clearInterval(intervalId);

  const now = new Date();
  const options = { timeZone: timeZone };
  const localeString = now.toLocaleString('en-US', options);
  currentTime = new Date(localeString);

  function updateClock() {
    currentTime.setSeconds(currentTime.getSeconds() + 1);

    const timeString = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    document.querySelector('.clock-container-clock-hour').textContent = timeString + ' HRS';
  }

  updateClock();
  intervalId = setInterval(updateClock, 1000);
}

// Cambiar entre modo día y modo noche
const toggleBtn = document.getElementById("toggleMode");
const clockIcon = document.getElementById("clock-icon");
const body = document.body;

toggleBtn.addEventListener("click", () => {
  if (body.classList.contains("night")) {
    body.classList.remove("night");
    body.classList.add("day");
    clockIcon.src = "./assets/sun.png"; // aquí pones tu icono de sol
    toggleBtn.textContent = "Cambiar a Modo Noche";
  } else {
    body.classList.remove("day");
    body.classList.add("night");
    clockIcon.src = "./assets/moon.png";
    toggleBtn.textContent = "Cambiar a Modo Día";
  }
});
