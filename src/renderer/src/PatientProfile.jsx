import { useParams } from 'react-router-dom'
import { db } from './db/db'
import { useLiveQuery } from 'dexie-react-hooks';

function PatientProfile() {
    const { id } = useParams();
    const patient = useLiveQuery(() => db.patients.get(Number(id)), [id]) || [] 
    const snapshots = useLiveQuery(() => db.snapshots.where('patientId').equals(Number(id)).reverse().sortBy('timestamp')) || []

    async function handleSnapshotDelete(snapshotId) {
        try {
            if (!window.confirm("Are you sure you want to delete this risk measurement? This action cannot be undone")) return;
            await db.snapshots.delete(snapshotId)
        } catch (error) {
            console.error("Error deleting snapshot", error)
        }
    }

    return (
        <>
        <div className='page-container1'>
            <h1>Patient Profile: {patient.name}</h1>
            {snapshots.map(s => {
                const dateObject = new Date(s.timestamp)
                const formattedDate = dateObject.toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day:'numeric'
                })

                return (
                    <div key={s.id} className='card'>
                        <div className='card-header'>Risk Measurement: {formattedDate}</div>
                        <div className='card-body'>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div className='snapshot-meta'>
                                    <span className='risk-value'>Risk: {s.risk}</span>
                                </div>
                                <button className='btn-delete' onClick={() => handleSnapshotDelete(s.id)}> Delete Snapshot</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        </>
    )
}

export default PatientProfile