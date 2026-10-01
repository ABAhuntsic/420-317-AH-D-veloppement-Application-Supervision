import Measure from "../models/measure.model.js";
import { buildFilter, buildSort } from "../utils/query.js";

// La couche a change de support : elle passe d'un tableau en memoire a
// MongoDB. Son interface, elle, n'a pas bouge -- c'est ce qui permet aux
// controleurs de rester identiques.

export async function add({ sensor, value }) {
  return Measure.create({ sensor, value });
}

export async function list(query = {}) {
  const filter = buildFilter(query);
  const sort = buildSort(query);

  return Measure.find(filter).sort(sort).populate("sensor", "name unit");
}

export async function getById(id) {
  return Measure.findById(id).populate("sensor", "name unit");
}

export async function getLatest() {
  return Measure.findOne().sort({ createdAt: -1 }).populate("sensor", "name unit");
}

export async function replace(id, { sensor, value }) {
  // new: true renvoie le document A JOUR (sinon on recoit l'ancien).
  // runValidators: true applique les contraintes du schema a la mise a jour.
  return Measure.findByIdAndUpdate(
    id,
    { sensor, value },
    { new: true, runValidators: true },
  );
}

export async function remove(id) {
  const deleted = await Measure.findByIdAndDelete(id);
  return deleted !== null;
}

export async function getStats() {
  const [stats] = await Measure.aggregate([
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        min: { $min: "$value" },
        max: { $max: "$value" },
        average: { $avg: "$value" },
      },
    },
  ]);

  if (!stats) return { count: 0, min: null, max: null, average: null };

  return {
    count: stats.count,
    min: stats.min,
    max: stats.max,
    average: Number(stats.average.toFixed(2)),
  };
}
