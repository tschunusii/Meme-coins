document.addEventListener("DOMContentLoaded", function () {
    const topList = document.getElementById("top-list");

    // Funktion, um die Animation zurückzusetzen
    function resetAnimation() {
        topList.style.animation = "none"; // Animation anhalten
        void topList.offsetWidth;         // Neu rendern erzwingen
        topList.style.animation = "scroll 60s linear infinite"; // Animation neu starten
    }

    // Liste bei jedem Zyklus aktualisieren und von vorne starten
    topList.addEventListener("animationiteration", function () {
        resetAnimation(); // Setzt die Animation jedes Mal zurück, wenn sie endet
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const topList = document.getElementById("top-list");

    // Funktion, um die Animation zu starten und zu aktualisieren
    function resetAnimation() {
        topList.style.animation = "none"; // Animation anhalten
        void topList.offsetWidth;         // Neu rendern erzwingen
        topList.style.animation = "scroll 60s linear infinite"; // Animation neu starten
    }

    // Startet das Laufband neu, wenn ein Zyklus endet
    topList.addEventListener("animationiteration", function () {
        resetAnimation(); // Animation zurücksetzen
    });
});
