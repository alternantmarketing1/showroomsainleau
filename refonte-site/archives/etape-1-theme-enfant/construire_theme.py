#!/usr/bin/env python3
"""Construit le zip du thème enfant SAINLEAU, prêt à importer dans PrestaShop.

Point de départ : l'export du thème actuel PRS005_07_child, obtenu dans le
back-office par Apparence > Thème et logo > « Exporter le thème actuel ».

Le script :
  1. décompresse l'export dans un dossier temporaire ;
  2. vérifie qu'il s'agit bien du thème PRS005_07_child (et non d'un modèle
     de thème enfant vide) ;
  3. retire le dossier dependencies/ : à l'import, PrestaShop recopierait ces
     modules dans /modules et écraserait les fichiers des modules installés ;
  4. ajoute la couche SAINLEAU (theme/PRS005_07_sainleau : feuille de style,
     polices, icônes, templates surchargés) ;
  5. modifie config/theme.yml : nouveau nom, parent PRS005_07, déclaration de
     assets/css/sainleau.css avec une priorité qui la charge après toutes les
     autres feuilles ;
  6. contrôle le résultat et écrit PRS005_07_sainleau_vN.zip, avec
     config/theme.yml à la racine du zip, comme l'attend l'import de
     PrestaShop (Apparence > Thème et logo > Ajouter un nouveau thème).

Usage :
  python3 refonte-site/outils/construire_theme.py EXPORT.zip --version 1
  python3 refonte-site/outils/construire_theme.py EXPORT.zip --version 1 --essai

--essai accepte un zip qui n'est pas l'export de PRS005_07_child (par exemple
le modèle de thème enfant) pour tester la chaîne ; le zip produit porte alors
la mention ESSAI et ne doit pas être importé.

Aucune information de connexion n'est lue ni écrite par ce script.
"""

import argparse
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

import yaml

RACINE = Path(__file__).resolve().parent.parent
COUCHE = RACINE / "theme" / "PRS005_07_sainleau"
PARENT = "PRS005_07"
THEME_ACTUEL = "PRS005_07_child"
FEUILLE = {
    "id": "theme-sainleau",
    "path": "assets/css/sainleau.css",
    "media": "all",
    # après theme.css (50), les modules (50 par défaut) et custom.css (1000)
    "priority": 2000,
}


def erreur(message):
    print(f"ERREUR : {message}", file=sys.stderr)
    sys.exit(1)


def extraire(zip_path, destination):
    with zipfile.ZipFile(zip_path) as z:
        for info in z.infolist():
            cible = (destination / info.filename).resolve()
            if not str(cible).startswith(str(destination.resolve())):
                erreur(f"chemin suspect dans le zip : {info.filename}")
        z.extractall(destination)
    # export du back-office : fichiers à la racine ; modèle de thème enfant :
    # un dossier unique contenant le thème
    if (destination / "config" / "theme.yml").is_file():
        return destination
    dossiers = [d for d in destination.iterdir() if d.is_dir() and d.name != "__MACOSX"]
    if len(dossiers) == 1 and (dossiers[0] / "config" / "theme.yml").is_file():
        return dossiers[0]
    erreur("config/theme.yml introuvable dans le zip")


def fusionner_feuille(config):
    assets = config.get("assets") or {}
    if not isinstance(assets, dict):
        erreur("la clé assets de theme.yml n'a pas la forme attendue")
    css = assets.get("css") or {}
    toutes = [e for e in (css.get("all") or []) if e.get("id") != FEUILLE["id"]]
    toutes.append(dict(FEUILLE))
    css["all"] = toutes
    assets["css"] = css
    config["assets"] = assets


