import React, { useContext, useState, useEffect } from 'react';
import UserPreferencesContext from './UserPreferencesContext';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import '@fontsource/dancing-script'; // Import the font styles
// Styled components for Android-like settings
const SettingTile = styled.div`
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }
`;
const PreferencesForm = styled.div`
    display: flex;
    flex-direction: column;
`;

const SettingLabel = styled.span`
    font-size: 16px;
`;

const SettingValue = styled.span`
    color: #888;
    font-size: 16px;
`;

const SaveButton = styled.button`
    margin-top: 20px;
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: #fff;
    border-radius: 4px;
`;
const Wrapper = styled.div`
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
`;

const Heading = styled.h2`
    font-size: 24px;
    margin-bottom: 20px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 15px;
`;

const Select = styled.select`
    width: 100%;
    padding: 8px 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
`;

const Button = styled.button`
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const AuthButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #0056b3;
    }
`;
const Card = styled.div`
    background-color: white;
    padding: 15px 20px;
    margin-bottom: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;



const Account = () => {
    const fetchOptionsFromApi = async () => {
        try {
            const response = await fetch(`${baseURL}/preferences/${user.id}`); // Replace with your actual API endpoint
            const data = await response.json();
            if (data.success) {
                return data.options; // Replace "options" with the actual key in your API response
            } else {
                console.error('Failed to fetch options:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error fetching options:', error);
            return null;
        }
    };
    
    const [dropdownOptions, setDropdownOptions] = useState({
        language: [],
        locale: [],
        currency: [],
        dateFormat: [],
    });

    useEffect(() => {
        // Fetch options from the API and populate dropdownOptions state
        fetchOptionsFromApi().then((options) => {
            setDropdownOptions(options);
        });
    }, []); // This effect runs only once, when the component mounts
    // Here, we also extract baseURL from the context.
    const { setUser, baseURL } = useContext(AuthContext); 
    const { preferences, setPreferences } = useContext(UserPreferencesContext);
    const [formPreferences, setFormPreferences] = useState(preferences);
    const { user } = useContext(AuthContext);
    console.log(user);
    const [dropdownStates, setDropdownStates] = useState({
        language: false,
        locale: false,
        currency: false,
        dateFormat: false,
    });
    const toggleDropdown = (dropdownName) => {
        setDropdownStates(prevState => ({
            ...prevState,
            [dropdownName]: !prevState[dropdownName]
        }));
    };
    
    useEffect(() => {
        if (user) {
            fetch(`${baseURL}/preferences/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if(data.success) {
                        setPreferences(data.data);
                        setFormPreferences(data.data);
                    } else {
                        console.error('Failed to fetch preferences:', data.error);
                    }
                });
        }
    }, [user, setPreferences]);

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Update the formPreferences state with the new value
        setFormPreferences(prevState => ({
            ...prevState,
            [name]: value
        }));
    
        // Toggle the dropdown for the changed field
        toggleDropdown(name);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (user) {
            fetch(`${baseURL}/preferences/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formPreferences)
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    console.log(data.message);
                    setPreferences(formPreferences);
                } else {
                    console.error('Failed to save preferences:', data.error);
                }
            });
        }
    };
    const Wrapper = styled.div`
        padding: 20px;
        max-width: 600px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
    `;

    // Define a styled component for the profile image
    const ProfileImage = styled.img`
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
    `;

    // Define a styled component for the signature-style text
    const SignatureText = styled.span`
        font-family: 'Dancing Script', cursive;
        font-size: 24px;
        color: #333;
        margin-top: -20px; /* Adjust to raise the text a bit higher */
        margin-left: 50px; /* Add margin to the left for positioning */
    `;

    const UserInfo = styled.div`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `;

    const Label = styled.strong`
        font-size: 16px;
    `;

    const Value = styled.span`
        font-size: 16px;
    `;

const PreferenceTile = styled.div`
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    select {
        font-size: 16px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
        display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    }
`;
    return (
        <Wrapper>
            <Heading>Account</Heading>
            <Card>
            {/* Mock profile image, replace with user's actual image if available */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ProfileImage src={process.env.PUBLIC_URL + '/profile/amir.jpg'} alt="User profile" />
                    <SignatureText>{user.username}</SignatureText>
            </div>
            <p></p>
            {/* <UserInfo>
                <Label>ID:</Label>
                <Value>{user.id}</Value>
            </UserInfo> */}
            <UserInfo>
                <Label>Username:</Label>
                <Value>{user.username}</Value>
            </UserInfo>
            <UserInfo>
                <Label>Email:</Label>
                <Value>{user.email}</Value>
            </UserInfo>
            <UserInfo>
                <Label>Country of Residence:</Label>
                <Value>{user.country}</Value>
            </UserInfo>
        </Card>
            <Heading>Account Settings</Heading>

            {user ? (
                <Card>


                    <div className="preferences-form">
                    <PreferencesForm>
                    <PreferenceTile onClick={() => toggleDropdown('language')} isOpen={dropdownStates.language}>
                        <SettingLabel>Language</SettingLabel>
                        <SettingValue>{formPreferences.language}</SettingValue>
                        </PreferenceTile>
                        {dropdownStates.language && (
                        <select
                            name="language"
                            value={formPreferences.language}
                            onChange={handleChange}
                        >
                            {dropdownOptions.language?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                            ))}
                        </select>
                        )}

                <PreferenceTile onClick={() => toggleDropdown('locale')} isOpen={dropdownStates.locale}>
                    <SettingLabel>Locale for Number/Date Formatting</SettingLabel>
                    <SettingValue>{formPreferences.locale}</SettingValue>
                </PreferenceTile>
                {dropdownStates.locale && (
                    <select
                        name="locale"
                        value={formPreferences.locale}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="en-US">English (US)</option>
                        <option value="zh-CN">Chinese (China)</option>
                    </select>
                )}

                <PreferenceTile onClick={() => toggleDropdown('currency')} isOpen={dropdownStates.currency}>
                    <SettingLabel>Currency</SettingLabel>
                    <SettingValue>{formPreferences.currency}</SettingValue>
                </PreferenceTile>
                {dropdownStates.currency && (
                    <select
                        name="currency"
                        value={formPreferences.currency}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="USD">US Dollar</option>
                        <option value="CNY">Chinese Yuan</option>
                    </select>
                )}

                <PreferenceTile onClick={() => toggleDropdown('dateFormat')} isOpen={dropdownStates.dateFormat}>
                    <SettingLabel>Date Format</SettingLabel>
                    <SettingValue>{formPreferences.dateFormat}</SettingValue>
                </PreferenceTile>
                {dropdownStates.dateFormat && (
                    <select
                        name="dateFormat"
                        value={formPreferences.dateFormat}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                        <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                )}

                <SaveButton onClick={handleSubmit}>Save Preferences</SaveButton>
            </PreferencesForm>
                    </div>
                </Card>
            ) : (
                <Card>
                    <AuthButtonGroup>
                        <StyledLink to="/login">Login</StyledLink>
                        <StyledLink to="/register">Register</StyledLink>
                    </AuthButtonGroup>
                </Card>
            )}
        </Wrapper>
    );
}

export default Account;
