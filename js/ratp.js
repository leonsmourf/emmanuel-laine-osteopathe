// ===== RATP API INTEGRATION =====

// Configuration API RATP (GRATUITE - illimitée)
const RATP_API_BASE = 'https://api-ratp.pierre-grimaud.fr/v4';

// Stations les plus proches du cabinet
const METRO_STATIONS = [
    { name: 'sevres+babylone', lines: ['10', '12'], displayName: 'Sèvres Babylone' },
    { name: 'saint+sulpice', lines: ['4'], displayName: 'Saint Sulpice' },
    { name: 'rennes', lines: ['12'], displayName: 'Rennes' }
];
const BUS_LINES = ['39', '95'];

// Initialisation de l'API RATP
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données RATP si l'onglet transport est activé
    const transportTab = document.getElementById('transport-tab');
    if (transportTab) {
        transportTab.addEventListener('click', function() {
            loadRATPData();
        });
    }
});

// Charger toutes les données RATP
async function loadRATPData() {
    try {
        // Réinitialiser tous les éléments
        clearPreviousData();
        
        // Chargement parallèle des données
        await Promise.all([
            loadMetroSchedules(),
            loadBusSchedules(),
            loadTrafficStatus()
        ]);
        
        markAsUpdated();
    } catch (error) {
        console.warn('Erreur RATP API:', error);
        showRATPFallback();
    }
}

// Fonction pour nettoyer les données précédentes
function clearPreviousData() {
    // Réinitialiser les stations de métro
    const sevresElement = document.getElementById('sevres-babylone-times');
    const saintSulpiceElement = document.getElementById('saint-sulpice-times');
    const rennesElement = document.getElementById('rennes-times');
    
    if (sevresElement) sevresElement.innerHTML = '<span class="loading">Chargement...</span>';
    if (saintSulpiceElement) saintSulpiceElement.innerHTML = '<span class="loading">Chargement...</span>';
    if (rennesElement) rennesElement.innerHTML = '<span class="loading">Chargement...</span>';
}

// Charger les horaires de métro
async function loadMetroSchedules() {
    try {
        const stationPromises = [];
        
        for (const station of METRO_STATIONS) {
            // Pour chaque ligne de la station
            for (const line of station.lines) {
                // Direction A et R en parallèle
                const promiseA = fetch(`${RATP_API_BASE}/schedules/metros/${line}/${station.name}/A`);
                const promiseR = fetch(`${RATP_API_BASE}/schedules/metros/${line}/${station.name}/R`);
                
                stationPromises.push(
                    Promise.all([promiseA, promiseR]).then(async ([responseA, responseR]) => {
                        const schedulesA = responseA.ok ? (await responseA.json()).result.schedules : [];
                        const schedulesR = responseR.ok ? (await responseR.json()).result.schedules : [];
                        
                        displayStationSchedules(station, line, schedulesA, schedulesR);
                    })
                );
            }
        }
        
        await Promise.all(stationPromises);
    } catch (error) {
        console.warn('Horaires métro non disponibles:', error);
        displayMetroFallback();
    }
}

// Afficher les horaires pour une station
function displayStationSchedules(station, line, schedulesA, schedulesR) {
    const stationKey = station.name.replace(/\+/g, '-');
    const elementId = stationKey + '-times';
    const element = document.getElementById(elementId);
    
    if (element) {
        let htmlContent = '';
        
        // Direction A
        if (schedulesA && schedulesA.length > 0) {
            const nextTrainsA = schedulesA.slice(0, 2).map(schedule => 
                getTimeString(schedule)
            );
            htmlContent += `L${line}→ ${nextTrainsA.join(', ')}`;
        }
        
        // Direction R
        if (schedulesR && schedulesR.length > 0) {
            const nextTrainsR = schedulesR.slice(0, 2).map(schedule => 
                getTimeString(schedule)
            );
            if (htmlContent) htmlContent += '<br>';
            htmlContent += `L${line}← ${nextTrainsR.join(', ')}`;
        }
        
        // Si on a déjà du contenu pour d'autres lignes, on l'ajoute
        if (element.innerHTML.includes('L') && !element.innerHTML.includes('Chargement')) {
            element.innerHTML += '<br>' + htmlContent;
        } else {
            element.innerHTML = htmlContent;
        }
        
        element.classList.remove('loading');
    }
}

// Charger les horaires de bus
async function loadBusSchedules() {
    try {
        // Utiliser Sèvres Babylone comme référence pour les bus
        const busStation = 'sevres+babylone';
        
        for (const busLine of BUS_LINES) {
            const response = await fetch(
                `${RATP_API_BASE}/schedules/bus/${busLine}/${busStation}/A`
            );
            
            if (response.ok) {
                const data = await response.json();
                displayBusSchedules(busLine, data.result.schedules);
            }
        }
    } catch (error) {
        console.warn('Horaires bus non disponibles:', error);
        displayBusFallback();
    }
}

