# Supervision — 420-317-AH

Projet de session : système de supervision et de monitorage.

## Environnement

Terminal intégré de VS Code pour tout le monde. Sous Windows, le profil par défaut doit être
**Git Bash** (`Ctrl+Maj+P` → « Terminal: Select Default Profile ») : PowerShell bloque `npm`
par défaut et ne connaît ni `rm -rf` ni `curl`.

## État après la séance 1

- Dépôt initialisé, `.gitignore` en place avant le premier commit
- `docs/sensor.json` — description d'un capteur (un appareil)
- `docs/measure.json` — une mesure unique (une valeur, un instant)
- `docs/measures.json` — une liste de mesures
- `docs/questions.md`, `docs/observations.md`

## Les deux formats, à ne pas confondre

Un **capteur** est décrit une fois : identifiant, unité, bornes, seuil, direction du seuil.
Une **mesure** est une seule valeur relevée à un instant donné, qui renvoie au capteur par son
champ `sensor`. Elle ne répète ni l'unité ni le seuil, et ne contient jamais de tableau de
valeurs — l'ESP32 en publiera une à la fois.
