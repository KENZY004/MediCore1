import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <h1>🏥 MediCore Hospital Management System</h1>
                    <p>Advanced Healthcare Management Platform</p>
                </header>

                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                    </Routes>
                </main>

                <footer className="app-footer">
                    <p>&copy; 2026 MediCore HMS. Developed by Kenzn - LPU BTech CSE</p>
                </footer>
            </div>
        </Router>
    );
}

function Home() {
    return (
        <div className="home">
            <div className="welcome-card">
                <h2>Welcome to MediCore</h2>
                <p>Your comprehensive hospital management solution</p>
                <div className="features">
                    <div className="feature">
                        <span className="icon">👥</span>
                        <h3>Patient Management</h3>
                    </div>
                    <div className="feature">
                        <span className="icon">📅</span>
                        <h3>Appointments</h3>
                    </div>
                    <div className="feature">
                        <span className="icon">📊</span>
                        <h3>Analytics</h3>
                    </div>
                    <div className="feature">
                        <span className="icon">💳</span>
                        <h3>Billing</h3>
                    </div>
                </div>
                <div className="status">
                    <p className="status-badge">🚧 In Development</p>
                </div>
            </div>
        </div>
    );
}

export default App;
