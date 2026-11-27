# Refonte graphique de sainleau.com

Thème enfant **PRS005_07_sainleau** (parent `PRS005_07`) qui applique la direction artistique de la maquette Figma « 02 · Site web » sans toucher aux catégories, produits, pages, URL ni modules.

Mis à jour le 27 novembre 2026.

| Étape | État |
|---|---|
| 1 · Socle commun (variables, polices, boutons, champs, en-tête, menu, pied de page) | Feuille écrite et contrôlée sur le site public. **Zip en attente de l'export du thème actuel** (voir ci-dessous) |
| 2 à 8 | À faire, une étape après l'autre, après validation de la précédente sur la préprod |

---

## Bloquant : il faut l'export du thème actuel

Le zip reçu (`child_PRS005_07_child.zip`, téléchargé depuis *Personnalisation avancée*) **n'est pas le thème PRS005_07_child**. C'est un modèle vide de thème enfant que PrestaShop génère à partir du thème actif :

- 7 fichiers seulement ;
- `parent: PRS005_07_child`, donc un enfant de thème enfant, que PrestaShop ne gère pas ;
- un `custom.css` de démonstration qui colore l'en-tête en rouge.

Le vrai thème PRS005_07_child contient beaucoup plus. Le site en ligne charge sa propre feuille `theme.css`, son `theme.js` et des surcharges de modules : ttmegamenu, ttvrmegamenu, ttthemesettings, blockreassurance, ps_searchbar, tttoplink, ttcategoryfeature, ps_emailsubscription. Il contient aussi des règles ajoutées par le développeur. Le nouveau thème doit reprendre tout ce contenu, sinon ces réglages disparaîtraient à l'activation.

**À faire, dans le back-office de la préprod, avec PRS005_07_child actif :**
Apparence > Thème et logo, bouton **« Exporter le thème actuel »** en haut de la page. PrestaShop télécharge un zip nommé `PRS005_07_child.zip`. C'est ce fichier qu'il faut transmettre.

Dès réception, la commande ci-dessous produit le zip à importer.

---

## Contenu du dossier

| Chemin | Rôle |
|---|---|
| `theme/PRS005_07_sainleau/` | Couche SAINLEAU ajoutée au thème actuel : `assets/css/sainleau.css`, polices Montserrat (`assets/fonts/`), icônes Phosphor (`assets/img/icones/`) |
| `outils/construire_theme.py` | Assemble l'export du thème actuel et la couche SAINLEAU, contrôle le résultat et écrit le zip |
| `outils/captures/captures.js` | Captures du site public avec et sans la feuille SAINLEAU, traceurs bloqués |
| `captures/etape-1/` | Comparaisons Figma / site et avant / après de l'étape 1 |

## Construire le zip

```bash
python3 refonte-site/outils/construire_theme.py PRS005_07_child.zip --version 1
```

Le zip est écrit dans `refonte-site/livrables/PRS005_07_sainleau_v1.zip`. Le script :

- refuse un zip qui n'est pas l'export de PRS005_07_child ;
- retire le dossier `dependencies/`, que PrestaShop recopierait sinon dans `/modules` en écrasant les fichiers des modules ;
- passe le parent à `PRS005_07` et le nom à `PRS005_07_sainleau_vN` ;
- déclare la feuille SAINLEAU dans `config/theme.yml` sans toucher aux autres réglages du thème ;
- vérifie que chaque police et chaque icône appelée par la feuille est présente et qu'aucune couleur hors charte n'y figure ;
- place `config/theme.yml` à la racine du zip, comme l'attend l'import de PrestaShop.

## Chargement de la feuille SAINLEAU

Vérifié dans le code de PrestaShop 9 (`FrontController::setMedia`, `Theme::getPageSpecificAssets`) :

- `theme.css` et `custom.css` sont cherchés d'abord dans le thème enfant, puis dans le parent. Le fichier de l'enfant remplace donc celui du parent.
- `use_parent_assets` ne charge aucune feuille. Ce réglage change seulement les adresses d'images et de fichiers utilisées dans les templates. Le script garde la valeur du thème actuel.
- La feuille est déclarée dans `theme.yml` (`assets.css.all`, priorité 2000). Elle se charge donc après `theme.css` (50), les feuilles des modules et du module ttthemecustomizer, et `custom.css` (1000).

## Import et activation (préprod uniquement)

1. Apparence > Thème et logo > **Ajouter un nouveau thème** > importer `PRS005_07_sainleau_v1.zip`.
2. Activer **PRS005_07_sainleau_v1**.
3. Paramètres avancés > Performances > **Vider le cache**.
4. Vérifier :
   - Apparence > Positions : chaque module est toujours à sa place. L'activation d'un thème réapplique la liste de modules de son `theme.yml`.
   - Apparence > Thème et logo > Choisir les mises en page : ce réglage est enregistré par thème, il peut revenir aux valeurs par défaut.
5. **Retour arrière :** réactiver PRS005_07_child.

Chaque étape produit un nouveau zip au nom distinct (`_v2`, `_v3`…). Les anciennes versions peuvent être supprimées une fois la nouvelle validée.

