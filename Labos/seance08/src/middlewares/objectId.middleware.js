import mongoose from "mongoose";

/**
 * Un identifiant MAL FORME est une faute du client : 400.
 * Un identifiant bien forme mais ABSENT est une ressource introuvable : 404,
 * et c'est le controleur qui s'en charge.
 *
 * Sans ce middleware, findById("bonjour") leve un CastError et part en 500.
 */
export function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Identifiant invalide" });
  }
  next();
}