def controler(theme_dir, nom):
    config = yaml.safe_load((theme_dir / "config" / "theme.yml").read_text(encoding="utf-8"))
    problemes = []
    if config.get("parent") != PARENT:
        problemes.append(f"parent attendu {PARENT}, trouvé {config.get('parent')}")
    if config.get("name") != nom:
        problemes.append(f"nom attendu {nom}, trouvé {config.get('name')}")
    if (theme_dir / "dependencies").exists():
        problemes.append("le dossier dependencies/ est encore présent")
    feuille = theme_dir / FEUILLE["path"]
    if not feuille.is_file():
        problemes.append("assets/css/sainleau.css manquant")
    else:
        texte = feuille.read_text(encoding="utf-8")
        for url in re.findall(r'url\("(\.\./[^"]+)"\)', texte):
            if not (feuille.parent / url).resolve().is_file():
                problemes.append(f"fichier référencé par la feuille introuvable : {url}")
        sans_commentaires = re.sub(r"/\*.*?\*/", "", texte, flags=re.S)
        couleurs = {c.lower() for c in re.findall(r"#[0-9a-fA-F]{3,8}\b", sans_commentaires)}
        couleurs |= {f"rgb({c})" for c in re.findall(r"rgba?\(([^)]*)\)", sans_commentaires)}
        charte = {"#25acb0", "#0d6e72", "#0a5a5d", "#cdf3f4", "#6c6666", "#1b1b1b",
                  "#f5f5f5", "#d6d6d6", "#707070", "#d0f3fd", "#ffffff"}
        hors_charte = couleurs - charte
        if hors_charte:
            problemes.append(f"couleurs hors charte dans la feuille : {sorted(hors_charte)}")
    return problemes


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("export", type=Path, help="zip exporté depuis le back-office")
    parser.add_argument("--version", type=int, required=True, help="numéro de version (1, 2, 3…)")
    parser.add_argument("--sortie", type=Path, default=RACINE / "livrables", help="dossier du zip produit")
    parser.add_argument("--essai", action="store_true", help="accepter un zip qui n'est pas l'export de PRS005_07_child")
    args = parser.parse_args()

    if not args.export.is_file():
        erreur(f"zip introuvable : {args.export}")
    nom = f"PRS005_07_sainleau_v{args.version}"

    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        source = extraire(args.export, tmp / "export")
        config = yaml.safe_load((source / "config" / "theme.yml").read_text(encoding="utf-8")) or {}

        # 2. bien l'export du thème actuel ?
        origine = config.get("name")
        if origine != THEME_ACTUEL or config.get("parent") != PARENT:
            message = (f"ce zip contient le thème « {origine} » (parent « {config.get('parent')} »), "
                       f"pas l'export de {THEME_ACTUEL} (parent {PARENT}).")
            if not args.essai:
                erreur(message + " Exporter le thème actuel depuis Apparence > Thème et logo.")
            print(f"ATTENTION (essai) : {message}")
            nom += "_ESSAI"

        theme_dir = tmp / nom
        shutil.copytree(source, theme_dir)

        # 3. pas de modules dans le zip
        if (theme_dir / "dependencies").exists():
            shutil.rmtree(theme_dir / "dependencies")
            print("dependencies/ retiré (les fichiers des modules ne sont pas modifiés)")

        # 4. couche SAINLEAU (tout sauf config/, qui est fusionné ci-dessous)
        for fichier in sorted(COUCHE.rglob("*")):
            if fichier.is_dir() or fichier.relative_to(COUCHE).parts[0] == "config":
                continue
            cible = theme_dir / fichier.relative_to(COUCHE)
            cible.parent.mkdir(parents=True, exist_ok=True)
            remplace = cible.exists()
            shutil.copy2(fichier, cible)
            if remplace and fichier.suffix in {".tpl", ".css", ".js"}:
                print(f"remplacé : {fichier.relative_to(COUCHE)}")

        # 5. theme.yml
        config["name"] = nom
        config["display_name"] = f"SAINLEAU refonte v{args.version}"
        config["parent"] = PARENT
        config["version"] = f"{args.version}.0.0"
        fusionner_feuille(config)
        (theme_dir / "config" / "theme.yml").write_text(
            yaml.safe_dump(config, allow_unicode=True, sort_keys=False, default_flow_style=False, width=120),
            encoding="utf-8",
        )

        # 6. contrôles et zip (config/theme.yml à la racine)
        problemes = controler(theme_dir, nom)
        if problemes:
            for p in problemes:
                print(f"  - {p}", file=sys.stderr)
            erreur("contrôles non passés, zip non produit")

        args.sortie.mkdir(parents=True, exist_ok=True)
        zip_path = args.sortie / f"{nom}.zip"
        with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
            for fichier in sorted(theme_dir.rglob("*")):
                if fichier.is_file():
                    z.write(fichier, fichier.relative_to(theme_dir).as_posix())
        nb = sum(1 for f in theme_dir.rglob("*") if f.is_file())
        print(f"OK : {zip_path} ({nb} fichiers, {zip_path.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
