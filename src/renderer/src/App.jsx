import { HashRouter, Routes, Route, Link } from "react-router-dom"
import Calculator from "./Calculator"
import PatientManager from "./PatientManager"
import './styles/App.css' 

function App() {
    return (
        <HashRouter>
            <nav>
                <Link to="/">Calculator</Link>
                <Link to="/patients">Patient Manager</Link>
            </nav>
            <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/patients" element={<PatientManager />} />
            </Routes>
        </HashRouter>
    );
}

export default App
