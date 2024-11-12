const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fetch = require('node-fetch'); // Falls node-fetch verwendet wird

app.use(express.json());
app.use(express.static('public'));

// CORS-Proxy-Route für CoinGecko
app.get('/api/memecoins', async (req, res) => {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d');
        const data = await response.json();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        console.error("Fehler beim Abrufen der CoinGecko-Daten:", error);
        res.status(500).send('Fehler beim Abrufen der Daten');
    }
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
