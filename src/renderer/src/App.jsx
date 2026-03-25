import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useState } from 'react'
import { calculateRisk } from './risk_calculation'

const defaultPatient = {
    age: 55,
    sex: 'male',
    tChol: 200,
    hdl: 45,
    sbp: 160,
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

    const ipcHandle = () => window.electron.ipcRenderer.send('ping')

    const risk = calculateRisk(patient)
    return (
        <>
        <div>
            <h1>Cardiovascular Risk Calculator</h1>
            <p>Risk: {risk}%</p>
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
        </>
    )
}

export default App
