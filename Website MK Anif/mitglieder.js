async function loadTable() {
  try {
      // JSON-Datei laden
      const response = await fetch('mitglieder.json');
      if (!response.ok) {
          throw new Error(`Fehler beim Laden der Datei: ${response.status}`);
      }
      const data = await response.json();

      // Tabelle befüllen
      const tbody = document.querySelector("#dataTable tbody");
      tbody.innerHTML = ''; // Vorhandene Zeilen entfernen

      data.forEach(item => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${item.Vorname}</td>
              <td>${item.Nachname}</td>
              <td>${item.Register}</td>
          `;
          tbody.appendChild(row);
      });
  } catch (error) {
      console.error("Fehler:", error);
      const tbody = document.querySelector("#dataTable tbody");
      tbody.innerHTML = '<tr><td colspan="3" style="color: red;">Fehler beim Laden der Daten</td></tr>';
  }
}

// Tabelle rendern
loadTable();


var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}
