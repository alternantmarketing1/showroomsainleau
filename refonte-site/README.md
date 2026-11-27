# Refonte graphique de sainleau.com

Module PrestaShop **SAINLEAU · Refonte graphique** (`sainleaurefonte`). Il applique la maquette Figma « 02 · Site web » (fichier `5bTa772JyF484yWUjqOYIB`) au thème actuel PRS005_07_child sans le modifier : une feuille de style, des polices et des icônes chargées après le thème, et un petit script.

Compatible PrestaShop 1.7.8 (site en ligne) et 9.x (préprod). Travail et captures sur la préprod `dev.sainleau.com` uniquement.

Mis à jour le 27 novembre 2026.

| Livraison | Pages | Version | État |
|---|---|---|---|
| 1 | Socle commun, accueil, catégorie, fiche produit | 1.1.0 | 1.0.0 installée sur la préprod ; 1.1.0 corrige le recensement des défauts du 27/11 (`livraisons/CORRECTIONS-1.1.0.md`) |
| 2 | Panier, connexion | — | Après validation de la livraison 1 |
| 3 | Tunnel de commande | — | À faire |
| 4 | Mon compte | — | À faire |
| 5 | Pages sans maquette | — | À faire |

## Contenu du dossier

| Chemin | Rôle |
|---|---|
| `module/sainleaurefonte/` | Sources du module |
| `module/sainleaurefonte/views/css/sainleau.css` | Feuille de la refonte, commentée en français, en 17 sections (polices, variables, base, composants, en-tête, menu, engagements, newsletter, pied de page, mise en page commune, composants partagés, accueil, catégorie, fiche produit, ajustements, tablette et mobile, corrections de la 1.1.0) |
| `module/sainleaurefonte/views/js/sainleau.js` | Script complémentaire, sans bibliothèque |
| `module/sainleaurefonte/views/fonts/` | Montserrat 400, 500, 600 (woff2, licence OFL) |
| `module/sainleaurefonte/views/img/icons/` | Icônes Phosphor (SVG, licence MIT) |
| `livraisons/` | Zips du module et notice de chaque version (`LIVRAISON-1.md` : installation, deux listes back-office, écarts restants ; `CORRECTIONS-1.1.0.md` : défauts corrigés, non traités et à vérifier) |
| `logo/` | Logo SAINLEAU sans « By DISTRI-CLEAN » : SVG et PNG 356 × 76 (2 × la taille affichée) |
| `captures/livraison-1/` | Maquette et préprod avec le module, à 1440 px, et mobile 375 px |
| `outils/captures/` | Outil de capture de la préprod avec les fichiers du module ajoutés dans le navigateur de test (rien n'est modifié sur le site, traceurs bloqués) et outil de comparaison côte à côte |
| `outils/test-module.php` | Banc d'essai : vérifie l'installation du module et l'enregistrement de la feuille et du script |
| `archives/etape-1-theme-enfant/` | Première approche (thème enfant), abandonnée faute d'export du thème actuel. Conservée pour mémoire |

## Règles suivies

- Ordre des moyens : CSS, puis script minimal, puis liste des écarts. Aucun gabarit surchargé, aucun fichier du thème, du cœur ou des autres modules modifié.
- Aucun texte corrigé dans le module : les textes sont listés pour le back-office.
- Chaque `!important` est commenté : il sert uniquement à passer devant une règle du thème écrite avec `!important` ou une couleur saisie en style en ligne.
- Le script ne lève pas d'erreur si un élément manque et ne touche à aucun champ du panier ni de la commande.
- Chaque livraison porte un nouveau numéro de version. Retour arrière : désactiver le module puis vider les caches.

## Construire le zip

```bash
cd refonte-site/module && zip -r ../livraisons/sainleaurefonte-X.Y.Z.zip sainleaurefonte -x '*/.*'
```

Le dossier racine du zip doit être `sainleaurefonte/`. Mettre à jour `$this->version` dans `sainleaurefonte.php` avant chaque livraison.

## Captures

```bash
cd refonte-site/outils/captures && npm install && node capture.js taches.json ../../module/sainleaurefonte
```

`taches.json` contient une liste `[{url, out, width, height, full, css, sansTiers, journal}]`. Avec `css: true`, la page de la préprod est chargée avec la feuille et le script de la copie de travail du module : ils remplacent ceux de la version installée, ou sont ajoutés si le module n'est pas installé. `sansTiers` bloque les widgets (chat, avis, paiement) pour des captures stables. L'accès à la préprod passe par le proxy de l'environnement : aucun identifiant n'est écrit dans un fichier.

`python3 cote.py maquette.png capture.png prefixe 1250` produit des tranches côte à côte à la même largeur.
