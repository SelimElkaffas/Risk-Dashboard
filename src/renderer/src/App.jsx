import { HashRouter, Routes, Route, NavLink } from "react-router-dom"
import Calculator from "./Calculator"
import PatientManager from "./PatientManager"
import PatientProfile from "./PatientProfile"
import SyncSettings from "./SyncSettings"
import './styles/App.css' 

function App() {
    return (
        <HashRouter>
            <nav>
                <NavLink to="/">Calculator</NavLink>
                <NavLink to="/patients">Patient Manager</NavLink>
                <NavLink to="/sync">Sync Data</NavLink>
            </nav>
            <Routes>
                <Route path="/" element={<Calculator />} />
                <Route path="/patients" element={<PatientManager />} />
                <Route path="/patients/:id" element={<PatientProfile />}></Route>
                <Route path="/sync" element={<SyncSettings />}></Route>
            </Routes>
        </HashRouter>
    );
}

export default App
