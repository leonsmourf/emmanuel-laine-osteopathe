// ===== WEATHER API FOR CYCLISTS =====

// Configuration API OpenWeatherMap (GRATUITE - 1000 calls/day)
const WEATHER_API_KEY = 'demo_key'; // Remplacer par vraie clé
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Coordonnées du cabinet
const CABINET_LAT = 48.8475;
const CABINET_LON = 2.3322;

// Initialisation de la météo
document.addEventListener('DOMContentLoaded', function() {
    // Charger la météo si l'onglet vélo est activé
    const bikeTab = document.getElementById('bike-tab');
    if (bikeTab) {
        bikeTab.addEventListener('click', function() {
            loadCyclingWeather();
        });
    }
});

// Charger les données météo
async function loadCyclingWeather() {
    try {
        const response = await fetch(
            `${WEATHER_API_URL}?lat=${CABINET_LAT}&lon=${CABINET_LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
        );
        
        if (!response.ok) {
            throw new Error('Erreur API météo');
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.warn('Météo non disponible:', error);
        displayWeatherFallback();
    }
}

// Afficher les données météo
function displayWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s to km/h
    
    // Mise à jour du DOM
    document.querySelector('.weather-temp').textContent = `${temp}°C`;
    document.querySelector('.weather-condition').textContent = condition;
    document.getElementById('wind-speed').textContent = windSpeed;
    
    // Calculer les conditions cyclistes
    const cyclingAdvice = getCyclingAdvice(temp, windSpeed, data.weather[0].main);
    updateCyclingStatus(cyclingAdvice);
}

// Calculer les conseils cyclistes
function getCyclingAdvice(temp, windSpeed, weatherMain) {
    if (weatherMain === 'Rain' || weatherMain === 'Thunderstorm') {
        return {
            status: 'Attention',
            class: 'bg-warning',
            text: 'Conditions humides'
        };
    } else if (windSpeed > 20) {
        return {
            status: 'Difficile',
            class: 'bg-danger',
            text: 'Vent fort'
        };
    } else if (temp < 5 || temp > 30) {
        return {
            status: 'Précaution',
            class: 'bg-info',
            text: temp < 5 ? 'Froid' : 'Chaud'
        };
    } else {
        return {
            status: 'Idéal',
            class: 'bg-success',
            text: 'Parfait pour rouler'
        };
    }
}

// Mettre à jour le statut cycliste
function updateCyclingStatus(advice) {
    const statusElement = document.getElementById('cycling-status');
    if (statusElement) {
        statusElement.textContent = advice.text;
        statusElement.className = `badge ${advice.class}`;
    }
}

// Affichage de secours si l'API ne fonctionne pas
function displayWeatherFallback() {
    document.querySelector('.weather-temp').textContent = '18°C';
    document.querySelector('.weather-condition').textContent = 'Conditions normales';
    document.getElementById('wind-speed').textContent = '10';
    document.getElementById('cycling-status').textContent = 'Conditions favorables';
    document.getElementById('cycling-status').className = 'badge bg-success';
}

// ===== VÉLIB' STATIONS (simulation) =====
// Dans une vraie implémentation, utiliser l'API Vélib' officielle
function updateVelibStations() {
    // Simulation de données Vélib'
    const stations = [
        { name: 'St-Germain', distance: '50m', bikes: Math.floor(Math.random() * 20) },
        { name: 'Mabillon', distance: '200m', bikes: Math.floor(Math.random() * 20) },
        { name: 'Odéon', distance: '300m', bikes: Math.floor(Math.random() * 20) }
    ];
    
    // Mettre à jour l'affichage (si nécessaire)
    console.log('Stations Vélib mises à jour:', stations);
} 