# Livraison 1 · Accueil, catégorie, fiche produit

Module **SAINLEAU · Refonte graphique** (`sainleaurefonte`), version **1.0.0**, 27 novembre 2026.
Fichier : `sainleaurefonte-1.0.0.zip` (dossier racine `sainleaurefonte/`).
SHA-256 : `30e4eced467c0d7742d2e4ce321153490331979528b04fbb37b0a73a14feb6ab`

## Installation sur la préprod (dev.sainleau.com)

1. Back-office > Modules > Gestionnaire de modules > **Téléverser un module**, choisir `sainleaurefonte-1.0.0.zip`.
2. PrestaShop installe et active le module. Il n'a pas de page de configuration.
3. Paramètres avancés > Performances > **Vider le cache**.
4. Module de performance (ets_superspeed) > **Cache et minification** > vider le cache, puis **Vider cache Cloudflare**.
5. Recharger l'accueil, une catégorie et une fiche produit en navigation privée.

**Retour arrière :** Modules > Gestionnaire de modules > SAINLEAU · Refonte graphique > **Désactiver**, puis vider les trois caches. Le module ne modifie ni la base de données, ni le thème, ni les autres modules.

**Mise à jour :** chaque livraison porte un nouveau numéro de version. Téléverser le nouveau zip par-dessus l'ancien, puis vider les trois caches. Le numéro de version est ajouté aux adresses de la feuille et du script, les navigateurs rechargent donc les nouveaux fichiers.

## Ce que fait le module

- Charge `views/css/sainleau.css` après la feuille du thème, celles des modules et `custom.css` (priorité 2000, hook `actionFrontControllerSetMedia`).
- Embarque Montserrat 400, 500 et 600 (`views/fonts`, licence OFL) et 35 icônes Phosphor (`views/img/icons`, licence MIT). Aucun appel à Google Fonts ni à un CDN.
- Charge `views/js/sainleau.js` (aucune bibliothèque). Le script ne lève jamais d'erreur si un élément manque et ne touche à aucun champ du panier ni de la commande. Il fait cinq choses :
  1. il place le premier paragraphe de la description de catégorie sous le H1, avec « Lire la suite » ;
  2. il déplace le reste de la description dans une section pleine largeur sous la liste, avec « Lire la suite » ;
  3. il rend les groupes de filtres repliables et ajoute « Voir les N autres » au-delà de 6 valeurs ;
  4. il ajoute les flèches de la ligne des sous-catégories quand elle dépasse la largeur ;
  5. sur la fiche produit, il place la bannière Virement Maîtrisé sous le bouton « Ajouter au panier ». Seule l'image est déplacée.
- Aucun texte n'est modifié par le module. Les textes à changer sont dans les deux listes ci-dessous.
- Chaque `!important` de la feuille est commenté. Il sert uniquement à passer devant une règle du thème écrite elle-même avec `!important`, ou devant une couleur saisie en style en ligne.

## Liste 1 · Traductions à changer

International > Traductions > **Traductions du thème** (PRS005_07_child), langue français. Chercher le texte actuel dans le champ de recherche.

| Page | Texte actuel | Nouveau texte | Clé d'origine (anglais) |
|---|---|---|---|
| En-tête, toutes les pages | Mes favoris | Favoris | Module ttproductwishlist (Traductions des modules installés) |
| En-tête, visiteur non connecté | Se connecter | Mon compte | Sign in · *à valider : la maquette affiche « Mon compte », « Se connecter » reste plus clair pour un visiteur* |
| Catégorie, barre d'outils | Il y a 58 produits. | 58 produits | There are %product_count% products. → `%product_count% produits` |
| Catégorie, barre d'outils | Trier par: | Trier par | Sort by: |
| Catégorie, pagination | Affichage de 1-40 de 58 élément(s) | Affichage de 1-40 sur 58 produits | Showing %from%-%to% of %total% item(s) → `Affichage de %from%-%to% sur %total% produits` |
| Fiche produit, sous le titre | Réf : | Réf. | Texte du thème (chercher « Réf ») |
| Fiche produit, colonne de droite | Fiche technique | Caractéristiques | Data sheet |
| Mobile, toutes les pages | Retour au sommet | Haut de page | Back to top |
| Accueil, articles du blog | Click to view Read More, More Category, Less Category (textes restés en anglais) | Lire l'article, Plus de catégories, Moins de catégories | Textes des modules du thème |

## Liste 2 · Textes à corriger dans le back-office

