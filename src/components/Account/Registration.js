import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext'; // Import the AuthContext

const Register = () => {
    console.log("Base URL:", baseURL);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Extracting baseURL from the context.
    const { setUser, baseURL } = useContext(AuthContext); 

    const handleRegister = () => {
        // Make an API call to register
        fetch(`${baseURL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Here you can decide what you want to do upon successful registration.
                // If you want to automatically log the user in after registration:
                setUser({
                    id: data.id,
                    email: data.email
                });
            } else {
                setErrorMessage(data.error || 'Failed to register');
            }
        })
        .catch(err => {
            setErrorMessage(err.message);
        });
    };

    return (
        <div>
            <h2>Register</h2>
            <div className="register-form">
                <div>
                    <label>
                        Username:
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </label>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <button onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}

export default Register;
