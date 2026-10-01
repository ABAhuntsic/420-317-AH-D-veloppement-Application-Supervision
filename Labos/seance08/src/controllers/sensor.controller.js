import * as service from "../services/sensor.service.js";

export async function list(req, res, next) {
  try {
    res.status(200).json(await service.list());
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const sensor = await service.getById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ error: "Capteur introuvable" });
    }
    res.status(200).json(sensor);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    // Plus de champ id : MongoDB genere _id lui-meme.
    const { name, room, unit, min, max, threshold, direction } = req.body;
    res.status(201).json(await service.add({ name, room, unit, min, max, threshold, direction }));
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    if (!(await service.remove(req.params.id))) {
      return res.status(404).json({ error: "Capteur introuvable" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
