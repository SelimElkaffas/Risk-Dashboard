import { useState } from 'react'
import { calculateRisk } from './risk_calculation'

const defaultPatient = {
    age: 55,
    sex: 'female',
    tChol: 200,
    hdl: 45,
    sbp: 160,
    egfr: 90,
    diabetes: true,
    smoker: false,
    usingAntihtn: true,
    usingStatin: false
}

function App() {
    const [patient, setPatient] = useState(defaultPatient)
    
    function handleInputChange(field, value) {
        setPatient(prev => ({ ...prev, [field]: value }))
    }

    function handleDefaultButton() {
        setPatient(defaultPatient)
    }

    function getRiskColor(risk) {
        if (risk < 5) return '#22c55e'; // Green
        if (risk < 7.5) return '#eab308'; // Yellow
        if (risk < 20) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    const risk = calculateRisk(patient)
    return (
        <>
        <div style={{ 
        backgroundColor: '#f8fafc', 
        minHeight: '100vh',         
        padding: '40px',            
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        color: '#0f172a' ,
        //zoom: '80%'          
        }}>
            <h1>Cardiovascular Risk Calculator</h1>
            <div style={{ display: 'flex', gap:'30px', color: 'black'}}>
                <div style={{flex: 2, display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    <div style={{backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
                        <div style={{ 
                            backgroundColor: '#7e22ce', // A nice, deep clinical purple
                            color: 'white', 
                            padding: '15px 20px', 
                            fontWeight: 'bold',
                            fontSize: '18px'
                            }}>
                                Demographic Information
                        </div>
                        <div style={{padding: '20px', display: 'flex',  flexDirection: 'column',  gap: '15px'}}>
                            <div>
                                <label>Sex: </label>
                                <select value={patient.sex} onChange={e => handleInputChange('sex', e.target.value)}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label>Age: {patient.age} </label><br />
                                <input type="range" min="30" max="79" value={patient.age} onChange={e => handleInputChange('age', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div style={{backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>
                        <div style={{ 
                            backgroundColor: '#7e22ce',  
                            color: 'white', 
                            padding: '15px 20px', 
                            fontWeight: 'bold',
                            fontSize: '18px'
                            }}>
                                Labs & Vitals
                        </div>
                        <div style={{padding: '20px', display: 'flex',  flexDirection: 'column',  gap: '15px'}}>
                            <div>
                                <label>Total Cholesterol: {patient.tChol} mg/dL</label><br />
                                <input type="range" min="130" max="320" value={patient.tChol} onChange={e => handleInputChange('tChol', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>HDL Cholesterol: {patient.hdl} mg/dL</label><br />
                                <input type="range" min="20" max="100" value={patient.hdl} onChange={e => handleInputChange('hdl', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>Systolic Blood Pressure: {patient.sbp} mmHg</label><br />
                                <input type="range" min="90" max="200" value={patient.sbp} onChange={e => handleInputChange('sbp', Number(e.target.value))} />
                            </div>
                            <div>
                                <label>eGFR: {patient.egfr} mL/min/1.73m²</label><br />
                                <input type="range" min="15" max="150" value={patient.egfr} onChange={e => handleInputChange('egfr', Number(e.target.value))} />
                            </div>
                        </div>
                    </div>
                    <div style={{backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden'}}>  
                        <div style={{ 
                            backgroundColor: '#7e22ce',  
                            color: 'white', 
                            padding: '15px 20px', 
                            fontWeight: 'bold',
                            fontSize: '18px'
                            }}>
                                Medical History
                        </div>
                        <div style={{padding: '20px', display: 'flex',  flexDirection: 'column',  gap: '15px'}}>
                            <div>
                                <label>Diabetes: </label>
                                <input type="checkbox" checked={patient.diabetes} onChange={e => handleInputChange('diabetes', e.target.checked)} />
                            </div>
                            <div>
                                <label>Smoker: </label>
                                <input type="checkbox" checked={patient.smoker} onChange={e => handleInputChange('smoker', e.target.checked)} />
                            </div>
                            <div>
                                <label>Using Antihypertensive Medication: </label>
                                <input type="checkbox" checked={patient.usingAntihtn} onChange={e => handleInputChange('usingAntihtn', e.target.checked)} />
                            </div>
                            <div>
                                <label>Using Statin: </label>
                                <input type="checkbox" checked={patient.usingStatin} onChange={e => handleInputChange('usingStatin', e.target.checked)} />
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleDefaultButton} style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    marginTop: '10px'}}>
                        Reset to Default
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
                    <h2 style={{ marginTop: 0, color: '#334155' }}>10-Year ASCVD Risk</h2>
                    
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

export default App
