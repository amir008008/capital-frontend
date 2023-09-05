import React, { useRef, useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import './App.css';
import ErrorBoundary from  './ErrorBoundary';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import 'font-awesome/css/font-awesome.min.css';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';
import Onboarding from './Onboarding';
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

const ENV = 'prod'  // This can be 'dev' or 'prod' or any other environment name you choose

let BASE_URL;

if (ENV === 'prod') {
    BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
} else {
    BASE_URL = 'http://localhost:5000';
}

console.log(BASE_URL);
import './i18n'
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

function NavigationLinks() {
    
    return (
        <div>
            <Link to="/logs">Logs</Link>
            <Link to="/">Logs</Link>
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
    const { t } = useTranslation();
    // List of routes where you want to hide the BottomNavBar
    const hideOnRoutes = ["/login", "/register","/onboarding"];

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
                <i className="fa fa-calendar"></i>
                <span>{t('today')}</span>
            </button>
            <button onClick={() => navigate("/budget")} className="nav-button">
                <i className="fa fa-money"></i>
                <span>{t('budget')}</span>
            </button>
            <button onClick={() => navigate("/account")} className="nav-button">
                <i className="fa fa-user"></i>
                <span>{t('account')}</span>
            </button>
        </div>
      );
    }



function MainApp() {
    const navigate = useNavigate();
    const location = useLocation();

    // State for onboarding check
    const [hasDoneOnboarding, setHasDoneOnboarding] = useState(localStorage.getItem('hasDoneOnboarding'));

    const finishOnboarding = () => {
        localStorage.setItem('hasDoneOnboarding', 'true');
        setHasDoneOnboarding(true);
    };
    const handleIconClick = () => {
        navigate("/about");
    };
    const [budgetKey, setBudgetKey] = useState(Math.random());

    useEffect(() => {
        setBudgetKey(Math.random());
        // Check if user has completed onboarding
        if (!localStorage.getItem('hasDoneOnboarding')) {
            //navigate('/onboarding');
        }
    }, [location]);
    
    return (
        <UserPreferencesProvider>
            <ErrorBoundary>
            <div className="App">
                <Header />
                <div className="main-content-app bg-off-white">
                    <div className="navbar-top">
                         <div className="navbar-title">
                            <img src="/logo/icon.jpg" alt="Myfinancepal Logo" className="navbar-logo" />
                            Myfinancepal
                        </div>

                        <div className="navbar-icons">
                            <FontAwesomeIcon icon={faQuestionCircle} onClick={handleIconClick} style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                    <React.StrictMode>
                    <React.Suspense fallback={<LoadingSpinner />}>
                            <Routes>
                                <Route path="/logs" element={<Logs />} />
                                <Route path="/" element={<Logs />} />
                                <Route path="/budget" element={<Budget key={budgetKey} />} />
                                <Route path="/account" element={<Account />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/onboarding" element={<Onboarding onFinish={finishOnboarding} />} />
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
    const [isLoading, setIsLoading] = useState(false); // For the loading spinner

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        
        // Helper function to handle unauthorized actions
        const handleUnauthorized = () => {
            localStorage.removeItem('authToken');
            if (location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/onboarding") {
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
        return <LoadingSpinner />;
    }

    return isLoading ? <LoadingSpinner /> : (
        <AuthContext.Provider value={{ user, setUser, baseURL: BASE_URL }}>
            <ErrorBoundary>
            <MainApp />
            </ErrorBoundary>
            
        </AuthContext.Provider>
    );
}

export default App;
