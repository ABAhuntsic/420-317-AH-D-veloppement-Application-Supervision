import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import { Sensor as SimulatedSensor } from "./sensor.js";
import { Monitor } from "./monitor.js";
import SensorModel from "./models/sensor.model.js";
import * as measureService from "./services/measure.service.js";

await connectDatabase();

// Au demarrage : s'assurer qu'un capteur existe en base, sinon le creer.
let sensorDocument = await SensorModel.findOne({ name: "Temperature salle serveurs" });

if (!sensorDocument) {
  sensorDocument = await SensorModel.create({
    name: "Temperature salle serveurs",
    room: "B1.127",
    unit: "C",
    min: -10,
    max: 50,
    threshold: 28,
    direction: "above",
  });
  console.log("Capteur cree :", sensorDocument.id);
}

// Le Monitor lit ses regles dans la base : le seuil vit avec le capteur.
const monitor = new Monitor({
  [sensorDocument.id]: {
    threshold: sensorDocument.threshold,
    direction: sensorDocument.direction,
  },
});

monitor.on("alert", (measure) => {
  console.log(`   >>> SEUIL DEPASSE : ${measure.value} (seuil ${measure.threshold})`);
});

const simulated = new SimulatedSensor(sensorDocument.id, { min: 18, max: 32 });

simulated.on("measure", async (measure) => {
  try {
    await measureService.add({ sensor: measure.sensor, value: measure.value });
    monitor.check(measure);
  } catch (error) {
    console.error("Enregistrement impossible :", error.message);
  }
});

simulated.start();

app.listen(process.env.PORT || 3000, () =>
  console.log(`http://localhost:${process.env.PORT || 3000}`),
);
