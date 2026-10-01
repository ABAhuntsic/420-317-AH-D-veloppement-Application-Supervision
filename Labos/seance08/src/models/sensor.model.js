import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  room: { type: String, trim: true },
  unit: { type: String, required: true, trim: true },

  // Bornes physiques : dependent du capteur choisi pour le projet final.
  min: { type: Number, required: true },
  max: { type: Number, required: true },

  // Le seuil et sa direction appartiennent au capteur, pas a la mesure.
  // C'est ici que le Monitor lira ses regles.
  threshold: { type: Number, required: true },
  direction: { type: String, required: true, enum: ["above", "below"] },

  active: { type: Boolean, default: true },
});

export default mongoose.model("Sensor", sensorSchema);
