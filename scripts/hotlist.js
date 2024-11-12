document.addEventListener("DOMContentLoaded", function () {
    const topList = document.getElementById("top-list");

    fetch('https://tschunusii.github.io/Meme-coins/pages/gainers-losers.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");

            const rows = doc.querySelectorAll("table:nth-of-type(1) tr");
            const topGainers = Array.from(rows).slice(1, 13);

            topGainers.forEach((row, index) => {
                const cells = row.querySelectorAll("td");
                if (cells.length >= 4) {
                    const rank = index + 1;
                    const logoUrl = `https://path_to_logo/${cells[1].textContent.trim().toLowerCase()}.png`;
                    const nameAbbreviation = cells[1].textContent.trim();
                    const changePercent = cells[3].textContent.trim();

                    const listItem = document.createElement("li");
                    listItem.classList.add("coin-item");

                    listItem.innerHTML = `
                        <span>#${rank}</span>
                        <img src="${logoUrl}" alt="${nameAbbreviation} Logo" style="width: 20px; height: 20px; margin-right: 5px;">
                        <span>${nameAbbreviation}</span>
                        <span class="${parseFloat(changePercent) >= 0 ? 'coin-gain' : 'coin-loss'}">${changePercent}</span>
                    `;

                    topList.appendChild(listItem);
                }
            });
        })
        .catch(error => console.error('Fehler beim Laden der Gewinner-Liste:', error));

    function resetAnimation() {
        topList.style.animation = "none";
        void topList.offsetWidth;
        topList.style.animation = "scroll 60s linear infinite";
    }

    topList.addEventListener("animationiteration", resetAnimation);
});
