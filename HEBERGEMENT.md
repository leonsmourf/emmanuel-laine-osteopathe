# Guide d'hébergement du site

## Remplacer votre ancien site paris-osteopathe.com

### Option 1 : Hébergement GitHub Pages (Gratuit)

1. **Créer un repository GitHub**
   - Allez sur GitHub.com
   - Créez un nouveau repository : `emmanuel-laine-osteopathe`
   - Uploadez tous les fichiers de votre site

2. **Activer GitHub Pages**
   - Allez dans Settings → Pages
   - Source : "Deploy from a branch"
   - Branch : `main` ou `master`
   - Folder : `/ (root)`
   - Sauvegardez

3. **Configurer le domaine personnalisé**
   - Dans Settings → Pages
   - Ajoutez votre domaine : `paris-osteopathe.com`
   - Créez un fichier `CNAME` avec le contenu : `paris-osteopathe.com`

4. **Configurer DNS**
   - Chez votre registrar (OVH, etc.)
   - Ajoutez ces enregistrements DNS :
     ```
     Type: CNAME
     Nom: @
     Valeur: votre-username.github.io
     ```

### Option 2 : Hébergement traditionnel (OVH, etc.)

1. **Préparer les fichiers**
   - Tous les fichiers doivent être à la racine du site
   - Vérifiez que `index.html` est bien le fichier principal

2. **Uploader via FTP**
   - Connectez-vous à votre hébergement via FTP
   - Uploadez tous les fichiers dans le dossier `www` ou `public_html`

3. **Configurer Google Maps**
   - Ajoutez votre domaine dans les restrictions Google Cloud Console
   - Remplacez `YOUR_API_KEY` par votre vraie clé API

### Option 3 : Netlify (Gratuit)

1. **Connecter GitHub**
   - Allez sur Netlify.com
   - Connectez votre repository GitHub
   - Déployez automatiquement

2. **Configurer le domaine**
   - Ajoutez votre domaine personnalisé
   - Configurez les redirections DNS

## Configuration Google Maps pour la production

1. **Google Cloud Console**
   - Allez dans votre projet
   - Identifiants → Votre clé API
   - Restrictions d'application → Sites web HTTP
   - Ajoutez : `https://paris-osteopathe.com/*`

2. **Vérifier la facturation**
   - Assurez-vous que la facturation est activée
   - Configurez des alertes de budget

## Fichiers à vérifier avant déploiement

- ✅ `index.html` - Page d'accueil
- ✅ `faq.html` - Page FAQ
- ✅ `css/style.css` - Styles
- ✅ `js/script.js` - JavaScript
- ✅ `config.js` - Clé API Google Maps
- ✅ `CNAME` - Domaine personnalisé (si GitHub Pages)

## Test après déploiement

1. Vérifiez que le site s'affiche correctement
2. Testez la navigation
3. Vérifiez que Google Maps fonctionne
4. Testez les liens vers Doctolib
5. Vérifiez la responsivité sur mobile

## Support

En cas de problème :
- Vérifiez la console du navigateur (F12)
- Vérifiez les logs d'erreur de l'hébergeur
- Testez avec une clé API différente 