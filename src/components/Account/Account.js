import React, { useContext, useState, useEffect } from 'react';
import UserPreferencesContext from './UserPreferencesContext';
import AuthContext from './AuthContext';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import '../../App.css';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';  // Replace useHistory with useNavigate
import '@fontsource/dancing-script'; // Import the font styles
// Styled components for Android-like settings

const colors = {
    primary: {
        light: '#bd0fea',
        main: '#820ad1',
        dark: '#4c0677',
        darkest: '#2f0549',
        background: '#f4f4f4',
        secondaryBackground: '#e4e4e4',
        text: '#ffffff',
        secondaryText: '#000000'
    },
    secondary: {
        green: '#c0e048',
        blue: '#86cbf2',
        pink: '#e88fc7',
        hoverPink: '#e88fc7'
    }
};

const SelectContainer = styled.div`
    position: relative;
`;


const StyledDropdown = styled.select`
    display: block;
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid ${colors.primary.dark};
    border-radius: 4px;
    appearance: none; 
    background-color: ${colors.primary.light};
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
        border-color: ${colors.primary.main};
    }

    &:focus {
        outline: none;
        border-color: ${colors.primary.main};
        box-shadow: 0 0 5px ${colors.secondary.blue};
    }
`;

const DropdownArrow = styled.div`
    content: '\25BC';
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    pointer-events: none; 
`;

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
        align-items: right;

`;

const SaveButton = styled.button`
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
    margin-top: 20px;
    padding: 10px 15px;
    border: none;
    background-color: #820ad1;
    color: #fff;
    border-radius: 4px;
        font-size: 16px;

`;
const Wrapper = styled.div`
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
`;
const Heading = styled.h2`
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
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
    background-color: #820ad1;
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
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
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

const StyledOption = styled.option`
    &:hover {
        background-color: ${colors.secondary.blue}; // Or whichever color you prefer.
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


const Account = () => {
    const { t } = useTranslation();
//     if (!user) {
//         return <div>Loading...</div>;
//    }
    const fetchOptionsFromApi = async () => {
        try {
            const response = await fetch(`${baseURL}/preferences/${user.id}`); // Replace with your actual API endpoint
            const data = await response.json();
            if (data.success) {
                return data.data; // Replace "options" with the actual key in your API response
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
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success && data.data) { 
                        // You may want to validate the structure of data.data here
                        setPreferences(data.data);
                        setFormPreferences(data.data);
                        console.log(data.data);
                          // Set the language for i18next
                        if (data.data.language) {
                            i18n.changeLanguage(data.data.language);
                        }
                    } else {
                        throw new Error('Failed to fetch preferences: ' + (data.error || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    setErrorMessage(t('preferencesFetchError'));
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
        // window.alert('save preferences:', event);

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
                    setSuccessMessage(t('preferencesUpdatedSuccess'));
                    setPreferences(formPreferences);
                    window.setTimeout(() => {
                        setSuccessMessage('');  // Clear success message
                        window.location.reload(); // Refresh the page
                    }, 1000);
                }
                 else {
                    console.error('Failed to save preferences:', data.error);
                    window.alert('Failed to save preferences:', data.error);
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
        margin-bottom: 10px;  // Added some margin for spacing.

    `;

    // Define a styled component for the signature-style text
    const SignatureText = styled.span`
        font-family: 'Dancing Script', cursive;
        font-size: 24px;
        color: #333;
        margin-top: -20px; /* Adjust to raise the text a bit higher */
        margin-left: 100px; /* Add margin to the left for positioning */
        text-transform: uppercase;

    `;

    const UserInfo = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;  // Added some margin for spacing.
