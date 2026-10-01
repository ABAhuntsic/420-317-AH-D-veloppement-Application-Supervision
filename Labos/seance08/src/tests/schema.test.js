/**
 * Tests des schemas, executables SANS connexion a MongoDB.
 *
 * validateSync() applique les contraintes du schema sur un document en
 * memoire : c'est la faconde verifier required, min, max et enum sans
 * qu'aucune base ne tourne.
 *
 * Lancer avec : npm test
 */
import assert from "assert";
import mongoose from "mongoose";
import Measure from "../models/measure.model.js";
import Sensor from "../models/sensor.model.js";

let passed = 0;
function test(nom, fn) {
  fn();
  passed += 1;
  console.log(`  ok  ${nom}`);
}

console.log("\nSchema Sensor");

test("refuse un capteur sans nom", () => {
  const erreur = new Sensor({ unit: "C", min: 0, max: 50, threshold: 28, direction: "above" })
    .validateSync();
  assert.ok(erreur.errors.name, "le champ name devrait etre obligatoire");
});

test("refuse une direction invalide", () => {
  const erreur = new Sensor({
    name: "T", unit: "C", min: 0, max: 50, threshold: 28, direction: "sideways",
  }).validateSync();
  assert.ok(erreur.errors.direction, "direction doit etre above ou below");
});

test("accepte un capteur complet", () => {
  const erreur = new Sensor({
    name: "Temperature", unit: "C", min: -10, max: 50, threshold: 28, direction: "above",
  }).validateSync();
  assert.strictEqual(erreur, undefined);
});

test("active vaut true par defaut", () => {
  const sensor = new Sensor({
    name: "T", unit: "C", min: 0, max: 50, threshold: 28, direction: "below",
  });
  assert.strictEqual(sensor.active, true);
});

console.log("\nSchema Measure");

const sensorId = new mongoose.Types.ObjectId();

test("refuse une mesure sans capteur", () => {
  const erreur = new Measure({ value: 22.4 }).validateSync();
  assert.ok(erreur.errors.sensor);
});

test("refuse une valeur non numerique", () => {
  const erreur = new Measure({ sensor: sensorId, value: "vingt" }).validateSync();
  assert.ok(erreur.errors.value);
});

test("refuse une valeur hors bornes", () => {
  const erreur = new Measure({ sensor: sensorId, value: 999999 }).validateSync();
  assert.ok(erreur.errors.value);
});

test("accepte une mesure valide", () => {
  const erreur = new Measure({ sensor: sensorId, value: 22.4 }).validateSync();
  assert.strictEqual(erreur, undefined);
});

test("createdAt est rempli automatiquement", () => {
  const measure = new Measure({ sensor: sensorId, value: 22.4 });
  assert.ok(measure.createdAt instanceof Date);
});

console.log(`\n${passed} tests reussis\n`);