| Emplacement dans le back-office | Texte actuel | Texte corrigé |
|---|---|---|
| Bandeau pro, toutes les pages · Modules > TT CMS Header | SITE DÉDIÉ UNIQUEMENT AUX PROFESSIONNELS - Tél. 01 48 84 60 00 - Pour toute commande avant 10h, livraison le lendemain en Ile-de-France, 48h dans toute la France. | Site dédié uniquement aux professionnels · Tél. 01 48 84 60 00 · Pour toute commande avant 10h, livraison le lendemain en Île-de-France, 48h dans toute la France |
| Engagements, toutes les pages · Modules > TT CMS Footer Service | Fournisseur depuis +25 ans | Fournisseur depuis 30 ans · *chiffre de la maquette, à confirmer* |
| idem | Plus de 6000 références | 2 000 références · *chiffre de la maquette, à confirmer* |
| idem | Expédiée sous 48 h | Expédiée sous 48h |
| idem | Frais de port 35€ HT | Frais de port 35 € HT |
| idem | Franco à partir de 199€ HT | Franco à partir de 199 € HT |
| Fiche produit, sous le bloc d'achat · Modules > Réassurance (blockreassurance) | 3 lignes : « Demandez un devis : Grand compte, hôpitaux, collectivité, etc. » · « Frais de ports 35 € : Franco à partir de 199€ » · « Livraison rapide : Expédiée sous 48 h » | 2 lignes : « Commande avant 10h : livraison le lendemain en Île-de-France, 48h dans toute la France » · « Frais de port 35 € HT, franco à partir de 199 € HT ». *Les icônes suivent l'ordre des lignes : me prévenir après le changement pour que je mette le camion en 1 et l'étiquette en 2.* |
| Pied de page · Paramètres de la boutique > Contact > Magasins (coordonnées) | 01 78 81 41 77 | 01 48 84 60 00 · *numéro du bandeau et de la maquette, à confirmer* |
| Données structurées de toutes les pages · Paramètres de la boutique > Contact > Magasins > Nom de la boutique | My shop | SAINLEAU |
| Bas de page · module de texte du pied de page | © 2026 - Sainleau - Reproduction interdite | © 2026 · SAINLEAU · Reproduction interdite |
| Catégorie « Sac poubelle » · Catalogue > Catégories > Sac poubelle > Description | H2 en tête : « Sac poubelle professionnel - Une solution durable pour votre entreprise » | Supprimer ce H2 (le H1 dit la même chose). Supprimer aussi le retour à la ligne au début de chaque H3 et les couleurs `#000000` saisies dans le texte |
| Filtres de catégorie · Modules > Recherche à facettes > modèle de filtres | Filtre « Selections » (valeur « New product ») ; ordre Catégories, Disponibilité, Selections, Matière, Couleur, Prix | Retirer « Selections ». Ordre de la maquette : Catégories, Disponibilité, Couleur, Matière, Prix |
| Menu principal · Modules > TT Mega Menu | « Alimentaire » absent de la préprod | Ajouter « Alimentaire » après « Literie & Mobilier », comme dans la maquette |
| Fiche produit 319001 · Catalogue > Produits > Fichiers joints | ft_319001.pdf joint deux fois | Un seul fichier, intitulé « Fiche technique » |
| Fiche produit 319001 · Catalogue > Produits > Résumé | Opacité: 87% · Dimensions :  820 x 1300 mm | Opacité : 87 % · Dimensions : 820 × 1300 mm |
| Accueil, « Nos conseils » · Modules > Smart Blog > réglages | Titres coupés : « Mini monobrosse : usages,... » | Afficher le titre complet (longueur de titre plus grande) |
| Pied de page, « Nos informations » · Paramètres de la boutique > Contact > Magasins | Capital social de 150 000€ | Capital social de 150 000 € |
| Menu principal · Modules > TT Top Link | Lien « Literie & Mobilier » relatif (`444-literie-mobilier`) : il casse depuis une fiche produit ou une sous-page | Adresse complète de la catégorie |

## Écarts restants

| Écart avec la maquette | Raison | Solution prévue |
|---|---|---|
| Accueil : le slider fait 1344 × 494 px au lieu de 1344 × 464 | L'image du back-office fait 1767 × 650 et contient sa propre marge grise | Image au format 2688 × 928 (back-office), ou garder tel quel |
| Catégorie : bannière recadrée au centre en 1344 × 220 | C'est le format de la maquette ; l'image du back-office est plus haute (1344 × 274 affichée) | Fournir les bannières de catégorie au format 2688 × 440 pour que rien ne soit coupé |
| Fiche produit : fil d'Ariane sans « Accueil » et terminé par « 150 L » au lieu du nom du produit | Le fil est construit côté serveur par le thème (catégorie par défaut du produit) | Développeur, plus tard : gabarit du fil d'Ariane |
| Fiche produit : « Disponible (99 en stock) » au lieu de « Disponible · 78 en stock » | Texte et couleur verte écrits dans le gabarit du thème (le vert est neutralisé par le module) | Développeur, plus tard : une ligne de gabarit |
| Fiche produit : « Marque : Sainleau by Distri Clean » à côté de la référence | Absente de la maquette, conservée : information et lien vers la page de la marque | Décision de Joris : la masquer coûte une règle CSS |
| Fiche produit : bloc « Références spécifiques · EAN13 » | Absent de la maquette, conservé : donnée produit | Décision de Joris |
| Fiche produit : titre « Télécharger » et lien « Télécharger (131.28KB) » au lieu de « Documents » et « PDF · 131 Ko » | Le titre et le lien utilisent la même traduction ; le module ne change aucun texte | Développeur, plus tard : gabarit des fichiers joints |
| Catégorie : pas de bouton « précédent » grisé en page 1 | Le thème ne l'affiche pas en page 1 | Développeur, plus tard, ou accepter |
| Fiche produit : bannière Virement Maîtrisé | Déplacée par le script sous le bouton. Son image vient d'assets.fintecture.com, bloqué dans mon environnement de capture : elle n'apparaît pas sur mes captures | À vérifier sur la préprod après installation |
| Accueil et pied de page : widget Avis Garantis | Bloqué dans mon environnement de capture | À vérifier sur la préprod après installation |
| Accueil : 1 seul produit en promotion, produits sans photo (« No image available ») | Données de la préprod | Rien à faire dans le module |
| Pied de page : icônes Facebook, YouTube, LinkedIn | Absentes de la maquette, conservées (fonction) | Décision de Joris |
| Catégorie : liens en teal dans l'introduction | La maquette n'a pas de lien ; un lien doit rester visible | Conservé |
| Mobile (375 px) | Pas de maquette mobile | Mêmes composants : cartes 2 par ligne avec le bouton sous la quantité, fiche produit sur une colonne, bouton « Filtre » secondaire, accordéons du pied de page conservés |
| Panier, connexion, tunnel, Mon compte | Hors livraison 1 | Livraisons 2 à 4, après validation de celle-ci |
