# Version 1.1.0 · Corrections du recensement des défauts du 27 novembre 2026

Module **SAINLEAU · Refonte graphique** (`sainleaurefonte`), version **1.1.0**.
Fichier : `sainleaurefonte-1.1.0.zip`
SHA-256 : `c87f39a1737dede6b41decfb88fa13110ec1c2e793c4c6abaad657b6e77544b9`

## Mise à jour sur la préprod

1. Modules > Gestionnaire de modules > **Téléverser un module**, choisir `sainleaurefonte-1.1.0.zip`. PrestaShop remplace la version 1.0.0.
2. Paramètres avancés > Performances > **Vider le cache**.
3. Module de performance > **Cache et minification** : vider, puis **Vider cache Cloudflare**.
4. Recharger en navigation privée. Le numéro de version est ajouté à l'adresse de la feuille et du script : les navigateurs prennent les nouveaux fichiers.

**Retour arrière :** téléverser de nouveau `sainleaurefonte-1.0.0.zip`, ou désactiver le module, puis vider les trois caches.

## Défauts corrigés dans le module

Chaque correction a été vérifiée sur la préprod, avec les fichiers 1.1.0 chargés à la place des fichiers 1.0.0 dans mon navigateur de test, aux largeurs indiquées.

| Défaut | Correction | Vérifié |
|---|---|---|
| **B1** · Menu mobile de 4 px | La règle `position: relative` ne s'applique plus qu'à partir de 992 px. Le panneau reprend toute la largeur. Son cadre teal clair devient un filet gris | 390, 768, 991 px |
| **M1** · Filtres cassés après le premier clic | Le script écoute les événements du thème (`updateProductList`, `updateFacets`, `updatedProduct`) et surveille les blocs remplacés. À chaque réaffichage : l'introduction est remise sous le titre, la copie du texte SEO est retirée, les nouveaux groupes de filtres redeviennent repliables. Un groupe replié le reste après un filtrage | Filtre « Sac kraft » coché : introduction présente, texte SEO affiché une seule fois, groupes repliables |
| **M2** · Écrans de plus de 1440 px | Le fil d'Ariane et le slider étaient en `float` : ils sont recentrés dans les 1344 px | 1440 et 1920 px |
| **M3** · Survol du menu illisible | Survol : texte teal profond souligné, sans fond | 1440 px |
| **M4** · Tablette | Menu sur une ligne de 992 à 1439 px : l'écart entre les univers se resserre, et le texte passe à 13 px de 992 à 1199 px. Plus de défilement horizontal | 992, 1024, 1100, 1200, 1280, 1366 px, avec 7 liens |
| **M5** · Éléments flottants (partie module) | **Retour en haut :** à droite, au-dessus de la bulle de chat ; masqué sur mobile, la liste ayant déjà son lien « Retour au sommet ». **Badge Avis Garantis :** masqué sur mobile ; sur ordinateur, il remonte au-dessus de la barre d'ajout collante quand elle s'affiche | 390 et 1440 px |
| **M8** · Menu « Tous nos produits » (partie module) | Chevrons à droite, orientés vers le sous-menu. Le sous-menu s'ouvre sous la barre de menu au lieu de remonter sur l'en-tête | 1440 px |
| **M11** · Virement Maîtrisé en double | L'encadré rose est masqué sur la fiche produit. La ligne « Payez vos paniers élevés avec Virement Maîtrisé » reste sous le bouton | 1440 px |
| **M12** · Barre d'ajout collante | Quantité en − 1 + (à partir des boutons du module), barre plus basse. Sur mobile : sans photo ni choix de déclinaison (ils restent dans le bloc d'achat), titre sur une ligne | 390 et 1440 px |
| **M13** · « Vous pourriez aussi aimer » | Cartes à hauteur égale, boutons alignés en bas, dans tous les carrousels de cartes. L'ombre du thème qui dessinait un cadre plus large que le contenu est supprimée | 1440 px |
| **M14** · Widget Avis Garantis (accueil) | Contenu dans les 1344 px : le module écrivait `padding: 5px 0` en style en ligne, ce qui annulait les marges | 1440 px : cadre de 1344 px |
| **M17** · Bandeau pro sur mobile | Sur mobile, seuls les deux premiers segments restent (« … professionnels - Tél. 01 48 84 60 00 »). Il fait 44 px de haut au lieu de 60. Le texte du back-office n'est pas modifié | 390 px |
| **m2** · Titres du blog coupés | Titre complet repris du texte alternatif de l'image, sans « \| SAINLEAU » | 1440 px : 5 titres complets |
| **m4** · Premier titre du texte SEO | Il venait de la copie du texte affichée sous les produits après un filtrage. Cette copie est supprimée par M1. Au chargement, tous les titres du texte ont le même style (28 px, 600) | 1440 px, avant et après filtrage |
| **m5** · Fiche produit | **Fil d'Ariane :** complété par « Accueil » au début et le nom du produit à la fin. **Référence et marque :** espacement régulier, « Marque : » reste sur la même ligne que sa valeur. **Tableau :** la valeur « Référence » est alignée sur les autres lignes. **Déclinaisons :** pastilles, la déclinaison choisie bordée en teal profond | 390, 1024 et 1440 px |

