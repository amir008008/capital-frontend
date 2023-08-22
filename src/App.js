import React, { useRef, useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import './App.css';
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
  useNavigate
} from 'react-router-dom';

import Logs from './components/BudgetTools/Logs';
import Budget from './components/BudgetTools/Budget';
import Goals from './components/Goals/Goals';
import Account from './components/Account/Account';
import About from './components/About/About';
import UserPreferencesProvider from './components/Account/UserPreferencesProvider';
import AuthContext from './components/Account/AuthContext';
import Register from './components/Account/Registration';
import Login from './components/Account/Login';

Modal.setAppElement('#root'); // Assuming your app root element has the id 'root'

// const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
const BASE_URL = 'http://localhost:5000';
// const YEAR = 2023;
// const userId = 1;



function MainApp({ navigateToLogin }) {    
    const navigate = useNavigate();

    useEffect(() => {
        if (navigateToLogin) {
            //navigate('/login');

        }
    }, [navigateToLogin, navigate]);
  
    const handleIconClick = () => {
      navigate("/about");
    };
    function BottomNavBar() {
      return (
        <div className="bottom-nav-bar">
          <Link to="/logs" className="nav-button">
            <i className="fa fa-list-alt"></i>
            <span>Logs</span>
          </Link>
          <Link to="/budget" className="nav-button">
              <i className="fa fa-money"></i> {/* This icon represents money/budget, but you can change to any other FontAwesome icon you prefer */}
              <span>Budget</span>
          </Link>

          {/* <Link to="/goals" className="nav-button">
            <i className="fa fa-bullseye"></i>
            <span>Goals</span>
          </Link> */}
          <Link to="/account" className="nav-button">
            <i className="fa fa-user"></i>
            <span>Account</span>
          </Link>
        </div>
      );
    }
  
    return (
      <UserPreferencesProvider>  {/* <-- Wrap your main app content with the UserPreferencesProvider */}
        <div className="App">
          <Header />
          <div className="main-content-app bg-off-white">
            <div className="navbar-top">
              <div className="navbar-title">
                Capital AI
              </div>
              <div className="navbar-icons">
                <FontAwesomeIcon icon={faQuestionCircle} onClick={handleIconClick} style={{ cursor: "pointer" }} />
              </div>
            </div>
            <Routes>
              <Route path="/logs" element={<Logs />} />
              <Route path="/budget" element={<Budget />} />
              {/* <Route path="/goals" element={<Goals />} /> */}
              <Route path="/account" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
            <BottomNavBar />
          </div>
        </div>
      </UserPreferencesProvider>
    );
  }
  function App() {
    return (
      <Router>
        <AuthContextProvider />
      </Router>
    );
  }
  
  function AuthContextProvider() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        fetch(`${BASE_URL}/api/fetch-user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setUser(data.data);
            if (!data.data.username) {
              //navigate('/login');

            }
          } else {
            localStorage.removeItem('authToken');
            //navigate('/login');

          }
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          //navigate('/login');

        });
      } else {
        //navigate('/login');

      }
    }, [navigate]);
  
    return (
      <AuthContext.Provider value={{ user, setUser, baseURL: BASE_URL }}>
        <MainApp />
      </AuthContext.Provider>
    );
  }
  
  export default App;
  