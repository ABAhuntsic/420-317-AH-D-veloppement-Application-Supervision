import { Sensor } from "./sensor.js";

const history = []
const temperature = new Sensor("temp-b127",{ min: 18, max: 32, threshold: 28, direction: "above", unit: "C"})

temperature.on("measure", (measure) => {
    console.log(`${measure.createdAt} | ${measure.value}`);
});
temperature.on("measure", (measure) => history.push(measure));


temperature.start();