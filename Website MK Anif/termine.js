const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
    "August", "September", "Oktober", "November", "Dezember"];

const renderCalendar = async () => {
    const firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        const isToday = i === date.getDate() && currMonth === new Date().getMonth()
        && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;

    await highlightAllEvents(); // Alle Events hervorheben
};

async function fetchEvents() {
    try {
        const response = await fetch('termine.json');
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Datei: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fehler beim Abrufen der Events:", error);
        return [];
    }
}

async function highlightAllEvents() {
    const events = await fetchEvents();
    const daysList = document.querySelectorAll(".days li");

    events.forEach(event => {
        const eventDate = new Date(event.Starts);
        if (eventDate.getFullYear() === currYear && eventDate.getMonth() === currMonth) {
            const dayIndex = eventDate.getDate() - 1;
            const dayElement = daysList[dayIndex];
            if (dayElement) {
                dayElement.classList.add("event-day");
                dayElement.dataset.tooltip = `${event.Title}\nOrt: ${event.Location}`;
            }
        }
    });
}

// Tooltip einmal erstellen und wiederverwenden
const tooltip = document.createElement('div');
tooltip.className = 'tooltip';
tooltip.style.position = 'absolute';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

document.body.addEventListener('mouseover', (e) => {
    if (e.target.classList.contains('event-day')) {
        // Tooltip sichtbar machen und Text setzen
        tooltip.style.display = 'block';
        tooltip.innerText = e.target.dataset.tooltip;

        // Position des Tooltips setzen
        tooltip.style.left = `${e.pageX}px`;
        tooltip.style.top = `${e.pageY - 40}px`;

        // Tooltip-Position bei Mausbewegung aktualisieren
        e.target.addEventListener('mousemove', (ev) => {
            tooltip.style.left = `${ev.pageX}px`;
            tooltip.style.top = `${ev.pageY - 40}px`;
        });
    }
});

document.body.addEventListener('mouseout', (e) => {
    if (e.target.classList.contains('event-day')) {
        tooltip.style.display = 'none';
    }
});

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

renderCalendar();
