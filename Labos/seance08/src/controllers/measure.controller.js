import * as service from "../services/measure.service.js";

export async function list(req, res, next) {
  try {
    // Le service nettoie et convertit lui-meme : voir utils/query.js
    res.status(200).json(await service.list(req.query));
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const measure = await service.getById(req.params.id);
    // Jamais 200 avec null : le client lit le code avant le corps.
    if (!measure) {
      return res.status(404).json({ error: "Mesure introuvable" });
    }
    res.status(200).json(measure);
  } catch (error) {
    next(error);
  }
}

export async function getLatest(req, res, next) {
  try {
    const measure = await service.getLatest();
    if (!measure) {
      return res.status(404).json({ error: "Aucune mesure enregistree" });
    }
    res.status(200).json(measure);
  } catch (error) {
    next(error);
  }
}

export async function getStats(req, res, next) {
  try {
    res.status(200).json(await service.getStats());
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    // Extraction explicite : le client ne doit pas pouvoir ecrire d'autres champs.
    const { sensor, value } = req.body;
    res.status(201).json(await service.add({ sensor, value }));
  } catch (error) {
    next(error);
  }
}

export async function replace(req, res, next) {
  try {
    const { sensor, value } = req.body;
    const updated = await service.replace(req.params.id, { sensor, value });
    if (!updated) {
      return res.status(404).json({ error: "Mesure introuvable" });
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
}

export async function remove(req, res, next) {
  try {
    if (!(await service.remove(req.params.id))) {
      return res.status(404).json({ error: "Mesure introuvable" });
    }
    // 204 : pas de corps, donc end() et non json().
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
