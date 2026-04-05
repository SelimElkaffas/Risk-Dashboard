import { useParams } from 'react-router-dom'
import { db } from './db/db'
import { useLiveQuery } from 'dexie-react-hooks';

function PatientProfile() {
    const { id } = useParams();
    const patient = useLiveQuery(() => db.patients.get(Number(id)), [id]) || [] 
    const snapshots = useLiveQuery(() => db.snapshots.where('patientId').equals(Number(id)).reverse().sortBy('timestamp')) || []

    function getRiskColor(risk) {
        if (risk < 5) return '#10c050'; // Green
        if (risk < 7.5) return '#eab308'; // Yellow
        if (risk < 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

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
            <div className="page-container">
                <div className="profile-grid">

                    {/* Left Column: Patient Details */}
                    <aside className="flex-col gap-4">
                        <div className="card">
                            <div className="card-header">Patient Info</div>
                            <div className="card-body">
                                <h2>{patient.name}</h2>
                                <div className="risk-container" style={{ marginTop: '20px', padding: '15px', background: 'var(--bg-light)', borderRadius: '8px' }}>
                                    <div className="risk-label">Current Risk Assessment</div>
                                    <div className="risk-value" style={{ color: snapshots.length > 0 ? getRiskColor(snapshots[0].risk) : 'green' }}>{snapshots.length > 0 ? `${snapshots[0].risk}%` : "N/A"}</div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Column: History/Snapshots */}
                    <main>
                        <div className="card">
                            <div className="card-header">Clinical Snapshots</div>
                            <div className="card-body">
                                <ul className="data-list">
                                    {snapshots.length === 0 ? <p>No Data for this patient yet.</p> : ''}
                                    {snapshots.map(s => (
                                        <li key={s.id} className="data-item">
                                            <div className="snapshot-meta">
                                                <strong>
                                                    {new Date(s.timestamp).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </strong>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                                                    {s.profile && Object.entries(s.profile)
                                                        .filter(([_, value]) => value === true || (typeof value !== 'boolean' && value))
                                                        .map(([key, value]) => (
                                                            <span key={key} className="text-id" style={{ textTransform: 'capitalize' }}>
                                                                {key.replace('_', ' ')}
                                                                {typeof value !== 'boolean' && `: ${value}`}
                                                            </span>
                                                        ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                                <div className='risk-value' style={{ fontSize: '20px', margin: 0, color: getRiskColor(s.risk) }}>
                                                    {s.risk}%
                                                </div>
                                                <button
                                                    onClick={() => handleSnapshotDelete(s.id)}
                                                    className="btn btn-danger btn-auto"
                                                    style={{ marginTop: '8px' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default PatientProfile