# Questions de compréhension — séance 1

## 1. Les deux rôles de notre serveur Node

Il est **serveur** face au navigateur du technicien : c'est le navigateur qui prend l'initiative de la requête, node répond.

Il est **client** face à MongoDB Atlas : c'est node qui prend l'initiative, et c'est Atlas qui
répond.

## 2. Pourquoi ce sont des rôles

Le rôle dépend de qui prend l'initiative de la requête, pas du matériel ni du programme. Le
même programme est serveur pour les uns et client pour les autres, parfois dans la même
seconde.

## 3. `localhost`

`localhost` désigne toujours **la machine qui exécute le code**, pas une adresse fixe.

Si mon voisin tape `http://localhost:3000` sur son portable, il ne joint pas mon serveur : il
joint le sien, ou n'obtient rien du tout si aucun programme n'écoute chez lui.

## 4. Le port

L'adresse désigne la machine, le port désigne le **programme** sur cette machine. Une machine
héberge plusieurs serveurs, chacun sur son port : 3000 pour le nôtre, 27017 pour MongoDB.

Si deux programmes veulent le même port, le second refuse de démarrer avec l'erreur
`EADDRINUSE`.

## 5. Le serveur ne parle jamais en premier

Une alerte de température arrive au serveur. Le navigateur du technicien est ouvert, mais le
serveur n'a pas le droit de le prévenir : il doit attendre que le navigateur redemande. Pour de
la supervision, l'alerte peut donc arriver avec plusieurs secondes de retard. C'est le problème
que le WebSocket réglera à la séance 12.

## 6. Codes de statut

| Situation | Code |
|---|---|
| Une mesure enregistrée | 201 |
| Une valeur envoyée en texte au lieu d'un nombre | 400 |
| Une mesure demandée qui n'existe pas | 404 |
| La base de données injoignable | 500 |
