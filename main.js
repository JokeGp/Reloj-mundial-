  let intervalId;
    let currentTime;

    function showTime(timeZone) {
      if (intervalId) clearInterval(intervalId);

      // Obtener la hora actual en la zona horaria seleccionada
      const now = new Date();
      const options = {timeZone: timeZone};
      const localeString = now.toLocaleString('en-US', options);
      currentTime = new Date(localeString);

      function updateClock() {
        // Incrementar un segundo
        currentTime.setSeconds(currentTime.getSeconds() + 1);

        // Mostrar la hora formateada
        const timeString = currentTime.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        });
        document.getElementById('clock').textContent = timeString + ' hrs (' + timeZone + ')';
        console.log(timeString + ' hrs (' + timeZone + ')');
      }

      updateClock();
      intervalId = setInterval(updateClock, 1000);
    }
