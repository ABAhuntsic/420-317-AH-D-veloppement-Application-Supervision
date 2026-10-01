import { Router } from "express";
import * as controller from "../controllers/sensor.controller.js";
import { validateObjectId } from "../middlewares/objectId.middleware.js";
import { validateSensor } from "../middlewares/sensor.validator.js";

const router = Router();

router.get("/", controller.list);
router.get("/:id", validateObjectId, controller.getOne);
router.post("/", validateSensor, controller.create);
router.delete("/:id", validateObjectId, controller.remove);

export default router;
