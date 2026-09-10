# Observations de requêtes — exemple attendu

| # | Méthode | Chemin | Statut | Content-Type |
|---|---|---|---|---|
| 1 | GET | `/` | 200 | `text/html; charset=utf-8` |
| 2 | GET | `/assets/style.css` | 200 | `text/css` |
| 3 | GET | `/api/session` | 401 | `application/json` |

## Thunder Client

- `GET /v1/forecast?...` → **200**, `application/json`
- `GET /v1/forecastXYZ?...` → **404** (chemin inexistant)
- `GET /v1/forecast?longitude=-73.6` → **400** (paramètre `latitude` manquant)

Le 400 est de la faute du client : la requête est mal formée. Le serveur n'a pas planté, il a
refusé.
