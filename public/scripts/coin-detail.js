// Initialisierung des TradingView-Charts
function initializeTradingViewChart(symbol) {
    new TradingView.widget({
        container_id: "tradingview-chart-container",
        width: "100%",
        height: 600,
        symbol: `BINANCE:${symbol}`,
        interval: "15",
        theme: "dark",
        style: "1",
        locale: "de",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: false,
        details: true,
        hotlist: true,
        calendar: true,
        studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"],
    });
}

// Coin-Daten laden und initialisieren
async function loadCoinData(coinId) {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/${coinId}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP-Error: ${response.status}`);
        
        const data = await response.json();
        document.getElementById("coin-name").textContent = `${data.name} (${data.symbol.toUpperCase()})`;
        initializeTradingViewChart(data.symbol.toUpperCase() + 'USDT');
        startWebSocket(data.symbol.toLowerCase() + 'usdt');
    } catch (error) {
        console.error("Fehler beim Abrufen der Coin-Daten:", error);
        alert("Fehler beim Laden der Coin-Daten. Bitte versuchen Sie es später erneut.");
    }
}

// WebSocket für Echtzeit-Handelsdaten starten
function startWebSocket(symbol) {
    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);

    socket.onmessage = (event) => {
        const trade = JSON.parse(event.data);
        updateTradeTable(trade);
    };

    socket.onclose = () => {
        console.log("WebSocket-Verbindung geschlossen. Versuche erneut zu verbinden...");
        setTimeout(() => startWebSocket(symbol), 1000); // Verbindung nach 1 Sekunde neu starten
    };
}

// Handelsdaten in der Tabelle anzeigen
function updateTradeTable(trade) {
    const tradeTableBody = document.getElementById("trade-data");

    // Neue Zeile für die Handelsdaten erstellen
    const price = trade.p < 0.01 ? parseFloat(trade.p).toFixed(10) : parseFloat(trade.p).toFixed(4);
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${new Date(trade.T).toLocaleTimeString()}</td>
        <td class="${trade.m ? "trade-sell" : "trade-buy"}">${trade.m ? "Verkauf" : "Kauf"}</td>
        <td>${parseFloat(trade.q).toFixed(4)}</td>
        <td>$${price}</td>
    `;

    // Neue Zeile oben hinzufügen
    tradeTableBody.prepend(row);

    // Halte die Tabelle auf maximal 20 Einträge
    if (tradeTableBody.rows.length > 20) {
        tradeTableBody.deleteRow(-1);
    }
}

// Beispielaufruf für die Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const coinId = urlParams.get("coinId");
    loadCoinData(coinId);
});

// Funktion zur Anzeige der Hotlist mit den Top-Gewinnern aus `localStorage`
function updateHotlist() {
    const hotlistElement = document.getElementById('top-list');
    const hotlistData = JSON.parse(localStorage.getItem('topGainers')) || [];

    if (!hotlistElement) return;
    hotlistElement.innerHTML = '';

    hotlistData.forEach((coin) => {
        const listItem = document.createElement('li');
        listItem.classList.add('coin-item');

        const coinLink = document.createElement('a');
        coinLink.href = `pages/coin-detail.html?coinId=${coin.id}`;
        coinLink.style.color = 'inherit';
        coinLink.style.textDecoration = 'none';

        // Formatieren des Preises abhängig von der Höhe
        let displayPrice;
        if (coin.current_price < 0.01) {
            displayPrice = coin.current_price.toPrecision(4); // Zeigt vier signifikante Stellen an
        } else {
            displayPrice = coin.current_price.toFixed(2); // Zeigt zwei Dezimalstellen an
        }

        coinLink.textContent = `${coin.name} - $${displayPrice}`;

        const changeElement = document.createElement('span');
        changeElement.textContent = ` (${coin.price_change_percentage_24h > 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%)`;
        changeElement.classList.add(coin.price_change_percentage_24h > 0 ? 'coin-gain' : 'coin-loss');

        listItem.appendChild(coinLink);
        listItem.appendChild(changeElement);
        hotlistElement.appendChild(listItem);
    });
}

// Initialer Aufruf und Intervall für das automatische Update der Hotlist alle 10 Sekunden
updateHotlist();
setInterval(updateHotlist, 10000);
