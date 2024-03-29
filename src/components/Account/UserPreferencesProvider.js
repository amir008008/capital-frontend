import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserPreferencesContext from './UserPreferencesContext';

const UserPreferencesProvider = ({ children }) => {
    const [preferences, setPreferences] = useState({
        language: 'en',
        currency: 'USD',
        dateFormat: 'MM-DD-YYYY',
        moneyFormat: '1,234.56'
        // Add other preferences here
    });

    return (
        <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
            {children}
        </UserPreferencesContext.Provider>
    );
}

UserPreferencesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default UserPreferencesProvider;
