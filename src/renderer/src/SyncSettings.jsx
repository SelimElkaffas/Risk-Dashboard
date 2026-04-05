import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"
import { db } from "./db/db"
import { pb } from "./db/pocketbase"

function SyncSettings() {
    const unsyncedPatients = useLiveQuery(() => db.patients.where('synced').equals(0).toArray(), []) || []
    const unsyncedSnapshots = useLiveQuery(() => db.snapshots.where('synced').equals(0).toArray(), []) || []
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isSyncing, setIsSyncing] = useState(false)

    async function handleSync(e) {
        e.preventDefault()
        setIsSyncing(true)
        try {
            const authData = await pb.collection('users').authWithPassword(username, password)
            console.log("authenticated successfully")

            const patientsToSync = await db.patients.where('synced').equals(0).toArray();
            const snapshotsToSync = await db.snapshots.where('synced').equals(0).toArray(); 
            console.log(`Found ${patientsToSync.length} patients and ${snapshotsToSync.length} snapshots to sync.`);

            for (const p of patientsToSync) {
                try {
                    const record = await pb.collection('patients').create({
                        name: p.name
                    })
                    await db.patients.update(p.id, { pbId: record.id, synced: 1})
                    console.log("Successfully uploaded unsynced patients.")
                } catch (error) {
                    console.error(`Failed to upload patient ${p.id}`, error)
                }
            }

            const allPatients = await db.patients.toArray()
            const idMap = {}
            allPatients.forEach(p => {
                idMap[p.id] = p.pbId
            })

            for (const s of snapshotsToSync) {
                try {
                    const serverPatientId = idMap[s.patientId]
    
                    const record = await pb.collection('snapshots').create({
                        patientId: serverPatientId,
                        timestamp: s.timestamp,
                        risk: s.risk,
                        profile: s.profile
                    })
    
                    await db.snapshots.update(s.id, {pbId: record.id, synced: 1})
                    console.log("Successfully uploaded unsynced snapshots.")
                } catch (error) {
                    console.error(`Failed to upload snapshot ${s.id}`, error)
                }
            }

        } catch (error) {
            alert("Login failed. Please check your credentials.")
        }
        setIsSyncing(false)
    }

    return (
        <>
        <div className="page-container">
            <div className="card">
                <div className="card-header">Sync Patient Data</div>
                <div className="card-body">
                    <form onSubmit={handleSync}>
                        <div className="input-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSyncing}>{isSyncing? "Syincing..." : "Sync Data"}</button>
                    </form>
                </div>
            </div>
            <div className="text-id" style={{
                marginTop: '10px',
                display: 'inline-block',
            }}>
                {unsyncedPatients.length === 0 && unsyncedSnapshots.length === 0 ? 
                "All records synced" : 
                `Pending records to sync: ${unsyncedPatients.length} patient${unsyncedPatients.length > 1 ? 's' : ''}  and ${unsyncedSnapshots.length} snapshot${unsyncedSnapshots.length > 1 ? 's': ''}`}</div>
        </div>
        </>
    )
}

export default SyncSettings