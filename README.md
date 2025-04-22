# Interface de Traduction Brives

Une interface web pour visualiser et comparer les traductions et corrections effectuées sur le site de Brives.

## Fonctionnalités

- Affichage des pages modifiées avec leurs traductions
- Filtrage par langue (néerlandais/anglais)
- Comparaison visuelle des différences entre traductions et corrections
- Accès direct aux pages modifiées
- Interface intuitive et responsive

## Installation

1. Installer Node.js si ce n'est pas déjà fait
2. Installer le serveur HTTP :
   ```bash
   npm install -g http-server
   ```
3. Placer le fichier `translations.json` dans le même dossier que les autres fichiers

## Utilisation

1. Lancer le serveur :
   ```bash
   http-server -p 8080 --cors
   ```
2. Ouvrir un navigateur et accéder à :
   ```
   http://localhost:8080
   ```

## Structure du projet

- `index.html` : Structure de l'interface
- `styles.css` : Styles de l'interface
- `app.js` : Logique de l'application
- `translations.json` : Données des traductions

## Fonctionnalités détaillées

### Filtrage des URLs
- Les URLs sont nettoyées (suppression des paramètres de requête)
- Les URLs locales et les ancres sont filtrées
- Les URLs sont regroupées par langue

### Comparaison des textes
- Utilisation de la bibliothèque `diff-match-patch` pour détecter les différences
- Mise en évidence visuelle :
  - Texte supprimé : rouge et barré
  - Texte ajouté : vert
  - Texte inchangé : normal

### Interface utilisateur
- Sélecteur de langue en haut
- Liste des pages modifiées à gauche
- Détails des corrections à droite
- Bouton d'accès direct aux pages

## Dépendances

- Vue.js 3
- diff-match-patch

## Notes

- Le serveur doit être relancé après chaque modification du fichier JSON
- Les différences sont calculées de manière sémantique pour une meilleure lisibilité