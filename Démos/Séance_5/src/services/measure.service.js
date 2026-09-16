import {Sensor} from "../sensor.js"


const measures = []
const sensor = new Sensor("tmp-127",{min: 18, max: 32});
sensor.on("measure", (measure) => measures.push(measure));
sensor.start();

export function add(measure) {
    measures.push(measure);
    return measure;
}

export function list(){
    return measures;
}

export function getLatest() {
    return measures.at(-1) ?? null;
}