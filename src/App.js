import React, { useRef, useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import './App.css';
import ErrorBoundary from  './ErrorBoundary';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import 'font-awesome/css/font-awesome.min.css';

import {
    Link,
    BrowserRouter as Router,
    Route,
    Switch,
    Routes,
    useNavigate,
    useLocation
} from 'react-router-dom';

import UserPreferencesProvider from './components/Account/UserPreferencesProvider';
import AuthContext from './components/Account/AuthContext';

const Logs = React.lazy(() => import('./components/BudgetTools/Logs'));
const Budget = React.lazy(() => import('./components/BudgetTools/Budget'));
const Goals = React.lazy(() => import('./components/Goals/Goals'));
const Account = React.lazy(() => import('./components/Account/Account'));
const About = React.lazy(() => import('./components/About/About'));
const Register = React.lazy(() => import('./components/Account/Registration'));
const Login = React.lazy(() => import('./components/Account/Login'));

Modal.setAppElement('#root');

<<<<<<< Updated upstream
//const BASE_URL = 'http://localhost:5000';
const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";

=======
const BASE_URL = 'http://localhost:5000';
//const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
import './i18n'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
>>>>>>> Stashed changes

function NavigationLinks() {
    return (
        <div>
            <Link to="/logs">Logs</Link>
            <Link to="/budget">Budget</Link>
            <Link to="/account">Account</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
        </div>
    );
}

function BottomNavBar() {
    const location = useLocation(); // Get the current location

    // List of routes where you want to hide the BottomNavBar
    const hideOnRoutes = ["/login", "/register"];

    if (hideOnRoutes.includes(location.pathname)) {
        // Don't render the BottomNavBar on the specified routes
        return null;
    }

    const navigate = (path) => {
        window.location.href = path;
    };

    return (
        <div className="bottom-nav-bar">
            <button onClick={() => navigate("/logs")} className="nav-button">
                <i className="fa fa-list-alt"></i>
                <span>Logs</span>
            </button>
            <button onClick={() => navigate("/budget")} className="nav-button">
                <i className="fa fa-money"></i>
                <span>Budget</span>
            </button>
            <button onClick={() => navigate("/account")} className="nav-button">
                <i className="fa fa-user"></i>
                <span>Account</span>
            </button>
        </div>
    );
}



function MainApp() {
    const navigate = useNavigate();
    const handleIconClick = () => {
        navigate("/about");
    };
    const [budgetKey, setBudgetKey] = useState(Math.random());
    const location = useLocation();

    useEffect(() => {
        setBudgetKey(Math.random());
    }, [location]);
    
    return (
        <UserPreferencesProvider>
            <ErrorBoundary>
            <div className="App">
                <Header />
                <div className="main-content-app bg-off-white">
                    <div className="navbar-top">
                        <div className="navbar-title">
                            Myfinancepal
                        </div>
                        <div className="navbar-icons">
                            <FontAwesomeIcon icon={faQuestionCircle} onClick={handleIconClick} style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                    <React.StrictMode>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                <Route path="/logs" element={<Logs />} />
                                <Route path="/budget" element={<Budget key={budgetKey} />} />
                                <Route path="/account" element={<Account />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </React.Suspense>
                    </React.StrictMode>
                    <BottomNavBar />
                </div>
            </div>
            </ErrorBoundary>
        </UserPreferencesProvider>
    );
}

function App() {
    const [showRoutes, setShowRoutes] = useState(true);
const handleNavigation = () => {
    setShowRoutes(false);
    // Use a timeout to ensure that the component has time to unmount before remounting
    setTimeout(() => setShowRoutes(true), 0);
}
    return (
        <Router>
            <ErrorBoundary>
                <AuthContextProvider />
            </ErrorBoundary>
        </Router>
    );
}
function AuthContextProvider() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        // Helper function to handle unauthorized actions
        const handleUnauthorized = () => {
            localStorage.removeItem('authToken');
            if (location.pathname !== "/login" && location.pathname !== "/register") {
                navigate('/login');
            }
        }

        if (authToken) {
            fetch(`${BASE_URL}/api/fetch-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Unauthorized');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    setUser(data.data);
                    if (!data.data.id && location.pathname !== "/login" && location.pathname !== "/register") {
                        handleUnauthorized();
                    }
                } else {
                    handleUnauthorized();
                }
            })
            .catch(err => {
                handleUnauthorized();
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            handleUnauthorized();
            setLoading(false);
        }
    }, [navigate, location]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, baseURL: BASE_URL }}>
            <ErrorBoundary>
            <MainApp />
            </ErrorBoundary>
            
        </AuthContext.Provider>
    );
}

export default App;
