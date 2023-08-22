import React, { useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state

    const { setUser, baseURL } = useContext(AuthContext);

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            fetch(`${baseURL}/api/fetch-user`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUser({
                        id: data.id,
                        email: data.email,
                        username: data.username,
                        country: data.country
                    });
                    navigate('/account');
                }
            })
            .catch(err => console.error('Failed to fetch user data:', err));
        }
    }, [baseURL, navigate, setUser]);

    const handleLogin = () => {
        setLoading(true); // Set loading to true when login starts

        fetch(`${baseURL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                setUser({
                    id: data.id,
                    email: data.email,
                    username: data.username,
                    country: data.country
                });
                navigate('/account'); // Navigate to account page after successful login
            } else {
                setErrorMessage(data.error || 'Failed to login');
            }
            setLoading(false); // Reset loading state after login attempt
        })
        .catch(err => {
            setErrorMessage(err.message);
            setLoading(false); // Reset loading state after login attempt
        });
    };
    return (
        <div>
            <h2>Login</h2>
            <div className="login-form">
                <div>
                    <label>
                        Username:
                        <input 
                            type="text" 
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </label>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>            </div>
        </div>
    );
}

export default Login;
