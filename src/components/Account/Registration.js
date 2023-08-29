import React, { useState, useContext } from 'react';
import AuthContext from './AuthContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Reuse the styles from the previous refactored Login component
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

const RegisterWrapper = styled.div`
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
    width: 200px; // Fixed width. Adjust this value as per your design needs.
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
    background-color: ${colors.primary.light};
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
    background-color: ${colors.primary.main};
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

const SuccessMessage = styled.div`
    color: green;
    margin-top: 10px;
    font-size: 16px;
`;
const isValidEmail = (email) => {
    // The regex checks if the email format is valid and ends in a domain
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};


// Register Component
const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { setUser, baseURL } = useContext(AuthContext);



    const handleRegister = () => {
        setErrorMessage('');
        setSuccessMessage('');
    
        if (!isValidEmail(email)) {
            setErrorMessage('Invalid email format');
            return; // Stop the function if the email is invalid
        }
    
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
                setSuccessMessage('Registration Success! Redirecting to login...');
                setUser({
                    id: data.id,
                    email: data.email
                });
                
                // Wait for 2 seconds and then redirect
                setTimeout(() => {
                    navigate('/onboarding');
                }, 2000);
            } else {
                setErrorMessage(data.error || 'Failed to register');
            }
        })
        
        .catch(err => {
            setErrorMessage(err.message);
        });
    };
    const handleLogin= () => {
        navigate('/login');
    };
    return (
        <RegisterWrapper>
            <StyledLogo src={companyLogo} alt="Company Logo" />
            <Heading>Register</Heading>
            <Card>
                <PreferenceTile>
                    <SettingLabel>Username</SettingLabel>
                    <StyledInput type="text" value={username} onChange={e => setUsername(e.target.value)} />
                </PreferenceTile>
                <PreferenceTile>
                    <SettingLabel>Email</SettingLabel>
                    <StyledInput type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </PreferenceTile>
                <PreferenceTile>
                    <SettingLabel>Password</SettingLabel>
                    <StyledInput type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </PreferenceTile>
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                <LoginButon onClick={handleLogin}>Login</LoginButon>
                <RegisterButton onClick={handleRegister}>Register</RegisterButton>
            </Card>
        </RegisterWrapper>
    );
}

export default Register;