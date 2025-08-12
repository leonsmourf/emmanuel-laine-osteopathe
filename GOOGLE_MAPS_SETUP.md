# Configuration Google Maps

## Étapes pour configurer Google Maps

### 1. Créer une clé API Google Maps

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Maps JavaScript API"
4. Allez dans "Identifiants" → "Créer des identifiants" → "Clé API"
5. Copiez votre clé API

### 2. Configurer les restrictions de la clé API

1. Cliquez sur votre clé API dans la liste
2. Dans "Restrictions d'application", sélectionnez "Sites web HTTP"
3. Ajoutez votre domaine : `https://votre-domaine.com/*`
4. Pour le développement local, ajoutez : `http://localhost/*`
5. Sauvegardez

### 3. Configurer le fichier config.js

1. Copiez `config.example.js` vers `config.js`
2. Remplacez `YOUR_API_KEY` par votre vraie clé API :

```javascript
const GOOGLE_MAPS_API_KEY = 'AIzaSyC...votre-clé-api...';
```

### 4. Mettre à jour index.html

Remplacez `YOUR_API_KEY` dans le fichier `index.html` par votre vraie clé API :

```html
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC...votre-clé-api...&callback=initMap" async defer></script>
```

### 5. Sécurité

- Le fichier `config.js` est dans `.gitignore` pour éviter de committer la clé API
- Configurez des restrictions de domaine dans Google Cloud Console
- Surveillez l'utilisation dans Google Cloud Console

### 6. Facturation

- Google Maps propose un crédit gratuit de $200 par mois
- Pour un usage basique, c'est généralement suffisant
- Configurez des alertes pour éviter les dépassements

## Résolution des problèmes

Si la carte ne s'affiche pas :
1. Vérifiez que l'API est activée
2. Vérifiez les restrictions de domaine
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez que la facturation est activée 