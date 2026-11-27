/**
 * SAINLEAU · Refonte graphique : script complémentaire de la feuille.
 *
 * Utilisé en dernier recours, quand le CSS ne peut pas atteindre un élément.
 * Règles :
 *  - aucune bibliothèque, aucune animation ;
 *  - chaque fonction vérifie que ses éléments existent et ne lève jamais
 *    d'erreur ;
 *  - aucune action sur les formulaires du panier ni de la commande.
 *
 * Fonctions :
 *  1. Catégorie : introduction (premier paragraphe de la description) sous
 *     le titre, avec « Lire la suite ».
 *  2. Catégorie : texte SEO dans une section pleine largeur sous la liste,
 *     avec « Lire la suite ».
 *  3. Filtres : groupes repliables et « Voir les N autres » au-delà de
 *     6 valeurs.
 *  4. Sous-catégories : flèches de défilement quand la ligne dépasse.
 *  5. Fiche produit : bannière Virement Maîtrisé placée sous le bouton
 *     « Ajouter au panier » (le module Fintecture l'affiche dans les prix).
 *     Seule l'image est déplacée ; aucun champ du formulaire n'est touché.
 */
(function () {
  'use strict';

  var PAGES_LISTE = ['category', 'prices-drop', 'new-products', 'best-sales', 'search', 'manufacturer'];
  var LIMITE_FILTRES = 6;

  function sur(fonction) {
    try {
      fonction();
    } catch (erreur) {
      if (window.console && console.warn) {
        console.warn('sainleaurefonte :', erreur);
      }
    }
  }

  function estPageListe() {
    return PAGES_LISTE.indexOf(document.body.id) !== -1;
  }

  function creerBoutonLireLaSuite(bloc) {
    var bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'sl-lien-action';
    bouton.setAttribute('aria-expanded', 'false');
    bouton.textContent = 'Lire la suite';
    bouton.addEventListener('click', function () {
      var replie = bloc.classList.toggle('sl-replie');
      bouton.setAttribute('aria-expanded', replie ? 'false' : 'true');
      bouton.textContent = replie ? 'Lire la suite' : 'Réduire';
    });
    return bouton;
  }

  /* 1 et 2. Introduction et texte SEO de la catégorie */
  function texteCategorie() {
    if (!estPageListe() || document.querySelector('.sl-texte-categorie')) {
      return;
    }
    var description = document.getElementById('category-description');
    var blocDescription = description ? description.closest('.block-category') : null;
    var entete = document.querySelector('#js-product-list-header .block-category');
    var contenu = document.querySelector('.content_wrap > .container');
    if (!description || !blocDescription || !contenu) {
      return;
    }

    // Introduction : les éléments du début, jusqu'au premier titre qui suit
    // un paragraphe. Ils sont déplacés, pas copiés.
    if (entete && !entete.querySelector('.sl-intro')) {
      var aDeplacer = [];
      var paragrapheVu = false;
      var enfants = Array.prototype.slice.call(description.children);
      for (var i = 0; i < enfants.length; i++) {
        var nom = enfants[i].tagName;
        if (/^H[1-6]$/.test(nom)) {
          if (paragrapheVu) {
            break;
          }
          // Titre placé avant le premier paragraphe : il reste dans le texte
          // de catégorie, l'introduction ne montre que le paragraphe
          continue;
        }
        if (nom === 'P' && enfants[i].textContent.trim() !== '') {
          paragrapheVu = true;
        }
        aDeplacer.push(enfants[i]);
      }
      // Il faut qu'un paragraphe reste pour le texte de catégorie
      var resteUnParagraphe = enfants.some(function (element) {
        return aDeplacer.indexOf(element) === -1 && element.tagName === 'P' && element.textContent.trim() !== '';
      });
      if (paragrapheVu && resteUnParagraphe) {
        var intro = document.createElement('div');
        intro.className = 'sl-intro sl-replie';
        var texte = document.createElement('div');
        texte.className = 'sl-intro-texte';
        aDeplacer.forEach(function (element) {
          texte.appendChild(element);
        });
        intro.appendChild(texte);
        entete.appendChild(intro);
        if (texte.scrollHeight > texte.clientHeight + 2) {
          intro.appendChild(creerBoutonLireLaSuite(intro));
        } else {
          intro.classList.remove('sl-replie');
        }
      }
    }

    // Texte SEO : section pleine largeur après la liste
    var section = document.createElement('section');
    section.className = 'sl-texte-categorie sl-replie';
    var interieur = document.createElement('div');
    interieur.className = 'sl-texte-interieur';
    section.appendChild(interieur);
    interieur.appendChild(blocDescription);
    contenu.parentNode.insertBefore(section, contenu.nextSibling);
    if (description.scrollHeight > description.clientHeight + 2) {
      interieur.appendChild(creerBoutonLireLaSuite(section));
    } else {
      section.classList.remove('sl-replie');
    }
  }

  // Après un filtrage, PrestaShop réaffiche la liste avec une nouvelle copie
  // de la description : elle est retirée si le texte a déjà été déplacé.
  function retirerDescriptionEnDouble() {
    if (!document.querySelector('.sl-texte-categorie')) {
      return;
    }
    var doublons = document.querySelectorAll('#js-product-list #category-description');
    Array.prototype.forEach.call(doublons, function (description) {
      var bloc = description.closest('.block-category') || description;
      bloc.parentNode.removeChild(bloc);
    });
  }

  /* 3. Filtres repliables et « Voir les N autres » */
  function filtres() {
    var groupes = document.querySelectorAll('#search_filters .facet');
    Array.prototype.forEach.call(groupes, function (groupe) {
      if (groupe.getAttribute('data-sl-pret') === '1') {
        return;
      }
      groupe.setAttribute('data-sl-pret', '1');

      var titre = groupe.querySelector(':scope > .facet-title');
      var liste = groupe.querySelector(':scope > ul');
      if (titre && liste) {
        titre.setAttribute('role', 'button');
        titre.setAttribute('tabindex', '0');
        titre.setAttribute('aria-expanded', 'true');
        var basculer = function () {
          var replie = groupe.classList.toggle('sl-replie');
          titre.setAttribute('aria-expanded', replie ? 'false' : 'true');
        };
        titre.addEventListener('click', basculer);
        titre.addEventListener('keydown', function (evenement) {
          if (evenement.key === 'Enter' || evenement.key === ' ') {
            evenement.preventDefault();
            basculer();
          }
        });
      }

      if (!liste || liste.classList.contains('faceted-slider')) {
        return;
      }
      var valeurs = liste.querySelectorAll(':scope > li');
      if (valeurs.length <= LIMITE_FILTRES) {
        return;
      }
      // Une valeur cochée au-delà de la limite reste visible : on ne replie pas
      var cocheeCachee = Array.prototype.some.call(valeurs, function (valeur, index) {
        return index >= LIMITE_FILTRES && valeur.querySelector('input:checked');
      });
      if (cocheeCachee) {
        return;
      }
      var nombre = valeurs.length - LIMITE_FILTRES;
      Array.prototype.forEach.call(valeurs, function (valeur, index) {
        if (index >= LIMITE_FILTRES) {
          valeur.classList.add('sl-en-trop');
        }
      });
      var bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'sl-lien-action sl-voir-plus';
      bouton.setAttribute('aria-expanded', 'false');
      bouton.textContent = 'Voir les ' + nombre + ' autres';
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        Array.prototype.forEach.call(valeurs, function (valeur, index) {
          if (index >= LIMITE_FILTRES) {
            valeur.classList.toggle('sl-en-trop', ouvert);
          }
        });
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
        bouton.textContent = ouvert ? 'Voir les ' + nombre + ' autres' : 'Voir moins';
      });
      liste.parentNode.insertBefore(bouton, liste.nextSibling);
    });
  }

  /* 4. Flèches des sous-catégories */
  function flechesSousCategories() {
    var bloc = document.getElementById('subcategories');
    var liste = bloc ? bloc.querySelector('.subcategories-list') : null;
    if (!liste || bloc.querySelector('.sl-fleches')) {
      return;
    }
    if (liste.scrollWidth <= liste.clientWidth + 2) {
      return;
    }
    var fleches = document.createElement('div');
    fleches.className = 'sl-fleches';
    var precedent = document.createElement('button');
    precedent.type = 'button';
    precedent.className = 'sl-fleche sl-precedent';
    precedent.setAttribute('aria-label', 'Sous-catégories précédentes');
    var suivant = document.createElement('button');
    suivant.type = 'button';
    suivant.className = 'sl-fleche sl-suivant';
    suivant.setAttribute('aria-label', 'Sous-catégories suivantes');
    fleches.appendChild(precedent);
    fleches.appendChild(suivant);
    bloc.appendChild(fleches);

    var pas = function () {
      return Math.max(130, liste.clientWidth - 130);
    };
    var etat = function () {
      precedent.disabled = liste.scrollLeft <= 2;
      suivant.disabled = liste.scrollLeft + liste.clientWidth >= liste.scrollWidth - 2;
    };
    precedent.addEventListener('click', function () {
      liste.scrollBy({ left: -pas(), behavior: 'smooth' });
    });
    suivant.addEventListener('click', function () {
      liste.scrollBy({ left: pas(), behavior: 'smooth' });
    });
    liste.addEventListener('scroll', etat, { passive: true });
    etat();
  }

  /* 5. Bannière Virement Maîtrisé sous le bouton d'ajout */
  function banniereVirement() {
    if (document.body.id !== 'product') {
      return;
    }
    var banniere = document.querySelector('#product .product-prices .fintecture-banner-generic');
    var quantite = document.querySelector('#product .product-add-to-cart .product-quantity');
    if (!banniere || !quantite || !quantite.parentNode) {
      return;
    }
    // Après un changement de déclinaison, PrestaShop réaffiche les prix avec
    // une nouvelle bannière : l'ancienne ligne est retirée
    var ancienne = document.querySelector('#product .sl-paiement');
    if (ancienne && ancienne.parentNode) {
      ancienne.parentNode.removeChild(ancienne);
    }
    var ligne = document.createElement('div');
    ligne.className = 'sl-paiement';
    ligne.appendChild(banniere);
    quantite.parentNode.insertBefore(ligne, quantite.nextSibling);
  }

  function demarrer() {
    sur(texteCategorie);
    sur(filtres);
    sur(flechesSousCategories);
    sur(banniereVirement);
    if (window.prestashop && typeof window.prestashop.on === 'function') {
      window.prestashop.on('updatedProduct', function () {
        setTimeout(function () {
          sur(banniereVirement);
        }, 0);
      });
    }
    // Réaffichage de la liste et des filtres après un filtrage ou un tri
    if (window.prestashop && typeof window.prestashop.on === 'function') {
      window.prestashop.on('updatedProductList', function () {
        setTimeout(function () {
          sur(retirerDescriptionEnDouble);
          sur(filtres);
        }, 0);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
