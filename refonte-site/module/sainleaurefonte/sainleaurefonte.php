<?php
/**
 * SAINLEAU · Refonte graphique
 *
 * Applique la nouvelle direction artistique de sainleau.com sans toucher au
 * thème : le module charge une feuille de style (views/css/sainleau.css) et
 * un petit script (views/js/sainleau.js) après ceux du thème et des autres
 * modules. Les polices Montserrat et les icônes Phosphor sont embarquées dans
 * views/fonts et views/img/icons.
 *
 * Le module ne stocke aucune donnée et n'a pas de page de configuration.
 * Retour arrière : désactiver le module.
 *
 * Compatible PrestaShop 1.7.8 et 9.x.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Sainleaurefonte extends Module
{
    public function __construct()
    {
        $this->name = 'sainleaurefonte';
        $this->tab = 'front_office_features';
        $this->version = '1.1.0';
        $this->author = 'SAINLEAU';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = ['min' => '1.7.8.0', 'max' => _PS_VERSION_];
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = 'SAINLEAU · Refonte graphique';
        $this->description = 'Nouvelle direction artistique de sainleau.com : feuille de style, polices et icônes chargées après le thème.';
    }

    public function install()
    {
        return parent::install()
            && $this->registerHook('actionFrontControllerSetMedia');
    }

    /**
     * Enregistre la feuille et le script de la refonte.
     *
     * Priorité 2000 : après theme.css (50), les feuilles des modules (50 par
     * défaut) et custom.css (1000). Le numéro de version est ajouté aux
     * adresses pour que les navigateurs rechargent les fichiers à chaque
     * mise à jour du module.
     */
    public function hookActionFrontControllerSetMedia()
    {
        $controller = $this->context->controller;
        if (!$controller || !method_exists($controller, 'registerStylesheet')) {
            return;
        }

        $controller->registerStylesheet(
            'module-sainleaurefonte',
            'modules/' . $this->name . '/views/css/sainleau.css',
            ['media' => 'all', 'priority' => 2000, 'version' => $this->version]
        );

        $controller->registerJavascript(
            'module-sainleaurefonte',
            'modules/' . $this->name . '/views/js/sainleau.js',
            ['position' => 'bottom', 'priority' => 2000, 'version' => $this->version]
        );
    }
}
