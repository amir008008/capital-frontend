import React, { useContext } from 'react';
import AuthContext from '../Account/AuthContext';

function Logs() {
    const authContext = useContext(AuthContext);
    const authToken = localStorage.getItem('authToken');

    return (
        <div>
            {/* ... other content ... */}
            <div>Token: {authToken}</div>
            {/* ... other content ... */}
        </div>
    );
}

export default Logs;