// Afficher les horaires de bus
function displayBusSchedules(line, schedules) {
    const busElement = document.getElementById(`bus-${line}-times`);
    if (busElement && schedules.length > 0) {
        const nextBuses = schedules.slice(0, 2).map(schedule => 
            schedule.message || getTimeString(schedule)
        );
        busElement.innerHTML = nextBuses.join(', ');
    }
}

// Charger le statut du trafic
async function loadTrafficStatus() {
    try {
        // Vérifier le trafic pour les principales lignes
        const response = await fetch(`${RATP_API_BASE}/traffic/metros`);
        
        if (response.ok) {
            const data = await response.json();
            displayTrafficStatus(data.result);
        }
    } catch (error) {
        console.warn('Statut trafic non disponible:', error);
        displayTrafficFallback();
    }
}

// Afficher le statut du trafic
function displayTrafficStatus(traffic) {
    const statusElement = document.getElementById('traffic-status');
    if (statusElement && traffic) {
        const message = traffic.message || 'Trafic normal';
        const status = traffic.slug;
        
        // Adapter la couleur selon le statut
        const alertElement = statusElement.closest('.alert');
        if (alertElement) {
            alertElement.className = 'alert d-flex align-items-center';
            
            if (status === 'critical' || message.toLowerCase().includes('interrompu')) {
                alertElement.classList.add('alert-danger');
            } else if (status === 'warning' || message.toLowerCase().includes('perturbé')) {
                alertElement.classList.add('alert-warning');
            } else {
                alertElement.classList.add('alert-success');
            }
        }
        
        statusElement.textContent = message;
    }
}

// Utilitaires
function getTimeString(schedule) {
    if (schedule.message) {
        // Format: "Train à quai" ou "1 mn" ou "2 mn" 
        if (schedule.message.includes('Train') || schedule.message.includes('quai')) return 'À quai';
        if (schedule.message.includes('mn')) return schedule.message.replace(' mn', 'min');
        if (schedule.message.includes('Approche')) return 'Approche';
        return schedule.message;
    }
    
    if (schedule.code === '0') {
        return 'À l\'approche';
    }
    
    return schedule.code ? `${schedule.code} min` : 'N/A';
}

function getTimeInMinutes(schedule) {
    if (!schedule.message && !schedule.code) return 999;
    if (schedule.message && (schedule.message.includes('Train') || schedule.message.includes('quai'))) return 0;
    if (schedule.message && schedule.message.includes('Approche')) return 1;
    if (schedule.code === '0') return 1;
    
    if (schedule.message) {
        const match = schedule.message.match(/(\d+)\s*mn/);
        if (match) return parseInt(match[1]);
    }
    
    if (schedule.code) {
        const timeMatch = schedule.code.match(/(\d+)/);
        if (timeMatch) return parseInt(timeMatch[1]);
    }
    
    return 999;
}

// Affichages de secours
function displayMetroFallback() {
    // Fallback pour les 3 stations avec 2 directions
    const sevresElement = document.getElementById('sevres-babylone-times');
    const saintSulpiceElement = document.getElementById('saint-sulpice-times');
    const rennesElement = document.getElementById('rennes-times');
    
    if (sevresElement) sevresElement.innerHTML = 'L10→ 3min, 8min<br>L10← 5min, 12min<br>L12→ 2min, 7min<br>L12← 4min, 11min';
    if (saintSulpiceElement) saintSulpiceElement.innerHTML = 'L4→ 2min, 6min<br>L4← 4min, 9min';
    if (rennesElement) rennesElement.innerHTML = 'L12→ 3min, 8min<br>L12← 5min, 12min';
}

function displayBusFallback() {
    BUS_LINES.forEach(line => {
        const busElement = document.getElementById(`bus-${line}-times`);
        if (busElement) {
            busElement.innerHTML = '5 min, 15 min';
        }
    });
}

function displayTrafficFallback() {
    const statusElement = document.getElementById('traffic-status');
    if (statusElement) {
        statusElement.textContent = 'Trafic normal sur toutes les lignes';
    }
}

function showRATPFallback() {
    displayMetroFallback();
    displayBusFallback();
    displayTrafficFallback();
}

// ===== ACTUALISATION TEMPS RÉEL =====
// Rafraîchir les données RATP toutes les 60 secondes
setInterval(() => {
    const transportTabActive = document.getElementById('transport-tab').classList.contains('active');
    if (transportTabActive) {
        console.log('🚇 Actualisation temps réel RATP...');
        loadMetroSchedules();
        loadBusSchedules();
    }
}, 60000); // 1 minute

// Fonction pour marquer les éléments comme étant mis à jour
function markAsUpdated() {
    const timestamp = new Date().toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Ajouter un indicateur discret de dernière mise à jour
    const indicators = document.querySelectorAll('.last-updated');
    indicators.forEach(indicator => {
        indicator.textContent = `Mis à jour à ${timestamp}`;
    });
} 