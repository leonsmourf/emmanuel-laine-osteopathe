# Transfert de domaine depuis Squarespace vers GitHub Pages

## Étape 1 : Préparer GitHub Pages

### 1.1 Créer un repository GitHub
1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur "New repository"
3. Nom : `emmanuel-laine-osteopathe`
4. Description : "Site web du cabinet d'ostéopathie d'Emmanuel Lainé"
5. Public ou Private (au choix)
6. Cliquez "Create repository"

### 1.2 Uploader les fichiers
1. Dans votre nouveau repository, cliquez "uploading an existing file"
2. Glissez-déposez tous les fichiers de votre site :
   - `index.html`
   - `faq.html`
   - `css/` (dossier)
   - `js/` (dossier)
   - `config.js`
   - `CNAME` (nous le créerons)
   - `README.md`
3. Cliquez "Commit changes"

### 1.3 Activer GitHub Pages
1. Allez dans Settings → Pages
2. Source : "Deploy from a branch"
3. Branch : `main` (ou `master`)
4. Folder : `/ (root)`
5. Cliquez "Save"

## Étape 2 : Configurer le domaine personnalisé

### 2.1 Créer le fichier CNAME
1. Dans votre repository, cliquez "Add file" → "Create new file"
2. Nom : `CNAME`
3. Contenu : `paris-osteopathe.com`
4. Cliquez "Commit new file"

### 2.2 Configurer dans GitHub Pages
1. Dans Settings → Pages
2. Section "Custom domain"
3. Entrez : `paris-osteopathe.com`
4. Cochez "Enforce HTTPS"
5. Cliquez "Save"

## Étape 3 : Transférer le domaine depuis Squarespace

### 3.1 Accéder à Squarespace
1. Connectez-vous à votre compte Squarespace
2. Allez dans Settings → Domains
3. Trouvez `paris-osteopathe.com`

### 3.2 Obtenir les informations DNS
1. Cliquez sur votre domaine
2. Allez dans "DNS Settings"
3. Notez les serveurs DNS actuels

### 3.3 Changer les serveurs DNS
**Option A : Utiliser les serveurs DNS de votre registrar**
1. Allez chez votre registrar (OVH, GoDaddy, etc.)
2. Trouvez les paramètres DNS de `paris-osteopathe.com`
3. Ajoutez ces enregistrements :
   ```
   Type: CNAME
   Nom: @
   Valeur: votre-username.github.io
   TTL: 3600
   ```

**Option B : Utiliser les serveurs DNS de GitHub**
1. Dans GitHub Pages, copiez les serveurs DNS fournis
2. Chez votre registrar, changez les serveurs DNS pour ceux de GitHub

## Étape 4 : Configurer Google Maps pour la production

### 4.1 Google Cloud Console
1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionnez votre projet
3. APIs & Services → Credentials
4. Cliquez sur votre clé API

### 4.2 Ajouter les restrictions
1. Section "Application restrictions"
2. Sélectionnez "HTTP referrers (web sites)"
3. Ajoutez ces domaines :
   ```
   https://paris-osteopathe.com/*
   https://www.paris-osteopathe.com/*
   http://localhost/*
   ```
4. Cliquez "Save"

## Étape 5 : Vérifier le déploiement

### 5.1 Attendre la propagation DNS
- Peut prendre 24-48 heures
- Vous pouvez vérifier avec : `nslookup paris-osteopathe.com`

### 5.2 Tester le site
1. Allez sur `https://paris-osteopathe.com`
2. Vérifiez que le site s'affiche
3. Testez la navigation
4. Vérifiez Google Maps
5. Testez les liens Doctolib

## Étape 6 : Annuler Squarespace

### 6.1 Sauvegarder le contenu
1. Exportez votre contenu Squarespace si nécessaire
2. Sauvegardez les images importantes

### 6.2 Annuler l'abonnement
1. Dans Squarespace, allez dans Billing
2. Annulez l'abonnement
3. Confirmez l'annulation

## Résolution des problèmes

### Le site ne s'affiche pas
1. Vérifiez que GitHub Pages est activé
2. Vérifiez le fichier CNAME
3. Attendez la propagation DNS

### Google Maps ne fonctionne pas
1. Vérifiez les restrictions de domaine dans Google Cloud Console
2. Vérifiez la console du navigateur (F12)
3. Assurez-vous que la facturation est activée

### Erreur 404
1. Vérifiez que `index.html` est à la racine
2. Vérifiez les permissions du repository
3. Attendez quelques minutes après les modifications

## Support

- **GitHub Pages** : [Documentation officielle](https://pages.github.com/)
- **Google Cloud Console** : [Support](https://cloud.google.com/support)
- **Squarespace** : [Support](https://support.squarespace.com/) 