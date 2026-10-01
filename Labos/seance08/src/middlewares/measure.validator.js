import { body, validationResult } from "express-validator";

// Le middleware s'execute AVANT le controleur : quand celui-ci demarre,
// les donnees sont deja saines.
export const validateMeasure = [
  body("sensor").isMongoId()
    .withMessage("sensor doit etre l'identifiant d'un capteur existant"),
  body("value").isFloat()
    .withMessage("value doit etre un nombre"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