---

## Journal · Étape 1 · Socle commun

### Ce qui a été fait

Tout est en CSS (`assets/css/sainleau.css`, commentée en français, organisée en sections : polices, variables, base, composants, en-tête, menu, engagements, newsletter, pied de page, responsive). **Aucun template n'a été surchargé** : les templates du thème actuel ne sont pas encore disponibles (voir le bloquant).

- **Polices :** Montserrat 400, 500 et 600, hébergée dans le thème (woff2, licence SIL OFL, sous-ensembles latin et latin étendu). Montserrat remplace Poppins et Rubik sur tous les textes. Les icônes Material encore utilisées par le thème sont conservées.
- **Variables :** les 11 couleurs de la charte (`--sl-…`). Les variables du thème parent (`--primary-bg-color`, `--footer-bg-color`…) sont réalignées sur ces couleurs.
- **Base :** titres aux styles « Site web » (Titre 1 40/48, Titre 2 28/36, Titre 3 20/28), corps 16/26, texte aligné à gauche. Les liens texte se soulignent au survol.
- **Boutons :** principal, secondaire et désactivé de la bibliothèque Figma. L'animation de fond qui glissait sous les boutons du thème est supprimée. Survol en 180 ms, léger enfoncement au clic.
- **Champs :** hauteur 48 px, bordure `#707070`, rayon 4 px. Listes déroulantes avec la flèche Phosphor.
- **Focus clavier :** anneau plein de 2 px décalé de 2 px, teal profond, blanc sur le bandeau et le pied de page.
- **Mouvement réduit :** toutes les animations sont coupées avec `prefers-reduced-motion`.
- **En-tête :**
  - bandeau pro sur fond teal profond ;
  - logo dans un cadre de 178 × 38 px ;
  - recherche avec loupe et bouton « Rechercher » ;
  - Favoris avec compteur, compte, bouton panier avec compteur, icônes Phosphor ;
  - menu « Tous nos produits » et univers sur une ligne bordée de filets ;
  - méga-menu habillé avec la charte ;
  - en-tête collant compact au défilement.
- **Engagements** (haut du pied de page) : encadré à bordure grise, pastilles teal clair avec icônes Phosphor, contenu centré (retouche n° 4).
- **Newsletter :** bloc teal clair sur fond blanc, pastille enveloppe, champ et bouton « S'abonner ».
- **Pied de page :**
  - fond teal profond, 5 colonnes ;
  - icônes alignées sur le texte des lignes téléphone et e-mail, adresse alignée en haut (retouche n° 5) ;
  - ligne Avis Garantis ;
  - bas de page avec filet, copyright, réseaux sociaux et logos de paiement sur pastilles blanches ;
  - bouton « retour en haut ».

### Captures

Captures faites sur le site public. La feuille est injectée dans un navigateur de test, rien n'est enregistré sur le site. GA4, Google Ads, Hotjar, Smartsupp et Doofinder sont bloqués pendant les tests.

- `captures/etape-1/1-entete-figma-site-actuel.jpg` : maquette, site avec la feuille, site actuel
- `captures/etape-1/2-pied-figma-site.jpg`
- `captures/etape-1/3-engagements-newsletter-figma-site.jpg`
- `captures/etape-1/4-bas-de-page-avant-apres.jpg`
- `captures/etape-1/5-entete-1024-avant-apres.jpg`, `…-768-…`, `…-375-…`
- `captures/etape-1/6-bas-de-page-375.jpg`
- `captures/etape-1/7-survol-compte.jpg`, `8-entete-collant.jpg`

### Vérifications (section 12 du brief)

- [x] Capture à 1440 px comparée à la maquette : en-tête, engagements, newsletter, pied de page.
- [x] Seule Montserrat 400, 500 ou 600 sur les textes. Poppins est encore téléchargée par le thème actuel mais n'est plus utilisée (voir « Pour la suite »).
- [x] Aucune couleur hors charte dans la feuille. Le script de construction le vérifie.
- [x] Pas de texte blanc sur `#25acb0`. Champs bordés en `#707070`.
- [x] Survols et focus clavier sur l'en-tête, le menu et le pied de page. Animations coupées avec `prefers-reduced-motion`.
- [x] Retouches 1, 4 et 5. Les retouches 2, 3, 6 et 7 concernent l'accueil, les cartes produit et la page catégorie (étapes 2 et 3).
- [x] Rendu contrôlé à 1440, 1024, 768, 375 et 320 px.
- [ ] Fonctionnalités de la section 11. Contrôlé sur le site public : recherche et résultats instantanés, menu du compte, en-tête collant, accordéon du pied de page sur mobile. Les pages catégorie, produit, connexion et panier ne présentent pas de casse visible. **À refaire sur la préprod après import** : ajout au panier, mini-panier, favoris, connexion, reCAPTCHA, tunnel jusqu'au paiement.

---

## Retours pour Joris

### Textes à corriger dans le back-office (non modifiés dans le thème)

