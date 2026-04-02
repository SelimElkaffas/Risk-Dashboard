import { HashRouter, Routes, Route, Link } from "react-router-dom"
import Calculator from "./Calculator"
import PatientManager from "./PatientManager"
import './stlyes/App.css' 

function App() {
    return (
        <HashRouter>
            <nav>
                <Link to="/" style={{ color: 'white',fontWeight: 'bold' }}>Calculator</Link>
                <Link to="/patients" style={{ color: 'white', fontWeight: 'bold' }}>Patient Manager</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/patients" element={<PatientManager />} />
            </Routes>
        </HashRouter>
    );
}

export default App
