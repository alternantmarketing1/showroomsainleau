/**
 * SAINLEAU · Refonte graphique : script complémentaire de la feuille.
 *
 * Utilisé en dernier recours, quand le CSS ne peut pas atteindre un élément.
 * Règles :
 *  - aucune bibliothèque, aucune animation ;
 *  - chaque fonction vérifie que ses éléments existent et ne lève jamais
 *    d'erreur ;
 *  - chaque fonction peut être rejouée sans rien dupliquer : elle est
 *    relancée après chaque réaffichage partiel de la page (filtres, tri,
 *    pagination, changement de déclinaison) ;
 *  - aucun champ de formulaire n'est créé, modifié ni déplacé ; aucune action
 *    sur le panier ni la commande.
 *
 * Fonctions :
 *  1. Catégorie : introduction (premier paragraphe de la description) sous
 *     le titre, avec « Lire la suite ».
 *  2. Catégorie : texte SEO dans une section pleine largeur sous la liste,
 *     avec « Lire la suite ».
 *  3. Filtres : groupes repliables et « Voir les N autres » au-delà de
 *     6 valeurs. L'état replié ou ouvert est conservé après un filtrage.
 *  4. Sous-catégories : flèches de défilement quand la ligne dépasse.
 *  5. Fiche produit : bannière Virement Maîtrisé sous le bouton « Ajouter au
 *     panier » (le module Fintecture l'affiche dans les prix). Seule l'image
 *     est déplacée.
 *  6. Fiche produit : fil d'Ariane complété par « Accueil » au début et le
 *     nom du produit à la fin, comme sur les autres pages.
 *  7. Fiche produit : « Marque : » gardé sur la même ligne que sa valeur.
 *  8. Bandeau pro : découpé en segments ; sur mobile, seuls les deux premiers
 *     s'affichent (feuille, section 16).
 *  9. Accueil : titre complet des articles du blog, quand le module le coupe
 *     (le titre complet est repris du texte alternatif de l'image).
 */