`;


    const Label = styled.strong`
        font-size: 16px;
    `;

    const Value = styled.span`
        font-size: 16px;
    `;

const PreferenceTile = styled.div`
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.

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
    const LogoutButton = styled.button`
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
    font-size: 16px;

    margin-top: 20px;
    padding: 10px 15px;
    border: none;
    background-color: #820ad1;
    color: #fff;
    border-radius: 4px;

        &:hover {
            background-color: #c9302c;
        }
    `;
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        navigate('/login');
    };

    const navigate = useNavigate();

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    }

    const handleConfirmDelete = async () => {
        try {
            // Call the API to delete the user
            const response = await fetch(`${baseURL}/api/deleteUser`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });

            const data = await response.json();

            if (data.success) {
                // Handle success - maybe navigate away from the account page or refresh data
            } else {
                // Handle failure - show an error or some feedback to the user
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }

        setShowDeleteDialog(false);
    }

    const handleCancelDelete = () => {
        setShowDeleteDialog(false);
    }

        return (

        <Wrapper>
            <Heading>{t('account')}</Heading>
            <Card>
            {/* Mock profile image, replace with user's actual image if available */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                 {/* <ProfileImage src={process.env.PUBLIC_URL + '/profile/'+ user.username + '.jpg'} alt="User profile" /> */}
                    {/* <SettingValue>{user.username}</SettingValue> */}
            </div>
            {/* <p></p> */}
            {/* <UserInfo>
                <Label>ID:</Label>
                <Value>{user.id}</Value>
            </UserInfo> */}
            {/* <UserInfo>
                <Label>Username:</Label>
                <Value>{user.username}</Value>
            </UserInfo> */}
                <PreferenceTile>
                <SettingLabel>{t('username')}</SettingLabel>
                <SettingValue>{user.username}</SettingValue>
                </PreferenceTile>
                <PreferenceTile>

                <SettingLabel>{t('email')}</SettingLabel>
                <SettingValue>{user.email}</SettingValue>
                </PreferenceTile>

                {/* <UserInfo>
                    <SettingLabel>Country of Residence:</SettingLabel>
                    <SettingValue>{user.country}</SettingValue>
                </UserInfo> */}
            </Card>
            <Heading>{t('accountSettings')}</Heading>

            {user ? (
                <Card>


                    <div className="preferences-form">
                    <PreferencesForm>

                    <PreferenceTile onClick={() => toggleDropdown('language')} isOpen={dropdownStates.language}>
                    <SettingLabel>{t('language')}</SettingLabel>
                    <SettingValue>
                            {
                                {
                                    'en': `🇬🇧 ${t('english')}`,
                                    'zh-CN': `🇨🇳 ${t('chinese')}`,
                                    'es': `🇪🇸 ${t('spanish')}`
                                }[formPreferences.language] || formPreferences.language
                            }
                        </SettingValue>
                    </PreferenceTile>
                    {dropdownStates.language && (
                        <select 
                            name="language"
                            value={formPreferences.language}
                            onChange={handleChange}
                        >
                            {/* Language Options with Flags */}
                            <option value="en">{t('englishLabel')}</option>
                            <option value="zh-CN">{t('chineseLabel')}</option>
                            <option value="es">{t('spanishLabel')}</option>
                        </select>
                    )}


                <PreferenceTile onClick={() => toggleDropdown('locale')} isOpen={dropdownStates.locale}>
                <SettingLabel>{t('localeForNumber')}</SettingLabel>
                <SettingValue>{t(`${formPreferences.locale}`)}</SettingValue>
                </PreferenceTile>
                {dropdownStates.locale && (
                    <select
                        name="locale"
                        value={formPreferences.locale}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="en-US">{t('englishUS')}</option>
                        <option value="zh-CN">{t('chineseChina')}</option>
                    </select>
                )}



                <PreferenceTile onClick={() => toggleDropdown('currency')} isOpen={dropdownStates.currency}>
                <SettingLabel>{t('currency')}</SettingLabel>
                <SettingValue>{t(`${formPreferences.currency}`)}</SettingValue>
                </PreferenceTile>
                {dropdownStates.currency && (
                    <select
                        name="currency"
                        value={formPreferences.currency}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="USD">{t('usDollar')}</option>
                        <option value="CNY">{t('chineseYuan')}</option>
                        <option value="JPY">{t('japaneseYen')}</option>
                        <option value="PKR">{t('pakistaniRupee')}</option>
                    </select>
                )}

                <PreferenceTile onClick={() => toggleDropdown('dateFormat')} isOpen={dropdownStates.dateFormat}>
                <SettingLabel>{t('dateFormat')}</SettingLabel>
                <SettingValue>{t(`${formPreferences.dateFormat}`)}</SettingValue>
                </PreferenceTile>
                {dropdownStates.dateFormat && (
                    <select
                        name="dateFormat"
                        value={formPreferences.dateFormat}
                        onChange={handleChange}
                    >
                        {/* Options */}
                        <option value="MM-DD-YYYY">{t('formatMMDDYYYY')}</option>
                        <option value="DD-MM-YYYY">{t('formatDDMMYYYY')}</option>
                        <option value="YYYY-MM-DD">{t('formatYYYYMMDD')}</option>
                    </select>
                )}
                {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                <SaveButton onClick={handleSubmit}>{t('savePreferences')}</SaveButton>
                <LogoutButton onClick={handleLogout}>{t('logout')}</LogoutButton>

            </PreferencesForm>
                    </div>
                    {/* <button onClick={handleDeleteClick}>Delete Account</button>

                    {showDeleteDialog && (
                        <div className="delete-dialog">
                            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                            <button onClick={handleConfirmDelete}>Confirm</button>
                            <button onClick={handleCancelDelete}>Cancel</button>
                        </div>
                    )} */}
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
