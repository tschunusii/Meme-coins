// Anzahl der Coins, die wir als Gewinner oder Verlierer anzeigen wollen
const coinsPerList = 20;

async function fetchGainersAndLosers() {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Sortiere die Daten nach 24h-Preisänderung
        const sortedData = data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        const topGainers = sortedData.slice(0, coinsPerList);
        const topLosers = sortedData.slice(-coinsPerList).reverse();

        // Aufruf der displayCoins-Funktion, um die Daten anzuzeigen
        displayCoins(topGainers, 'gainers-list');
        displayCoins(topLosers, 'losers-list');
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
        alert('Daten konnten nicht geladen werden. Bitte versuche es später erneut.');
    }
}

// Funktion zur Anzeige der Coins mit dynamischer Präzision
function formatCoinValue(value) {
    if (value >= 0.01) {
        return value.toFixed(2);
    } else {
        const formattedValue = parseFloat(value.toPrecision(4));
        return formattedValue.toString();
    }
}

// Funktion zum Anzeigen von Coins in der Liste (Gainer oder Loser)
function displayCoins(coins, listId) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '';

    coins.forEach((coin) => {
        const row = document.createElement('tr');
        const displayPrice = formatCoinValue(coin.current_price);

        row.innerHTML = `
            <td>${coin.market_cap_rank || 'N/A'}</td>
            <td><a href="coin-detail.html?coinId=${coin.id}" style="color: inherit; text-decoration: none;">${coin.name} (${coin.symbol.toUpperCase()})</a></td>
            <td>$${displayPrice}</td>
            <td class="${coin.price_change_percentage_24h > 0 ? 'coin-gain' : 'coin-loss'}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
        `;

        listElement.appendChild(row);
    });
}

// Initialer Aufruf zum Abrufen und Anzeigen der Gewinner und Verlierer
fetchGainersAndLosers();