import { useState } from 'react'
import { calculateRisk } from './risk_calculation'
import { db } from './db/db'
import { useLiveQuery } from 'dexie-react-hooks'

const baselinePatientProfile = {
    age: 55,
    sex: 'female',
    tChol: 200,
    hdl: 45,
    sbp: 120,
    egfr: 90,
    diabetes: false,
    smoker: false,
    usingAntihtn: false,
    usingStatin: false
}

function Calculator() {
    const [patient, setPatient] = useState({ id: null, name: "Guest"})
    const [patientProfile, setPatientProfile] = useState(baselinePatientProfile)
    const risk = calculateRisk(patientProfile)

    const patients = useLiveQuery(() => db.patients.toArray(), []) || []
    
    function handleInputChange(field, value) {
        setPatientProfile(prev => ({ ...prev, [field]: value }))
    }

    function changePatient(id, name) {
        setPatient({ id, name })
    }

    function revertToBaseline() {
        setPatientProfile(baselinePatientProfile)
    }

    async function addSnapshot() {
        try { 
            if (!patient.id) {
                alert("Cannot add snapshot for guest patient. Please select a patient profile first.")
            } else {
                await db.snapshots.add({
                    patientId: patient.id,
                    timestamp: new Date().toISOString(),
                    risk,
                    profile: patientProfile,
                })
                alert("Snapshot added successfully!")
            }
        } catch (error) {
            console.error("Error adding snapshot:", error)
        }
    }

    function getRiskColor(risk) {
        if (risk < 5) return '#22c55e'; // Green
        if (risk < 7.5) return '#eab308'; // Yellow
        if (risk < 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    return (
        <>
        <div className='page-container'>
            <h1>Cardiovascular Risk Calculator</h1>
            <div style={{ display: 'flex', gap:'30px', color: 'black'}}>
                <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div className='card'>
                        <div className='card-header'>
                                Patient
                        </div>
                        <div className='card-body'>
                            <div>
                                <label>Select a patient: </label>
                                <select value={patient.id === null? "guest" : patient.id} onChange={e => changePatient(e.target.value === "guest" ? null : Number(e.target.value), e.target.options[e.target.selectedIndex].text)}>
                                    <option value="guest">Guest (Do not Save)</option>
                                    {patients.map(patient => (
                                        <option key = {patient.id} value={patient.id}>{patient.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-header'>
                                Demographic Information
                        </div>
                        <div className='card-body'>
                            <div>
                                <label>Sex: </label>
                                <select value={patientProfile.sex} onChange={e => handleInputChange('sex', e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label>Age: {patientProfile.age} </label><br />
                                <input type="range" min="30" max="79" value={patientProfile.age} onChange={e => handleInputChange('age', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card-header'>
                            Labs & Vitals
                        </div>
                        <div className='card-body'>
                            <div>
                                <label>Total Cholesterol: {patientProfile.tChol} mg/dL</label><br />
                                <input type="range" min="130" max="320" value={patientProfile.tChol} onChange={e => handleInputChange('tChol', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>HDL Cholesterol: {patientProfile.hdl} mg/dL</label><br />
                                <input type="range" min="20" max="100" value={patientProfile.hdl} onChange={e => handleInputChange('hdl', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>Systolic Blood Pressure: {patientProfile.sbp} mmHg</label><br />
                                <input type="range" min="90" max="200" value={patientProfile.sbp} onChange={e => handleInputChange('sbp', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>eGFR: {patientProfile.egfr} mL/min/1.73m²</label><br />
                                <input type="range" min="15" max="150" value={patientProfile.egfr} onChange={e => handleInputChange('egfr', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div className='card'>  
                        <div className='card-header'>
                            Medical History
                        </div>
                        <div className='card-body'>
                            <div>
                                <label>Diabetes: </label>
                                <input type="checkbox" checked={patientProfile.diabetes} onChange={e => handleInputChange('diabetes', e.target.checked)} />
                            </div>
                            <div>
                                <label>Smoker: </label>
                                <input type="checkbox" checked={patientProfile.smoker} onChange={e => handleInputChange('smoker', e.target.checked)} />
                            </div>
                            <div>
                                <label>Using Antihypertensive Medication: </label>
                                <input type="checkbox" checked={patientProfile.usingAntihtn} onChange={e => handleInputChange('usingAntihtn', e.target.checked)} />
                            </div>
                            <div>
                                <label>Using Statin: </label>
                                <input type="checkbox" checked={patientProfile.usingStatin} onChange={e => handleInputChange('usingStatin', e.target.checked)} />
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={addSnapshot} className='primary-btn'>
                        Add Snapshot
                    </button>

                    <button onClick={revertToBaseline} className='secondary-btn'>
                        Reset to Baseline
                    </button>
                    
                </div>
                <div style={{ 
                    flex: 1, 
                    position: 'sticky', 
                    top: '40px', 
                    alignSelf: 'flex-start',
                    backgroundColor: 'white', 
                    padding: '30px', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ marginTop: 0, color: '#334155' }}>10-Year CVD Risk</h2>
                    
                    <div style={{ fontSize: '56px', fontWeight: 'bold', color: getRiskColor(risk), marginBottom: '20px' }}>
                        {risk}%
                    </div>

                    <div style={{ backgroundColor: '#e2e8f0', height: '20px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: getRiskColor(risk), height: '100%', width: `${risk}%`, borderRadius: '10px', transition: 'all 0.5s ease' }}></div>
                    </div>
                </div>  
            </div>
        </div>
        </>
    )
}

export default Calculator
