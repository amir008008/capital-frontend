import React, { useState, useEffect,useContext } from 'react';
import AuthContext from '../Account/AuthContext';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../LoadingSpinner';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const BASE_URL = 'http://localhost:5000';
//const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";


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

    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
const CategoryInput = styled.input`
  flex: 2;
  padding: 8px; /* slightly reduced for mobile */
  border: 1px solid #e0e0e0;
  border-radius: 4px;
width: 120px;

`;

const NumberInput = styled.input`
  flex: 2;
  padding: 8px; /* slightly reduced for mobile */
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 80px;
  margin-left: 20px;
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
const NarrowContainer = styled.div`
  width: 80%; /* Adjust the width value as needed */
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
const Icon = styled.div`
    font-size: 24px;
    color: var(--purple-3);
    margin: 5px;
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
    const { t } = useTranslation();
    const [dataRefreshKey, setDataRefreshKey] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    function ExpenseInput({ isAddingCategory, handleAdd, handleCancel }) {
        const [categoryName, setCategoryName] = useState('');
        const [categoryValue, setCategoryValue] = useState('');
      
        const handleSubmit = () => {
          if (categoryName && categoryValue) {
            handleAdd(categoryName, categoryValue);
            
            // Reset the fields after submitting
            setCategoryName('');
            setCategoryValue('');
          }
        };
      
        if (isAddingCategory) {
          return (
            <>
              <CategoryInput 
                type="text"
                className="category-input"
                placeholder={t('category')}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <NumberInput 
                type="number"
                step="0.01"
                placeholder={t('value')}
                className="number-input"
                value={categoryValue}
                onChange={(e) => setCategoryValue(e.target.value)}
              />
      
              <div className="add-category button-submit" onClick={handleSubmit}>{t('submit')}</div>
              {handleCancel && 
                <div className="add-category button-close" onClick={handleCancel}>{t('cancel')}</div>}
            </>
          );
        } else {
          return (
            <div className="add-category" onClick={handleAdd}>{t('addCategory')}</div>
          );
        }
      }
    const [ongoingMonth, setOngoingMonth] = useState(null);
 
    const [dateFormat, setDateFormat] = useState('MM-DD-YYYY'); // default format, adjust as needed
    const [userLocale, setUserLocale] = useState('en_US'); // default format, adjust as needed
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
                    setUserLocale(data.data.locale);
                    moment.locale(data.data.locale);
                   // console.log('Fetched locale:', data.data.locale);  // Added console log

                } else {
                    console.warn('Failed fetching preferences with response:', data);  // Added warning log
                }
            })
            .catch(error => {
                console.error('Error during the fetch operation:', error);  // Improved error message
            });
    }, []);  // The empty dependency array ensures this useEffect runs once

    // Format ongoingMonth based on user's preferences
    const { setUser, baseURL } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    //console.log('User Locale: ' + userLocale);
    moment.locale(userLocale);
    // const formattedOngoingMonth  = moment(ongoingMonth).format('MMMM'); // For a format like "January 2021"
    const ongoingMonthIndex = new Date().getMonth(); // Returns index from 0-11

    // Get the long-form month name based on current language
    const formattedOngoingMonth = i18n.t(`months.long[${ongoingMonthIndex}]`);

    
    const [expenses, setExpenses] = useState([])    ;
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
    }, [user.id,dataRefreshKey]);

    useEffect(() => {
        if (!ongoingMonth) return;

        const fetchExpenses = async () => {
            try {
                const sanitizedOngoingMonth = ongoingMonth.replace(/%/g, "");
                const response = await fetch(`${BASE_URL}/get-expenses-for-logging?user_id=${user.id}&month=${sanitizedOngoingMonth}`);
                const data = await response.json();
                console.log("Expenses Data for month ", sanitizedOngoingMonth, data);
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
    }, [user.id, ongoingMonth,dataRefreshKey]);
    useEffect(() => {
        console.log('Moment Locale: ' + moment.locale);
        //setFormattedOngoingMonth (moment(ongoingMonth).format('MMMM')); // For a format like "January 2021"
    }, []);

    //Other Transactions
    const [otherTransactions, setOtherTransactions] = useState([]);
    const fetchOtherTransactions = async () => {

        try {

            const response = await fetch(`${BASE_URL}/get-transactions?user_id=${user.id}&date=${ongoingMonth}`);
            const data = await response.json();
            if (data.success) {

                console.log("Raw transactions:", data.transactions); // Log the raw transactions
                
                const transactionsWithCategory = await Promise.all(
                    data.transactions.map(async transaction => {
                        const categoryResponse = await fetch(`${BASE_URL}/get-category-by-name?expense_name=${transaction.matched_expense_name}&expense_month=${ongoingMonth}`);
                        const categoryData = await categoryResponse.json();
                        if (categoryData.success && categoryData.data.length > 0) {
                            transaction.category_name = categoryData.data[0].category_name;
                        } else {
                            transaction.category_name = 'Unknown'; // Default if not found
                        }
    
                        console.log("Processed transaction:", transaction); // Log the processed transaction with its category
                        return transaction;
                    })
                );
    
                console.log("Final transactions with categories:", transactionsWithCategory); // Log the final array
    
                setOtherTransactions(transactionsWithCategory);
                

            } else {
                console.error("Failed to fetch transactions:", data.message);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };
    
    useEffect(() => {
        // Assuming expenses is an array of expense objects
        if (!expenses.length) return;  // If there's no expense data, don't do anything
    
        // Process the transactions using the data from expenses

        
        fetchOtherTransactions();
        console.log('entering Fetching other transactions');
    
    }, [expenses]);  // This effect will run whenever the expenses data changes
    useEffect(() => {
        if (!ongoingMonth) return;
        
        fetchOtherTransactions();  // Call the function here
        console.log('entering Fetching other transactions');

    }, [ongoingMonth,dataRefreshKey]);  // Dependency list ensures that this useEffect runs whenever user.id changes
    

    
    const fixedExpenses = expenses.filter(exp => exp.expense_type.toLowerCase() === 'fixed');
    const variableExpenses = expenses.filter(exp => exp.expense_type.toLowerCase() === 'variable');

    const [isAddingCategoryFixed, setIsAddingCategoryFixed] = useState(false);
    const [newCategoryNameFixed, setNewCategoryNameFixed] = useState('');
    const [newCategoryValueFixed, setNewCategoryValueFixed] = useState('');

    const handleRefresh = () => {
        setDataRefreshKey(prevKey => prevKey + 1);
    };
  
    const [isAddingCategoryVariable, setIsAddingCategoryVariable] = useState(false);
    const [newCategoryNameVariable, setNewCategoryNameVariable] = useState('');
    const [newCategoryValueVariable, setNewCategoryValueVariable] = useState('');
    const handleAddCategory = (type, name, value) => {
        if (type === 'Fixed') {
          if (isAddingCategoryFixed) {
            // Extract the current month from selectedMonthYear
            const currentMonth = parseInt(ongoingMonth.split('-')[1], 10);
            const currentYear = ongoingMonth.split('-')[0];
      
            // no Loop through the months starting from the current month till December
              const month = currentMonth;
              const formattedMonth = month < 10 ? `0${month}` : `${month}`; // Ensure the month is in the format 'MM'
              const expenseMonth = `${currentYear}-${formattedMonth}-01`;
              
              const payload = {
                user_id: user.id, // Get user ID from appropriate source
                category: 1,
                expenseName: name,
                expenseAmount: value,
                expenseType: type,
                expenseMonth
              };
              console.log(payload);  // Add this line
        
              // Send the payload for each month
              addCategory(
                payload.user_id,
                payload.category,
                payload.expenseName,
                payload.expenseAmount,
                payload.expenseType,
                payload.expenseMonth
              );
            
        
            // Reset the state after adding for all months
            setNewCategoryNameFixed('');
            setNewCategoryValueFixed('');
            setIsAddingCategoryFixed(false);
            // window.location.reload();
            handleRefresh();
    
          } else {
            // If not in adding state, switch to the adding state
            setIsAddingCategoryFixed(true);
          }
        }
        if (type === 'Variable') {
          if (isAddingCategoryVariable) {
              // For 'Variable', you only need to add for the current month
              const expenseMonth = `${ongoingMonth}-01`;
    
              const payload = {
                  user_id: user.id, // Get user ID from appropriate source
                  category: 1,
                  expenseName: name,
                  expenseAmount: value,
                  expenseType: type,
                  expenseMonth
              };
    
              // Send the payload
              addCategory(
                  payload.user_id,
                  payload.category,
                  payload.expenseName,
                  payload.expenseAmount,
                  payload.expenseType,
                  payload.expenseMonth
              );
              console.log(payload);  // Add this line
              
              // Reset the state after adding
              setNewCategoryNameVariable('');
              setNewCategoryValueVariable('');
              setIsAddingCategoryVariable(false);
              // window.location.reload();
              handleRefresh();
    
            } else {
              setIsAddingCategoryVariable(true);
    
    
          }
      }
    
    };

    const addCategory = (userId, category, expenseName, expenseAmount, expenseType, expenseMonth) => {
        if (!expenseMonth || expenseMonth === 'null') {
            console.error('No valid expense month provided.');
            setErrorMessage(t('noOngoingMonth') + " " + t('redirecting'));
            return; // exit the function early
        }
    
        const adjustedExpenseMonth = `${expenseMonth.slice(0, 7)}%`;
    
        fetch(`${BASE_URL}/add-log`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                category: category,
                expenseName: expenseName,
                expenseAmount: expenseAmount,
                expenseType: expenseType,
                expenseMonth: adjustedExpenseMonth
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Successfully added expense:', data.message, data.expenseId);
                setSuccessMessage('Expense entered successfully!');
                setTimeout(() => {
                    setSuccessMessage('');  
                    handleRefresh(); 
                }, 1000);
            } else {
                const errorMessage = data.error || data.message || 'Unknown error';
                console.error('Error adding expense:', errorMessage);
                setErrorMessage(t('errorAddingExpense', { errorMessage: errorMessage }));
                
                // Throw an error to be caught in the .catch() block
                throw new Error(errorMessage);
            }
        })
        
        .catch(error => {
            console.error('Error adding expense:', error);
            
            if (error.message.includes('Incorrect date value') || error.message.includes('null-01%-01')) {
                setErrorMessage(t('noOngoingMonth') + " " + t('redirecting'));
                setTimeout(() => {
                    window.location.href = '/budget'; // Adjust this to your budget page URL if different
                }, 5000);
                // Using react-router's history to navigate
                // history.push('/budget'); 
                
                // Or use window redirection if you aren't using a routing library:
            } else {
                setErrorMessage(t('unexpectedError'));
            }
        });
        
    };
    const deleteExpense = (userId, transactionId) => {
        fetch(`${BASE_URL}/delete-transaction`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                transaction_id: transactionId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setSuccessMessage(data.message); // Setting success message
                // Assuming you have a function to refresh the list of transactions
                handleRefresh(); 
            } else {
                setErrorMessage(t('errorMessageWithContent', { message: data.message }));
            }
        })
        .catch(error => {
            console.error('There was an error deleting the transaction:', error);
            setErrorMessage(t('errorProcessing'));
        });
    };
    const [isLoading, setIsLoading] = useState(false); // For the loading spinner

    
    return isLoading ? <LoadingSpinner /> : (
        
        
        <Wrapper>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Heading>{t('step2')}</Heading>

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
                    {/* <PreferenceTile>
                        <SettingLabelBold>Fixed Expenses</SettingLabelBold>
                    </PreferenceTile> */}
                </div>
                


                {/* <PreferenceTile>
                    <SettingLabelBold>Variable Expenses</SettingLabelBold>
                </PreferenceTile> */}
                
                {otherTransactions.map(transaction => (
                    <CSSTransition key={transaction.id} timeout={500} classNames="item">
                        <PreferenceTile style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            <SettingLabel>{transaction.transaction_name}</SettingLabel>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                
                                {/* Category Name (Left-Aligned) */}
                                <span style={{ color: 'grey' }}>📌 {transaction.matched_expense_name}</span>
                                
                                {/* Transaction Amount (Right-Aligned to Delete Button) */}
                                <span style={{ flexGrow: 1, textAlign: 'right', marginRight: '10px' }}>
                                    {parseInt(transaction.transaction_amount)}
                                </span>

                                {/* Delete icon/button (Rightmost) */}
                                <FontAwesomeIcon 
                                    icon={faTimes} 
                                    className="custom-icon-class" 
                                    onClick={() => deleteExpense(transaction.user_id, transaction.id)}
                                    style={{ cursor: 'pointer' }}  // Optional styling to position the delete icon
                                />
                            </div>
                        </PreferenceTile>
                    </CSSTransition>
                ))}



                            {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
                            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                            <PreferenceTile>
                                
 
                           <div className="button-group">
                            <ExpenseInput 
                                isAddingCategory={isAddingCategoryVariable}
                                categoryName={newCategoryNameVariable}
                                categoryValue={newCategoryValueVariable}
                                setCategoryName={setNewCategoryNameVariable}
                                setCategoryValue={setNewCategoryValueVariable}
                                handleAdd={(categoryName, categoryValue) => handleAddCategory('Variable', categoryName, categoryValue)}
                            />
                          </div>
                          </PreferenceTile>

            </Card>
            
        </Wrapper>
    );
}

export default Logs;