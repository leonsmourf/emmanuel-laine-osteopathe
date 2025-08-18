// ===== WEATHER API FOR CYCLING =====
// Configuration
const WEATHER_API_KEY = '8e3b1c2a4d5f6e9b8a7c3d2e1f4g5h6i'; // Clé exemple - remplacer par une vraie
const PARIS_LAT = 48.8566;
const PARIS_LON = 2.3522;

// Initialiser la météo cycliste
document.addEventListener('DOMContentLoaded', function() {
    loadCyclingWeather();
    // Actualiser toutes les 30 minutes
    setInterval(loadCyclingWeather, 30 * 60 * 1000);
});

// Charger les données météo
async function loadCyclingWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${PARIS_LAT}&lon=${PARIS_LON}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Erreur météo:', error);
        displayWeatherFallback();
    }
}

// Afficher les données météo
function displayWeatherData(data) {
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].description;
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s vers km/h
    
    // Mise à jour des éléments
    document.getElementById('weather-temp').textContent = `${temp}°C`;
    document.getElementById('weather-condition').textContent = condition;
    document.getElementById('wind-speed').textContent = windSpeed;
    
    // Conseil cycliste
    const advice = getCyclingAdvice(temp, windSpeed, data.weather[0].main);
    updateCyclingStatus(advice);
}

// Générer un conseil cycliste
function getCyclingAdvice(temp, windSpeed, weatherMain) {
    if (temp < 5) {
        return { text: 'Trop froid', class: 'bg-warning' };
    } else if (temp > 30) {
        return { text: 'Très chaud', class: 'bg-warning' };
    } else if (windSpeed > 25) {
        return { text: 'Vent fort', class: 'bg-warning' };
    } else if (weatherMain === 'Rain') {
        return { text: 'Pluie', class: 'bg-danger' };
    } else if (temp >= 15 && temp <= 25 && windSpeed < 15) {
        return { text: 'Parfait !', class: 'bg-success' };
    } else {
        return { text: 'Correct', class: 'bg-info' };
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

// Affichage de secours (sans API)
function displayWeatherFallback() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulation basique selon l'heure
    let temp, condition, wind, advice;
    
    if (hour >= 6 && hour < 12) {
        temp = 18; condition = 'Ensoleillé'; wind = 8;
        advice = { text: 'Parfait !', class: 'bg-success' };
    } else if (hour >= 12 && hour < 18) {
        temp = 22; condition = 'Partiellement nuageux'; wind = 12;
        advice = { text: 'Correct', class: 'bg-info' };
    } else {
        temp = 15; condition = 'Nuageux'; wind = 6;
        advice = { text: 'Frais', class: 'bg-secondary' };
    }
    
    document.getElementById('weather-temp').textContent = `${temp}°C`;
    document.getElementById('weather-condition').textContent = condition;
    document.getElementById('wind-speed').textContent = wind;
    updateCyclingStatus(advice);
} 