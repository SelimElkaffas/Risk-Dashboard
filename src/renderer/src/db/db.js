import { Dexie } from "dexie"

export const db = new Dexie("myDatabase")
db.version(1).stores({
    patients: "++id, name, pbId, synced",
    snapshots: "++id, patientId, timestamp, pbId, synced"
})
 