import React, { useState, useEffect,useContext } from 'react';
import AuthContext from '../Account/AuthContext';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';

const BASE_URL = 'http://localhost:5000';

const styles = {
    logPage: {
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '20px'
    },
    card: {
        background: 'white',
        padding: '15px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        height: '100vh'  // To make the card fit the page
    },
    header: {
        fontSize: '24px',
        marginBottom: '20px'
    },
    expenseTypeHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: '15px 0'
    },
    transactionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee'
    },
    categoryName: {
        marginLeft: '4ch',  // Equivalent of 4 space bars
        color: 'grey'
    }
};
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
const SettingLabelBold = styled.span`
    font-size: 16px;
    font-weight: bold;  // This makes the text bold
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

function Logs() {
    const [ongoingMonth, setOngoingMonth] = useState(null);

    const [dateFormat, setDateFormat] = useState('MM-DD-YYYY'); // default format, adjust as needed
    useEffect(() => {
        console.log('Fetching user preferences...');  // Added console log
    
        const userId = user.id; // Fetch or obtain this value accordingly
        fetch(`${BASE_URL}/preferences/${userId}`)
            .then(response => {
                console.log('Response received:', response);  // Added console log
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Fetched preferences:', data.data);  // Added console log
                    setDateFormat(data.data.dateFormat);
                } else {
                    console.warn('Failed fetching preferences with response:', data);  // Added warning log
                }
            })
            .catch(error => {
                console.error('Error during the fetch operation:', error);  // Improved error message
            });
    }, []);  // The empty dependency array ensures this useEffect runs once

    // Format ongoingMonth based on user's preferences
    const formattedOngoingMonth = moment(ongoingMonth).format('MMMM'); // For a format like "January 2021"
    const { setUser, baseURL } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const fetchOngoingMonth = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-ongoing-budget-month?user_id=${user.id}`);
                const data = await response.json();
                console.log("Ongoing Month Data:", data);
                if (data.success && data.ongoingMonths.length > 0) {
                    setOngoingMonth(`${data.ongoingMonths[0]}%`); // Appending '%' at the end
                } else {
                    console.error("No ongoing month found:", data.message);
                }
            } catch (error) {
                console.error("Error fetching ongoing month:", error);
            }
        };
    
        fetchOngoingMonth();
    }, [user.id]);

    useEffect(() => {
        if (!ongoingMonth) return;

        const fetchExpenses = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-expenses-for-logging?user_id=${user.id}&month=${ongoingMonth}`);
                const data = await response.json();
                console.log("Expenses Data:", data);
                if (data && data.expenses && Array.isArray(data.expenses)) {
                    setExpenses(data.expenses);
                } else {
                    console.error("Invalid data format returned from API");
                    setExpenses([]);
                }
            } catch (error) {
                console.error("Error fetching expenses:", error);
                setExpenses([]);
            }
        };

        fetchExpenses();
    }, [user.id, ongoingMonth]);

    const fixedExpenses = expenses.filter(exp => exp.expense_type.toLowerCase() === 'fixed');
    const variableExpenses = expenses.filter(exp => exp.expense_type.toLowerCase() === 'variable');


    return (
        
        <Wrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading>Step 2: Track ALL my transactions </Heading>

                {ongoingMonth && (
                    <div 
                        style={{
                            fontSize: '12px',
                            fontWeight: 'bold',
                            margin: '10px 0',
                            textTransform: 'uppercase',
                            color: 'grey'
                        }}
                    >
                        {formattedOngoingMonth}
                    </div>
                )}
            </div>

            {/* Display the formatted ongoingMonth */}


            <Card>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* This can be replaced with a user's profile or a relevant icon */}
                    <PreferenceTile>
                        <SettingLabelBold>Fixed Expenses</SettingLabelBold>
                    </PreferenceTile>
                </div>
                
                {fixedExpenses.map(exp => (
                    <CSSTransition key={exp.id} timeout={500} classNames="item">
                        <PreferenceTile style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <SettingLabel>{exp.expense_name}</SettingLabel>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ marginLeft: '8px', color: 'grey' }}>📌 {exp.category_name}</span>
                                <span>{exp.used_already}</span>
                            </div>
                        </PreferenceTile>
                    </CSSTransition>


                ))}

                <PreferenceTile>
                    <SettingLabelBold>Variable Expenses</SettingLabelBold>
                </PreferenceTile>
                
                {variableExpenses.map(exp => (
                    <CSSTransition key={exp.id} timeout={500} classNames="item">
                        <PreferenceTile>
                            <SettingLabel>{exp.expense_name}</SettingLabel>
                            <SettingValue>📌 {exp.category_name} - {exp.used_already}</SettingValue>
                        </PreferenceTile>
                    </CSSTransition>
                ))}
            </Card>
        </Wrapper>
    );
}

export default Logs;