(function () {
  'use strict';

  var PAGES_LISTE = ['category', 'prices-drop', 'new-products', 'best-sales', 'search', 'manufacturer'];
  var LIMITE_FILTRES = 6;

  // Mémoire entre deux réaffichages
  var introSauvegardee = null;
  var groupesReplies = {};
  var groupesOuverts = {};

  function sur(fonction) {
    try {
      fonction();
    } catch (erreur) {
      if (window.console && console.warn) {
        console.warn('sainleaurefonte :', erreur);
      }
    }
  }

  function chaque(liste, fonction) {
    Array.prototype.forEach.call(liste, fonction);
  }

  function estPageListe() {
    return PAGES_LISTE.indexOf(document.body.id) !== -1;
  }

  function retirer(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
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

  /* 1 et 2. Introduction et texte SEO de la catégorie ---------------------- */
  function texteCategorie() {
    if (!estPageListe()) {
      return;
    }
    var entete = document.querySelector('#js-product-list-header .block-category');
    var section = document.querySelector('.sl-texte-categorie');

    // Rejeu : après un filtrage, PrestaShop remplace l'en-tête (l'introduction
    // disparaît) et la liste (une nouvelle copie de la description apparaît).
    if (section) {
      chaque(document.querySelectorAll('#category-description'), function (description) {
        if (section.contains(description)) {
          return;
        }
        var bloc = description.closest('.block-category');
        retirer(bloc && bloc !== entete ? bloc : description);
      });
      if (entete && introSauvegardee && !entete.querySelector('.sl-intro')) {
        entete.appendChild(introSauvegardee);
      }
      return;
    }

    var description = document.getElementById('category-description');
    var blocDescription = description ? description.closest('.block-category') : null;
    var contenu = document.querySelector('.content_wrap > .container');
    if (!description || !blocDescription || blocDescription === entete || !contenu) {
      return;
    }

    // Introduction : le premier paragraphe et ce qui le suit, jusqu'au titre
    // suivant. Un titre placé avant le premier paragraphe reste dans le texte.
    // Les éléments sont déplacés, pas copiés.
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
          continue;
        }
        if (nom === 'P' && enfants[i].textContent.trim() !== '') {
          paragrapheVu = true;
        }
        aDeplacer.push(enfants[i]);
      }
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
        introSauvegardee = intro;
      }
    }

    // Texte SEO : section pleine largeur après la liste
    section = document.createElement('section');
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

  /* 3. Filtres repliables et « Voir les N autres » ------------------------- */
  function nomGroupe(groupe) {
    var titre = groupe.querySelector(':scope > .facet-title');
    return titre ? titre.textContent.trim() : '';
  }

  function filtres() {
    chaque(document.querySelectorAll('#search_filters .facet'), function (groupe) {
      if (groupe.getAttribute('data-sl-pret') === '1') {
        return;
      }
      groupe.setAttribute('data-sl-pret', '1');
      var nom = nomGroupe(groupe);

      var titre = groupe.querySelector(':scope > .facet-title');
      var liste = groupe.querySelector(':scope > ul');
      if (titre && liste) {
        var replieAuDepart = groupesReplies[nom] === true;
        groupe.classList.toggle('sl-replie', replieAuDepart);
        titre.setAttribute('role', 'button');
        titre.setAttribute('tabindex', '0');
        titre.setAttribute('aria-expanded', replieAuDepart ? 'false' : 'true');
        var basculer = function () {
          var replie = groupe.classList.toggle('sl-replie');
          groupesReplies[nom] = replie;
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
      var ouvertAuDepart = groupesOuverts[nom] === true;
      chaque(valeurs, function (valeur, index) {
        if (index >= LIMITE_FILTRES && !ouvertAuDepart) {
          valeur.classList.add('sl-en-trop');
        }
      });
      var bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'sl-lien-action sl-voir-plus';
      bouton.setAttribute('aria-expanded', ouvertAuDepart ? 'true' : 'false');
      bouton.textContent = ouvertAuDepart ? 'Voir moins' : 'Voir les ' + nombre + ' autres';
      bouton.addEventListener('click', function () {
        var ouvert = bouton.getAttribute('aria-expanded') === 'true';
        chaque(valeurs, function (valeur, index) {
          if (index >= LIMITE_FILTRES) {
            valeur.classList.toggle('sl-en-trop', ouvert);
          }
        });
        groupesOuverts[nom] = !ouvert;
        bouton.setAttribute('aria-expanded', ouvert ? 'false' : 'true');
        bouton.textContent = ouvert ? 'Voir les ' + nombre + ' autres' : 'Voir moins';
      });
      liste.parentNode.insertBefore(bouton, liste.nextSibling);
    });
  }

  /* 4. Flèches des sous-catégories ----------------------------------------- */
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

  /* 5. Bannière Virement Maîtrisé sous le bouton d'ajout ------------------ */
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
    retirer(document.querySelector('#product .sl-paiement'));
    var ligne = document.createElement('div');
    ligne.className = 'sl-paiement';
    ligne.appendChild(banniere);
    quantite.parentNode.insertBefore(ligne, quantite.nextSibling);
  }

  /* 6. Fil d'Ariane de la fiche produit ------------------------------------ */
  function filArianeProduit() {
    if (document.body.id !== 'product') {
      return;
    }
    var liste = document.querySelector('#wrapper > .breadcrumb ol');
    var titre = document.querySelector('#product h1');
    if (!liste || liste.getAttribute('data-sl-pret') === '1') {
      return;
    }
    liste.setAttribute('data-sl-pret', '1');
    var accueil = (window.prestashop && prestashop.urls && prestashop.urls.base_url) || '/';
    var premier = liste.querySelector('li a');
    var adressePremier = premier ? premier.getAttribute('href') : '';
    if (adressePremier !== accueil && adressePremier !== '/') {
      var elementAccueil = document.createElement('li');
      var lien = document.createElement('a');
      lien.href = accueil;
      var libelle = document.createElement('span');
      libelle.textContent = 'Accueil';
      lien.appendChild(libelle);
      elementAccueil.appendChild(lien);
      liste.insertBefore(elementAccueil, liste.firstChild);
    }
    if (titre) {
      var nomProduit = titre.textContent.trim();
      var dernier = liste.querySelector('li:last-child');
      if (nomProduit && dernier && dernier.textContent.trim() !== nomProduit) {
        // Le nom du produit termine le fil, comme sur la maquette
        var elementProduit = document.createElement('li');
        var texteProduit = document.createElement('span');
        texteProduit.textContent = nomProduit;
        elementProduit.setAttribute('aria-current', 'page');
        elementProduit.appendChild(texteProduit);
        liste.appendChild(elementProduit);
      }
    }
  }

  /* 7. « Marque : » et sa valeur sur la même ligne ------------------------ */
  function pairesEtiquettes() {
    var bloc = document.querySelector('#product .product-labels');
    if (!bloc || bloc.querySelector('.sl-paire')) {
      return;
    }
    chaque(bloc.querySelectorAll(':scope > label'), function (etiquette) {
      var valeur = etiquette.nextElementSibling;
      if (!valeur || valeur.tagName === 'LABEL') {
        return;
      }
      var paire = document.createElement('span');
      paire.className = 'sl-paire';
      bloc.insertBefore(paire, etiquette);
      paire.appendChild(etiquette);
      paire.appendChild(valeur);
    });
  }

  /* 8. Bandeau pro découpé en segments ------------------------------------ */
  function bandeauMobile() {
    var bandeau = document.querySelector('#ttcmsheader p') || document.getElementById('ttcmsheader');
    if (!bandeau || document.querySelector('#ttcmsheader .sl-segment')) {
      return;
    }
    // Le texte peut être enveloppé (<p><b>…</b></p>) : on descend jusqu'à
    // l'élément qui le porte
    var seulEnfant = function (element) {
      return element.children.length === 1 && Array.prototype.every.call(element.childNodes, function (noeud) {
        return noeud.nodeType !== 3 || noeud.nodeValue.trim() === '';
      });
    };
    while (seulEnfant(bandeau)) {
      bandeau = bandeau.children[0];
    }
    var SEPARATEUR = /\s+[-–·•|]\s+/;
    var segments = [document.createDocumentFragment()];
    var separateurs = [];
    chaque(Array.prototype.slice.call(bandeau.childNodes), function (noeud) {
      if (noeud.nodeType !== 3) {
        segments[segments.length - 1].appendChild(noeud);
        return;
      }
      var reste = noeud.nodeValue;
      var trouve = reste.match(SEPARATEUR);
      while (trouve) {
        segments[segments.length - 1].appendChild(document.createTextNode(reste.slice(0, trouve.index)));
        separateurs.push(trouve[0]);
        segments.push(document.createDocumentFragment());
        reste = reste.slice(trouve.index + trouve[0].length);
        trouve = reste.match(SEPARATEUR);
      }
      segments[segments.length - 1].appendChild(document.createTextNode(reste));
      bandeau.removeChild(noeud);
    });
    if (segments.length < 3) {
      // Rien à raccourcir : le texte est remis tel quel
      segments.forEach(function (fragment) {
        bandeau.appendChild(fragment);
      });
      return;
    }
    segments.forEach(function (fragment, rang) {
      if (rang > 0) {
        var separateur = document.createElement('span');
        separateur.className = 'sl-separateur' + (rang > 1 ? ' sl-secondaire' : '');
        separateur.textContent = separateurs[rang - 1];
        bandeau.appendChild(separateur);
      }
      var segment = document.createElement('span');
      segment.className = 'sl-segment' + (rang > 1 ? ' sl-secondaire' : '');
      segment.appendChild(fragment);
      bandeau.appendChild(segment);
    });
  }

  /* 9. Titres complets des articles du blog ------------------------------- */
  function titresBlog() {
    chaque(document.querySelectorAll('#smartblog_block .blog_post'), function (article) {
      var lien = article.querySelector('.sds_post_title a');
      var image = article.querySelector('.news_module_image_holder img[alt]');
      if (!lien || !image || lien.getAttribute('data-sl-pret') === '1') {
        return;
      }
      lien.setAttribute('data-sl-pret', '1');
      var coupe = lien.textContent.trim();
      if (!/(\.\.\.|…)$/.test(coupe)) {
        return;
      }
      var debut = coupe.replace(/(\.\.\.|…)$/, '').replace(/[\s,;:]+$/, '');
      var complet = image.getAttribute('alt').split(' | ')[0].trim();
      if (debut && complet.indexOf(debut) === 0 && complet.length > debut.length) {
        lien.textContent = complet;
      }
    });
  }

  /* Lancement et rejeu ------------------------------------------------------ */
  function tout() {
    sur(texteCategorie);
    sur(filtres);
    sur(flechesSousCategories);
    sur(banniereVirement);
    sur(filArianeProduit);
    sur(pairesEtiquettes);
    sur(bandeauMobile);
    sur(titresBlog);
  }

  var attente = null;
  function rejouer() {
    if (attente) {
      clearTimeout(attente);
    }
    attente = setTimeout(function () {
      attente = null;
      tout();
    }, 60);
  }

  function demarrer() {
    tout();
    // Événements du cœur de PrestaShop et du thème après un réaffichage
    if (window.prestashop && typeof window.prestashop.on === 'function') {
      ['updateProductList', 'updatedProductList', 'updateFacets', 'updatedProduct'].forEach(function (nom) {
        window.prestashop.on(nom, rejouer);
      });
    }
    // Filet de sécurité : tout remplacement de bloc dans la page relance les
    // fonctions (elles ne font rien si tout est déjà en place)
    var cible = document.getElementById('wrapper');
    if (cible && window.MutationObserver && (estPageListe() || document.body.id === 'product')) {
      new MutationObserver(function (mutations) {
        var utile = mutations.some(function (mutation) {
          return mutation.addedNodes.length > 0;
        });
        if (utile) {
          rejouer();
        }
      }).observe(cible, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
