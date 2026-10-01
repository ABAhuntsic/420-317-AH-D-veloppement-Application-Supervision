import { Router } from "express";
import * as controller from "../controllers/measure.controller.js";
import { validateObjectId } from "../middlewares/objectId.middleware.js";
import { validateMeasure } from "../middlewares/measure.validator.js";

const router = Router();

// Les routes fixes AVANT les routes a parametre, sinon /latest serait
// capture par /:id.
router.get("/", controller.list);
router.get("/latest", controller.getLatest);
router.get("/stats", controller.getStats);
router.get("/:id", validateObjectId, controller.getOne);

router.post("/", validateMeasure, controller.create);
router.put("/:id", validateObjectId, validateMeasure, controller.replace);
router.delete("/:id", validateObjectId, controller.remove);

export default router;