| Où | Texte actuel | Texte de la maquette |
|---|---|---|
| Bandeau pro (module ttcmsheader) | SITE DÉDIÉ UNIQUEMENT AUX PROFESSIONNELS - Tél. 01 48 84 60 00 - … en Ile-de-France, 48h dans toute la France. | Site dédié uniquement aux professionnels · Tél. 01 48 84 60 00 · Pour toute commande avant 10h, livraison le lendemain en Île-de-France, 48h dans toute la France |
| Engagements (module ttcmsfooterservice) | Fournisseur depuis +25 ans / pour les TPE, PME et grands comptes | Fournisseur depuis 30 ans / Pour les TPE, PME et grands comptes |
| Engagements | Plus de 6000 références / au meilleur prix | 2 000 références / Au meilleur prix |
| Engagements | Expédiée sous 48 h | Expédiée sous 48h |
| Engagements | Frais de port 35€ HT / Franco à partir de 199€ HT | Frais de port 35 € HT / Franco à partir de 199 € HT |
| Nos informations (Paramètres de la boutique > Contact > Magasins, coordonnées) | 01 78 81 41 77 | 01 48 84 60 00 |
| Nos informations | Capital social de 150 000€ | Capital social de 150 000 € |
| Copyright du bas de page | © 2026 - Sainleau - Reproduction interdite | © 2026 · SAINLEAU · Reproduction interdite |
| Recherche (texte du module ttblocksearch, International > Traductions) | Rechercher un produit ou une reférence | Rechercher un produit ou une référence |
| Liens du menu (module tttoplink) | Le lien « Literie & Mobilier » est relatif (`444-literie-mobilier`) : il ne fonctionne pas depuis une fiche produit ou une sous-page | Adresse complète de la catégorie |
| Liens du menu (module tttoplink) | « Produits d'hygiène » commence par un caractère invisible | À retaper |
| Liens du menu (module tttoplink) | Univers « Alimentaire » absent de la ligne de menu du site en ligne | Présent dans la maquette, à vérifier sur la préprod |
| Logo (Apparence > Thème et logo > Logo de l'en-tête) | Logo JPG avec « By DISTRI-CLEAN » | Déposer « Logo principal.svg ». PrestaShop 9 accepte le SVG pour ce logo. |

Textes du thème encore en anglais, à traiter aux étapes concernées : « Shop Categories » et « Other Departments » (menu vertical de l'accueil), « More Category » / « Less Category » (menu), « Back to top » (bouton retour en haut), « Click to view Read More » (articles du blog).

### Choix sur le mobile, à valider

Le script du thème passe en affichage mobile **sous 992 px**. La feuille suit ce seuil.

- **1200 px et plus :** en-tête sur une ligne, comme la maquette.
- **992 à 1199 px :**
  - la recherche passe sur une deuxième ligne ;
  - « Tous nos produits » n'affiche plus que son icône, pour garder les univers sur une ligne. Le libellé reste lu par les lecteurs d'écran.
- **Moins de 992 px :**
  - en-tête compact : menu, logo, favoris (icône et compteur), compte (icône), panier (bouton icône et compteur) ;
  - recherche sur toute la largeur ;
  - la ligne des univers est masquée par le thème, les univers restent dans le menu.
- **Pied de page :** 5 colonnes à partir de 1200 px, 3 de 992 à 1199 px, 2 de 768 à 991 px. Sous 768 px, une colonne avec titres en accordéon, comme aujourd'hui.
- **Engagements :** carrousel du thème sur tablette, les 4 empilés sur téléphone.
- **Bandeau pro :** texte en 12/16 sur téléphone (3 lignes).
- **Marges latérales :** 48 px à partir de 1200 px, 24 px sur tablette, 16 px sur téléphone.

### Écarts avec la maquette

- **« Se connecter » et « Mes favoris »** au lieu de « Mon compte » et « Favoris ». Ces libellés sont dans les templates du thème actuel : ils seront corrigés par surcharge dès que l'export sera disponible.
- **Logo :** le JPG actuel contient des marges et la mention « By DISTRI-CLEAN ». Il paraît donc plus petit dans le cadre de 178 × 38 px. Le SVG réglera ce point.
- **Bordure du champ de recherche** en `#707070` (charte, règle d'accessibilité) au lieu de `#6c6666` dans la maquette.
- **Réseaux sociaux** (Facebook, YouTube, LinkedIn) absents de la maquette : conservés, en icônes Phosphor au centre du bas de page.
- **« Retour en haut » :** conservé et habillé (pastille teal profond).

### Pour la suite

- **Poppins** est encore téléchargée depuis Google Fonts par le thème actuel (balises `<head>` et module ttthemecustomizer). Elle n'est plus affichée. Pour supprimer cet appel, il faudra surcharger le template d'en-tête du thème et vérifier les réglages du module ttthemecustomizer.
- **Templates du thème parent PRS005_07 :** ils seront utiles pour les libellés de compte et du tunnel de commande (étapes 6 et 7). Ils sont à demander au développeur.
- **Étape 2 (accueil) :** le menu vertical ouvert sur le slider (« Shop Categories ») n'est pas dans la maquette. Il est à traiter avec l'accueil.
