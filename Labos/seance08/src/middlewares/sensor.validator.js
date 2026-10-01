import { body, validationResult } from "express-validator";

export const validateSensor = [
  body("name").isString().trim().notEmpty(),
  body("unit").isString().trim().notEmpty(),
  body("min").isFloat(),
  body("max").isFloat(),
  body("threshold").isFloat(),
  body("direction").isIn(["above", "below"])
    .withMessage("direction doit valoir above ou below"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
