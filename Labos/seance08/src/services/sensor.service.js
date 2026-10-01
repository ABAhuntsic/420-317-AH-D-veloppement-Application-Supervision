import Sensor from "../models/sensor.model.js";

export async function list() {
  return Sensor.find();
}

export async function getById(id) {
  return Sensor.findById(id);
}

export async function add(data) {
  return Sensor.create(data);
}

export async function remove(id) {
  const deleted = await Sensor.findByIdAndDelete(id);
  return deleted !== null;
}
