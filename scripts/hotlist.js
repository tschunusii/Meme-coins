document.addEventListener("DOMContentLoaded", function () {
    const topList = document.getElementById("top-list");

    // Funktion, um die Top-12-Gewinner von gainers-losers.html zu holen
    fetch('https://tschunusii.github.io/Meme-coins/pages/gainers-losers.html')
        .then(response => response.text())
        .then(html => {
            // HTML-Dokument parsen
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            // Die Gewinner-Tabelle finden und die ersten 12 Zeilen extrahieren
            const rows = doc.querySelectorAll("table:nth-of-type(1) tr");
            const topGainers = Array.from(rows).slice(1, 13); // Überspringt die Kopfzeile und nimmt die ersten 12 Einträge

            // Daten zur Hotlist hinzufügen
            topGainers.forEach((row, index) => {
                const cells = row.querySelectorAll("td");
                const rank = index + 1; // Platzierung
                const logoUrl = `https://path_to_logo/${cells[1].textContent.trim().toLowerCase()}.png`; // Beispiel: URL für das Logo
                const nameAbbreviation = cells[1].textContent.trim();
                const changePercent = cells[3].textContent.trim();

                // Listenelement für jeden Gainer erstellen
                const listItem = document.createElement("li");
                listItem.classList.add("coin-item");

                // Inhalt des Listenelements
                listItem.innerHTML = `
                    <span>#${rank}</span>
                    <img src="${logoUrl}" alt="${nameAbbreviation} Logo" style="width: 20px; height: 20px; margin-right: 5px;">
                    <span>${nameAbbreviation}</span>
                    <span class="${parseFloat(changePercent) >= 0 ? 'coin-gain' : 'coin-loss'}">${changePercent}</span>
                `;

                topList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Fehler beim Laden der Gewinner-Liste:', error));

    // Funktion, um die Animation zurückzusetzen
    function resetAnimation() {
        topList.style.animation = "none"; // Animation anhalten
        void topList.offsetWidth;         // Neu rendern erzwingen
        topList.style.animation = "scroll 60s linear infinite"; // Animation neu starten
    }

    // Liste bei jedem Zyklus aktualisieren und von vorne starten
    topList.addEventListener("animationiteration", resetAnimation);
});
