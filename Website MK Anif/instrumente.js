document.getElementById('search-button').addEventListener('click', async () => {
    const input = document.getElementById('instrument-input').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Lädt...';

    try {
        const response = await fetch(`https://musicbrainz.org/ws/2/instrument/?query=${input}&fmt=json`);
        const data = await response.json();

        if (data.instruments && data.instruments.length > 0) {
            resultsDiv.innerHTML = data.instruments.map(inst => `
                <div class="instrument">
                    <h2>${inst.name}</h2>
                    <p>${inst.description || 'Keine Beschreibung verfügbar.'}</p>
                </div>
            `).join('');
        } else {
            resultsDiv.innerHTML = 'Keine Instrumente gefunden.';
        }
    } catch (error) {
        resultsDiv.innerHTML = 'Fehler beim Laden der Daten.';
        console.error(error);
    }
});
