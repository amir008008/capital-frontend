import React, { useState, useContext, useEffect } from 'react';
import AuthContext from './AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const companyLogo = process.env.PUBLIC_URL + '/logo/logo.jpg';

const colors = {
    primary: {
        light: '#bd0fea',
        main: '#820ad1',
        dark: '#4c0677',
        background: '#f4f4f4',
        secondaryBackground: '#e4e4e4',
        text: '#ffffff'
    },
    secondary: {
        blue: '#86cbf2'
    }
};

// Styled components
const LoginWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.primary.background};
    height: 100vh;
    font-family: Arial, sans-serif;
`;

const Heading = styled.h2`
    font-family: 'Gelix', sans-serif;
    font-size: 24px;
    margin-bottom: 20px;
`;

const StyledLogo = styled.img`
    width: 150px;
    margin: 20px auto;
`;

const Card = styled.div`
    background-color: white;
    padding: 15px 20px;
    margin-bottom: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PreferenceTile = styled.div`
    font-family: 'Gelix', sans-serif;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
`;

const SettingLabel = styled.span`
    font-size: 16px;
    margin-right: 8px;
`;

const StyledInput = styled.input`
    width: 100%;
    padding: 8px 0px;
    margin: 5px 0;
    border: 1px solid ${colors.primary.dark};
    border-radius: 4px;
    font-size: 16px;
    transition: all 0.3s ease-in-out;

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        box-shadow: 0 0 5px ${colors.secondary.blue};
    }
`;


const RegisterButton = styled.button`
    font-family: 'Gelix', sans-serif;
    font-size: 16px;
    margin-top: 20px;
    margin-right: 20px;
    padding: 10px 15px;
    border: none;
    background-color: ${colors.primary.main};
    color: ${colors.primary.text};
    border-radius: 4px;

    &:hover {
        background-color: ${colors.primary.light};
    }
`;
const LoginButon = styled.button`
    font-family: 'Gelix', sans-serif;
    font-size: 16px;
    margin-top: 20px;
    margin-right: 20px;
    padding: 10px 15px;
    border: none;
    background-color: ${colors.primary.light};
    color: ${colors.primary.text};
    border-radius: 4px;

    &:hover {
        background-color: ${colors.primary.light};
    }
`;
const ErrorMessage = styled.div`
    color: red;
    margin-top: 10px;
    font-size: 16px;
`;

// Login Component
const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
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
                    navigate('/logs');
                }
            })
            .catch(err => console.error('Failed to fetch user data:', err));
        }
    }, [baseURL, navigate, setUser]);

    const handleLogin = () => {
        console.log("Starting login process...");
    
        setLoading(true);
    
        // Timeout for fetch
        const timeout = new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Request took too long!')), 10000); // 10 seconds timeout
        });
    
        const fetchRequest = fetch(`${baseURL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });
    
        Promise.race([fetchRequest, timeout])
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Received a response:", response);
            return response.json();
        })
        .then(data => {
            console.log("Data received from server:", data);
    
            if (data.success) {
                localStorage.setItem('authToken', data.token);
                setUser({
                    id: data.id,
                    email: data.email,
                    username: data.username,
                    country: data.country
                });
                navigate('/logs');
            } else {
                throw new Error(data.error || 'Failed to login');
            }
        })
        .catch(err => {
            console.error("An error occurred:", err);
            setErrorMessage(err.message);
        })
        .finally(() => {
            console.log("Setting loading state to false.");
            setLoading(false);
        });
    };
    
    const handleRegister = () => {
        navigate('/register');
    };
    return (
        <LoginWrapper>
 
            <StyledLogo src={companyLogo} alt="Company Logo" />
            <Heading>Login</Heading>
            <Card>
            <PreferenceTile>
                    <SettingLabel>Username</SettingLabel>
                    <StyledInput 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                    />    
            </PreferenceTile>
            <PreferenceTile>

                    <SettingLabel>Password</SettingLabel>
                    <StyledInput 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                    />
                
            </PreferenceTile>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                <LoginButon onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </LoginButon>
                <RegisterButton onClick={handleRegister} disabled={loading}>
                    {loading ? 'Register' : 'Register'}
                </RegisterButton>

            </Card>


        </LoginWrapper>
    );
}

export default Login;