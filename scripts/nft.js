// Funktion zum Abrufen von NFT-Daten für ein bestimmtes Projekt
async function fetchNFTs() {
    const nftList = document.getElementById('nft-list');
    nftList.innerHTML = ''; // Galerie leeren

    // API-Endpunkt für die OpenSea-Assets mit API-Schlüssel im Header
    const apiUrl = `https://api.opensea.io/api/v1/assets?order_direction=desc&limit=10`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'X-API-KEY': '8982fb44fdfb4303a85526a1de38adf0' // API-Schlüssel im Header
            }
        });

        if (!response.ok) throw new Error(`Fehler: ${response.status}`);
        const data = await response.json();

        // Überprüfe, ob die Antwort die erwarteten NFT-Daten enthält
        if (data && Array.isArray(data.assets)) {
            displayNFTs(data.assets);
        } else {
            console.error('Unerwartete API-Antwort:', data);
            alert("Es wurden keine NFTs gefunden.");
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der NFT-Daten:', error);
        alert('NFT-Daten konnten nicht geladen werden. Bitte versuche es später erneut.');
    }
}

// Funktion zum Anzeigen der NFTs in der Galerie
function displayNFTs(nfts) {
    const nftList = document.getElementById('nft-list');

    nfts.forEach((nft) => {
        const nftCard = document.createElement('div');
        nftCard.classList.add('nft-card');

        const nftImage = document.createElement('img');
        nftImage.src = nft.image_url || 'assets/images/default-nft.png';
        nftImage.alt = nft.name || 'NFT';
        nftCard.appendChild(nftImage);

        const nftName = document.createElement('h4');
        nftName.textContent = nft.name || 'Unbekanntes NFT';
        nftCard.appendChild(nftName);

        // Preisinformationen (falls verfügbar)
        const nftPrice = document.createElement('p');
        const price = nft?.sell_orders?.[0]?.current_price || nft?.last_sale?.payment_token?.price;
        nftPrice.textContent = price ? `$${(price / 1e18).toFixed(2)}` : 'Preis nicht verfügbar';
        nftCard.appendChild(nftPrice);

        nftList.appendChild(nftCard);
    });
}

// Rufe die NFTs beim Laden der Seite ab
fetchNFTs();