### Corrections ajoutées en contrôlant les largeurs

- **Catégorie :** 3 cartes par ligne jusqu'à 1365 px, au lieu de 4 cartes de 178 px entre 1200 et 1365 px.
- **Fiche produit de 992 à 1279 px :** la galerie et les informations se partagent la largeur. La page débordait à droite.
- **Liste de la catégorie :** ombre du thème retirée. Elle dessinait un cadre quand il y avait peu de produits.
- **Disponibilité :** « (99 en stock) » ne se coupe plus en deux lignes.

## Non traité dans le module, avec la raison

| Défaut | Raison | Qui |
|---|---|---|
| **M5** · Bulle Smartsupp | La bulle est dessinée par Smartsupp dans son propre cadre. Je ne l'ai pas affichée en test, car elle se connecte au chat en direct et mes navigateurs de test seraient apparus comme visiteurs dans votre tableau de bord. Dans les réglages du widget, côté administration Smartsupp : décaler la bulle d'environ 90 px vers le haut pour qu'elle passe au-dessus de la barre d'ajout collante, choisir la bulle réduite sur mobile, désactiver l'ouverture automatique du message d'accueil | Joris |
| **M7** · Mini-panier, panier, tunnel, Mon compte, favoris, contact, page marque, 404, blog, CGV | Pages des livraisons 2 à 5. La liste du recensement sert de cahier des charges | Livraisons suivantes |
| **M17** · Images du slider sur mobile | Images dédiées à déposer dans le module du slider | Joris |
| Images de la liste en `loading="lazy"` | Un script passe trop tard : les images sont déjà demandées. Il faut le réglage du thème ou du module de performance | Joris |
| Filet gris très pâle à gauche du lien devis (#e5e5e5 sur #f5f5f5) | Il ne vient d'aucune bordure d'élément ; à revoir avec la livraison 2 | Module, plus tard |

Les autres points du recensement relèvent du back-office et restent à la charge de Joris (section 6 du recensement) : B2 (transporteur et franco), M6 (Doofinder), M8 (liens cassés et liste du menu), M9 (lien FAQ), M10 (documents), M15 (image par défaut et photos), M16 (bannières Milieu), m1 (logo), m3 et « Litrage : » (traductions), textes alternatifs, réglages de performance. Les listes de `LIVRAISON-1.md` restent valables.

## À vérifier après l'installation

- Le menu à 1024 px avec « Alimentaire » : la préprod n'affichait que 6 liens pendant mes tests. J'ai vérifié en ajoutant un 7e lien dans la page.
- La bulle Smartsupp, une fois ses réglages modifiés.
- Un filtre, un tri et un changement de page sur une catégorie, puis un changement de déclinaison sur une fiche produit.
