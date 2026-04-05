import { useState } from 'react';
import { db } from './db/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'

function PatientManager() {
    const [currentPatient, setCurrentPatient] = useState("")
    const patients = useLiveQuery(() => db.patients.toArray(), []) || []

    async function handleAddPatient(e) {
        e.preventDefault()
        try {
            if (currentPatient.trim() === "" || currentPatient.trim().toLowerCase() === "guest") {
                alert("Patient name cannot be empty or 'Guest'.")
            } else {
                const id = await db.patients.add({ 
                    name: currentPatient.trim(),
                    pbId: "",
                    synced: 0,
                })
                setCurrentPatient('');
            }
        } catch (error) {
            console.error("Error adding patient:", error)
        }
    }

    async function handleDeletePatient(id) {
        if (!window.confirm("Are you sure you want to delete this patient and their associated data? This action cannot be undone.")) return
        try {
            db.transaction('rw', db.patients, db.snapshots, async () => {
                await db.snapshots.where('patientId').equals(Number(id)).delete()
                await db.patients.delete(Number(id))
            })
        } catch (error) {
            console.error("Error deleting patient", error)
        }
    }

    return (
        <>
        <div className='page-container'>
            <h1>Patient Manager</h1>
            <div className='card'>
                <div className='card-header'>
                    Add a New Patient
                </div>
                <div className='card-body'>
                    <div className='input-group'>
                        <form onSubmit={handleAddPatient}>
                            <div>
                                <label>Name: </label>
                                <input type="text" value={currentPatient} onChange={(e) => setCurrentPatient(e.target.value)} />
                            </div>
                            <button className='btn btn-primary btn-auto' type="submit">Add Patient</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-header'>
                    Patient Directory
                </div>
                <div className='card-body' style={{padding: "1px 20px 24px"}}>
                    {patients.length === 0 ? (
                        <p style={{ color : 'var(--text-muted)' }}>No patients found.</p>
                    ) : (
                        <ul className='data-list'>
                            {patients.map(p => (
                                <li key ={p.id} className='data-item'>
                                    <Link to={`/patients/${p.id}`}>{p.name}</Link>
                                    <button className='btn btn-danger btn-auto' onClick={() => handleDeletePatient(p.id)}>Delete Patient</button>
                                </li>
                            ))}
                        </ul>
                        )}
                </div>
            </div>
        </div>
        </>
    );
}
export default PatientManager 