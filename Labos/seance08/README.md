# Supervision — 420-317-AH

## État après la séance 8

L'API de consultation des mesures est complète : filtrer, trier, en plus des routes de lecture
simples posées à la séance 6. La persistance (séance 7) et le découpage en couches (séance 5-6)
n'ont pas bougé.

## Configuration

Copier `.env.exemple` en `.env` et remplir :

```
MONGO_URI=mongodb+srv://user:motdepasse@cluster0.xxxxx.mongodb.net/supervision
PORT=3000
```

Le nom de la base (`/supervision`) doit apparaître avant le `?`, sinon les documents partent
dans une base nommée `test`.

## Modèles

| Collection | Champs |
|---|---|
| `sensors` | `_id` (texte, choisi par l'utilisateur), `name`, `unit`, `min`, `max`, `threshold`, `direction`, `active` |
| `measures` | `sensor` (texte → Sensor), `value`, `createdAt` |

**`Sensor._id` est une chaîne choisie par l'utilisateur**, pas un ObjectId généré par Mongo —
cet identifiant deviendra le nom du sujet MQTT auquel le serveur s'abonnera (séance 14), d'où
la contrainte de format dans le schéma. `Measure.sensor` est donc une chaîne elle aussi, pas un
ObjectId, mais `ref: "Sensor"` continue de fonctionner avec `populate`.

Le seuil et sa direction vivent avec le **capteur**, pas avec la mesure.

## Filtrer et trier (séance 8)

`GET /api/measures` accepte des paramètres combinables :

| Paramètre | Effet |
|---|---|
| `?sensor=` | mesures de ce capteur |
| `?min=` / `?max=` | intervalle de valeurs |
| `?from=` / `?to=` | intervalle de dates |
| `?sort=` | `createdAt` ou `value` — tout autre nom retombe sur `createdAt` |
| `?order=` | `asc` ou `desc` (défaut) |

`buildFilter` et `buildSort` (`src/utils/query.js`) sont des **fonctions pures** : elles ne
dépendent ni d'Express ni de Mongoose, et transforment `req.query` en filtre MongoDB sans jamais
passer `req.query` tel quel à `find()` — on ne lit que les paramètres attendus, un par un.

## Points de conception

**Identifiants.** Deux comportements distincts, à ne pas confondre :

| | `sensors` | `measures` |
|---|---|---|
| `_id` | chaîne, choisie par l'utilisateur | ObjectId, généré par Mongo |
| Validation de l'id | `body("id")` + regex MQTT (`sensor.validator.js`) | `param("id").isMongoId()` (`measure.validator.js`) |
| Identifiant dupliqué | `409`, erreur Mongo 11000 | n'arrive jamais (généré) |
| Identifiant mal formé | n'importe quelle chaîne non vide passe | `400` via `isMongoId()` |

Les deux validateurs partagent `handleValidationErrors`
(`src/middlewares/validationErrors.middleware.js`) : un seul format de réponse d'erreur,
`{ errors: ["message", ...] }`, pour toute l'API.

**`ref` ne garantit aucune intégrité référentielle.** Une mesure peut référencer un `sensor`
qui n'existe pas en base, sans erreur. `populate("sensor")` renvoie simplement `null` dans ce
cas. Ce lien ne devient une vraie règle appliquée qu'à la séance 14, quand l'acquisition MQTT
filtrera sur les capteurs actifs en base.

**Mises à jour.** `{ new: true, runValidators: true }` sur `findByIdAndUpdate` : sans la
première option on récupère l'ancien document, sans la seconde le schéma n'est pas vérifié.

**Index.** Sur `sensor` et `createdAt` — déclarés dès la séance 7, utilisés directement par les
filtres et le tri de cette séance.

## Tests

```
npm test
```

| Fichier | Teste | Nombre |
|---|---|---|
| `schema.test.js` | Contraintes Mongoose (`validateSync()`) | 10 |
| `query.test.js` | `buildFilter` et `buildSort`, fonctions pures | 12 |

Les deux fichiers s'exécutent **sans connexion** à MongoDB.

## Lancer

```
npm install
npm run dev
```