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
                const id = await db.patients.add({ name: currentPatient.trim()})
                setCurrentPatient('');
            }
        } catch (error) {
            console.error("Error adding patient:", error)
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
                            <button type="submit">Add Patient</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-header'>
                    Patient Directory
                </div>
                <div className='card-body'>
                    {patients.length === 0 ? (
                        <p style={{ color : 'var(--text-muted)' }}>No patients found.</p>
                    ) : (
                        <ul>
                            {patients.map(p => (
                                <li key ={p.id}>
                                    <Link to={`/patients/${p.id}`}>{p.name}</Link>
                                    <span>ID: {p.id}</span>
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