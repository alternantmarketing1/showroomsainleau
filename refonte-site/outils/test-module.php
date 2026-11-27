<?php
// Banc d'essai minimal : simule Module et le contrôleur pour vérifier le hook.
define('_PS_VERSION_', '9.0.2');
class Module {
    public $context; public $name; public $hooks = [];
    public function __construct() { $this->context = new stdClass(); }
    public function install() { return true; }
    public function registerHook($h) { $this->hooks[] = $h; return true; }
}
class FauxControleur {
    public $appels = [];
    public function registerStylesheet($id, $chemin, $params) { $this->appels[] = ['css', $id, $chemin, $params]; }
    public function registerJavascript($id, $chemin, $params) { $this->appels[] = ['js', $id, $chemin, $params]; }
}
require $argv[1];
$m = new Sainleaurefonte();
var_dump($m->install(), $m->hooks, $m->version, $m->displayName);
$m->context->controller = new FauxControleur();
$m->hookActionFrontControllerSetMedia();
print_r($m->context->controller->appels);
$m->context->controller = null;
$m->hookActionFrontControllerSetMedia();
echo "sans controleur : ok\n";
