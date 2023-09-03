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
import {  faSave, faBan,faEdit,faCheckCircle,faCircle } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useRef } from 'react';
//const BASE_URL = 'http://localhost:5000';
const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";


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
                fontSize = "16px"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <NumberInput 
                type="number"
                step="0.01"
                fontSize = "16px"
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
            <div className="add-category" onClick={handleAdd}>{t('dailyPurchases')}</div>
          );
        }
      }
    const [ongoingMonth, setOngoingMonth] = useState(null);
 
    const [dateFormat, setDateFormat] = useState('MM-DD-YYYY'); // default format, adjust as needed
    const [aiCoach, setAiCoach] = useState('coach1'); // default format, adjust as needed
    const [currency, setCurrency] = useState('CNY'); // default format, adjust as needed
    const [monthlyIncome, setMonthlyIncome] = useState('5000'); // default format, adjust as needed
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
                    setAiCoach(data.data.ai_coach);
                    setMonthlyIncome(data.data.monthly_income);
                    setCurrency(data.data.currency);
                    console.log("Coach selected: " ,data.data.ai_coach)
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

    // if (ongoingMonth) {
    //     const monthNum = parseInt(ongoingMonth.split('-')[1], 10);
    //     const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    //     const monthKeyName = monthNames[monthNum - 1];
    //     const formattedOngoingMonth = i18n.t(`months.${monthKeyName}`);
    // } else {
    //     console.error("monthKey is not initialized!");
    // }

    const formattedOngoingMonth = i18n.t(`month${ongoingMonthIndex}`);



    
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

    // //Edit Transactions sectin start
    // function TransactionList() {
    //     return (
    //         <div>
    //             {otherTransactions.map(transaction => (
    //                 <div key={transaction.id}>
    //                     {transaction.isEditing ? (
    //                         <TransactionEditForm transaction={transaction} />
    //                     ) : (
    //                         <>
    //                             {/* Display transaction data here */}
    //                             <button onClick={() => handleEditClick(transaction.id)}>Edit</button>
    //                         </>
    //                     )}
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // }
    // function handleEditClick(transactionId) {
    //     setOtherTransactions(prevTransactions =>
    //         prevTransactions.map(transaction =>
    //             transaction.id === transactionId
    //                 ? { ...transaction, isEditing: true }
    //                 : transaction
    //         )
    //     );
    // }
    
    // function TransactionEditForm({ transaction }) {
    //     const [editedTransaction, setEditedTransaction] = useState(transaction);
    
    //     const handleSubmit = async () => {
    //         // Call backend to update transaction
    //         // Example: await updateTransactionAPI(editedTransaction);
    
    //         // Update local state to reflect changes and exit edit mode
    //         setOtherTransactions(prevTransactions =>
    //             prevTransactions.map(t =>
    //                 t.id === transaction.id
    //                     ? { ...editedTransaction, isEditing: false }
    //                     : t
    //             )
    //         );
    //     };
    
    //     return (
    //         <div>
    //             {/* Sample fields for editing */}
    //             <input
    //                 value={editedTransaction.category_name}
    //                 onChange={e =>
    //                     setEditedTransaction({
    //                         ...editedTransaction,
    //                         category_name: e.target.value,
    //                     })
    //                 }
    //             />
    //             {/* Add other fields as needed */}
    //             <button onClick={handleSubmit}>Save2</button>
    //             <button onClick={() => cancelEdit(transaction.id)}>Cancel2</button>
    //         </div>
    //     );
    // }
    

    
    // //Edit Transactions section end


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
                }, 10000);
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
    //Editing section function start
    function handleTransactionChange(event, type, transactionId) {
        const newValue = event.target.value;
        setOtherTransactions(prevTransactions =>
            prevTransactions.map(transaction =>
                transaction.id === transactionId
                    ? { ...transaction, [type === 'name' ? 'transaction_name' : 'transaction_amount']: newValue }
                    : transaction
            )
        );
    }
    function cancelEdit(transactionId) {
        if (backupTransaction && backupTransaction.id === transactionId) {
            setOtherTransactions(prevTransactions =>
                prevTransactions.map(transaction => {
                    if (transaction.id === transactionId) {
                        return { ...backupTransaction, isEditing: false };
                    }
                    return transaction;
                })
            );
        } else {
            // Even if there's no backup for some reason, still ensure the transaction exits edit mode
            setOtherTransactions(prevTransactions =>
                prevTransactions.map(transaction =>
                    transaction.id === transactionId
                        ? { ...transaction, isEditing: false }
                        : transaction
                )
            );
        }
    }
    
    
    function toggleEdit(transactionId) {
        setOtherTransactions(prevTransactions =>
            prevTransactions.map(transaction => {
                if (transaction.id === transactionId) {
                    // If entering edit mode, save a backup
                    if (!transaction.isEditing) {
                        setBackupTransaction({...transaction});
                    }
                    return { ...transaction, isEditing: !transaction.isEditing };
                }
                return transaction;
            })
        );
    }
    
    function formatDateToMonthString(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');  // +1 to get the month in 1-12 format
        return `${year}-${month}`;
    }
    function saveEdit(transactionId) {
        const editedTransaction = otherTransactions.find(t => t.id === transactionId && t.isEditing);
    
        if (!editedTransaction) {
            console.error(`Transaction with ID ${transactionId} not found or not in editing mode.`);
            return;
        }
    
        const newTransactionValues = {
            transaction_name: editedTransaction.transaction_name,
            transaction_amount: editedTransaction.transaction_amount,
            transaction_date: formatDateToMonthString(editedTransaction.transaction_date)
        };
    
        fetch(`${BASE_URL}/update-transaction`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transaction_id: transactionId,
                newTransactionValues
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Transaction updated successfully:', data.message);
                toggleEdit(transactionId);
            } else {
                console.error('Failed to update transaction:', data.message);
                // Handle any additional logic if the update failed
            }
        })
        .catch(error => {
            console.error('Error updating transaction:', error);
            // Handle the error (e.g., show an error message to the user)
        });
    }
    
    const [backupTransaction, setBackupTransaction] = useState(null);

    //Editing section function end
    const [userInput, setUserInput] = useState('');
    const [lastSent, setLastSent] = useState(null);
    const [lastResponse, setLastResponse] = useState(null); // <-- New state
    const typingIntervalRef = useRef(null);
    const chatWithCoach = async () => {
        const currentTime = new Date().getTime();

        // Check if the last message was sent within 5 seconds
        if (lastSent && (currentTime - lastSent) < 5000) { 
            console.log("You've already sent a message recently. Please wait for a few seconds before sending again.");
            return;
        }
    
        // Check if it's been less than 5 seconds since the last response
        if (lastResponse && (currentTime - lastResponse) < 5000) {
            console.log("Received a response recently. Please wait before triggering another request.");
            return;
        }
    
        // Clear any existing interval before starting a new one
        if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
        }
    
        // Start the 'typing' effect
        let dotCount = 0;

        // Ensure you're setting an initial '...' effect immediately
        setCoachReply('.');

        typingIntervalRef.current = setInterval(() => {
            dotCount = (dotCount + 1) % 4;
            let dots = ".".repeat(dotCount);
            setCoachReply(dots);
        }, 500);
    
        const simplifiedExpenses = expenses.map(expense => ({
            expense_name: expense.expense_name,
            expense_amount: expense.expense_amount,
            expense_type: expense.expense_type,
            used_already: expense.used_already,
            category_name: expense.category_name
        }));
    
        const simplifiedTransactions = otherTransactions.map(transaction => ({
            transaction_name: transaction.transaction_name,
            transaction_amount: transaction.transaction_amount,
            matched_expense_name: transaction.matched_expense_name,
            category_name: transaction.category_name
        }));
    
        const data = {
            prompt: userInput,
            max_tokens: 1000,
            user_id: user.id,
            language: i18n.language,
            monthly_income: monthlyIncome,
            expenses: simplifiedExpenses,
            transactions: simplifiedTransactions,
            coach: aiCoach,
            name: user.username,
            currency: currency
        };
    
        let isResponseReceived = false;
    
        const handleResponseCompletion = () => {
            isResponseReceived = true;
            clearInterval(typingIntervalRef.current);
        };
    
        const timeoutId = setTimeout(() => {
            if (!isResponseReceived) {
                handleResponseCompletion();
                setCoachReply(t('serverError'));
            }
        }, 5000);
    
        try {
            console.log("Trying to communicate with AI Coach...", data);
            setChatPopupVisible(true);
            const response = await axios.post(`${BASE_URL}/chatWithNushi3.5`, data);
    
            clearTimeout(timeoutId);  // Clear the timeout since response is received
        
            if (response.data) {
                setCoachReply(response.data);
                console.log("Got Reply...", response.data);
                setLastResponse(currentTime);  // <-- Update the last response time here
            } else {
                setCoachReply(t('noResponse'));
            }
        
            setLastSent(currentTime);
        } catch (error) {
            handleResponseCompletion();
            clearTimeout(timeoutId);  // Clear the timeout since an error occurred
            setCoachReply(t('serverError'));
        } finally {
            handleResponseCompletion();
            setChatPopupVisible(true);
        }
        // Delayed clearing of the interval
        setTimeout(() => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        }, 200);
    };
    
    

    const [isExpanded, setIsExpanded] = useState(false);
    const cardStyles = isExpanded
    ? { 
        transition: 'maxHeight 0.5s ease-in-out, opacity 0.4s ease-in-out', 
        maxHeight: '1000px',
        overflow: 'hidden'
      }
    : {
        transition: 'maxHeight 0.5s ease-in-out, opacity 0.4s ease-in-out', 
        maxHeight: '50px',  /* or whatever height the collapsed state should be */
        overflow: 'hidden'
      };

  const textareaStyles = {
    width: '100%',
    padding: '5px',
    boxSizing: 'border-box'
  };
  //Pop-up area
    const [isChatPopupVisible, setChatPopupVisible] = useState(false);
    const [coachReply, setCoachReply] = useState('');
    const chatPopupStyles = {
        position: 'fixed',
        bottom: isChatPopupVisible ? '0px' : '-450px',
        left: '0px',
        right: '0px',
        height: '400px',
        backgroundColor: 'white',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        transition: 'bottom 0.3s ease-out',
        zIndex: 999
    };
    const [isEditingCategory, setIsEditingCategory] = useState(false);
    const [currentEditingCategory, setCurrentEditingCategory] = useState(null);
    const handleCategoryEditClick = (transactionId) => {
        setIsEditingCategory(true);
        setCurrentEditingCategory(transactionId);
    };
    const handleCategoryChange = (matched_expense_name, newCategory, id) => {
        // Display "Updating..." message when a category is clicked
        setMessage('Updating...');
        console.log('From...',matched_expense_name, " to ", newCategory, " id: ", id);
        
        // Prepare data to be sent to the backend
        const payload = {
            transaction_id: id, 
            oldCategory: matched_expense_name,
            newCategory: newCategory
        };
    
        // Make API call to change category
        axios.put(`${BASE_URL}/change-transaction-category`, payload)
            .then(response => {
                if (response.data.success) {
                    // Update the local state to reflect the change in category
                    let updatedTransactions = otherTransactions.map(trans => {
                        if (trans.id === id) {
                            trans.matched_expense_name = newCategory;
                        }
                        return trans;
                    });
                    
                    // Update the state
                    setOtherTransactions(updatedTransactions);
    
                    // Show success message
                    setMessage('Update Successful!');
    
                    // Optionally hide the message after some time
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                } else {
                    // Handle failure scenario here
                    setMessage('Update Failed!');
                }
    
                // Reset states
                setIsEditingCategory(false);  // Close the category dropdown
                setCurrentEditingCategory(null);  // Reset the editing category
            })
            .catch(error => {
                console.error('Error updating category:', error);
                setMessage('An error occurred.');
                
                // Reset states
                setIsEditingCategory(false);
                setCurrentEditingCategory(null);
            });
    };
    const sendCategoryChange = (transactionId, newCategory) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            // Mocking an API call with a 2-second delay
            resolve({ success: true });
          }, 2000);
        });
    };
    const [selectedCategory, setSelectedCategory] = useState("");
    const [message, setMessage] = useState(null);

    return isLoading ? <LoadingSpinner /> : (
        
        
        <Wrapper>

            {/* <div style={chatPopupStyles}>
            <button className="button" onClick={() => setChatPopupVisible(false)} style={{ position: 'absolute', top: '10px', right: '10px' }}>X</button>
                <img src={`/Nushi/${aiCoach}.jpg`} alt="User Avatar" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                <div>{coachReply}</div>
            </div> */}
            <div style={chatPopupStyles}>
                <button 
                    className="button" 
                    onClick={() => setChatPopupVisible(false)} 
                    style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        fontFamily: 'Gelix' 
                    }}>
                    X
                </button>

                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'flex-start', 
                    marginTop: '40px' 
                }}>
                    <img 
                        src={`/Nushi/${aiCoach}.jpg`} 
                        alt="User Avatar" 
                        style={{ 
                            width: '60px', 
                            height: '60px', 
                            marginRight: '10px', 
                            borderRadius: '30px' 
                        }} 
                    />

                    <div style={{ 
                        padding: '10px 15px', 
                        backgroundColor: '#e1f3fd', 
                        borderRadius: '10px', 
                        maxWidth: '300px', 
                        wordWrap: 'break-word',
                        fontFamily: 'Gelix' 
                    }}>
                        {coachReply}
                    </div>
                </div>
            </div>


            <Card style={cardStyles} onClick={() => setIsExpanded(!isExpanded)}>
            {!isExpanded ? (
                <div 
                style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    cursor: 'pointer', // Makes the cursor a hand when hovering over it
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Adds a subtle shadow
                    borderRadius: '5px', // Rounds the corners slightly
                    border: '1px solid #dcdcdc', // Adds a subtle border
                    display: 'flex', // Ensures children are in a row
                    alignItems: 'center', // Vertically aligns the children in the center
                    justifyContent: 'center' // Horizontally aligns the children in the center
                }} 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <img src={`/Nushi/${aiCoach}.jpg`} alt="User Avatar" style={{ width: '30px', height: '30px', marginRight: '10px' }} />

                {t('talkWithAiCoach')}
                <FontAwesomeIcon 
                    icon={faChevronRight} 
                    style={{
                    marginLeft: '5px', 
                    transform: isExpanded ? 'rotate(90deg)' : 'none'
                    }} 
                />
                </div>
            ) : (
            <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={`/Nushi/${aiCoach}.jpg`} alt="User Avatar" style={{ width: '60px', height: '60px', marginRight: '10px' }} />
                    <Heading>{t('writeFinancialNote')}</Heading>
                </div>
                </div>

                <textarea
                value={userInput}
                onChange={e => {
                    e.stopPropagation();
                    setUserInput(e.target.value);
                }}
                onClick={e => e.stopPropagation()}
                rows="6"
                placeholder={t('enterTransaction')}
                style={textareaStyles}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button     className='button' 
                onClick={e => {
                    e.stopPropagation();
                    chatWithCoach();
                }}  style={{ marginRight: '10px' }}>{t('analyze')}</button>
                {/* <button className='button'>{t('submit')}</button> */}
                </div>
            </>
            )}
        </Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
                <Heading>{t('recentTransactions')} </Heading>

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
                        {/* {t(formattedOngoingMonth)} */}
                        {t('step2')}
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
                            {transaction.isEditing ? (
                                // If in edit mode
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                <div style={{ display: 'flex', flexGrow: 1, marginRight: '10px' }}>
                                    <input
                                        value={transaction.transaction_name}
                                        type="text"
                                        className="log-category-input"
                                        placeholder="Expense"
                                        onChange={e => handleTransactionChange(e, 'name', transaction.id)}
                                        style={{ marginRight: '10px', flexGrow: 1 }}
                                    />
                                    <input
                                        value={transaction.transaction_amount.toString()}
                                        className="log-number-input"
                                        step="0.01"
                                        placeholder="Value"
                                        onChange={e => handleTransactionChange(e, 'amount', transaction.id)}
                                        type="number"
                                        style={{ flexGrow: 1 }}
                                    />
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <FontAwesomeIcon 
                                        icon={faSave} 
                                        onClick={() => saveEdit(transaction.id)}
                                        style={{ cursor: 'pointer', marginRight: '10px' }} 
                                    />
                                    <FontAwesomeIcon 
                                        icon={faBan} 
                                        onClick={() => cancelEdit(transaction.id)}
                                        style={{ cursor: 'pointer' }} 
                                    />
                                </div>
                            </div>
                            
                            ) : (
                                // If not in edit mode, render static content
                                <>
                                    <SettingLabel onClick={() => toggleEdit(transaction.id)}>
                                        {transaction.transaction_name}
                                    </SettingLabel>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    {
                                    isEditingCategory && transaction.id === currentEditingCategory ? (
                                        <>
                                    <div>
                                                <div style={{ border: '0px solid black', display: 'block !important', position: 'relative' }}>
                                                {expenses.map((expense) => (
                                                    <div
                                                        key={expense.id}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            padding: '5px',
                                                            margin: '5px',
                                                            border: '1px solid #ccc',
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => handleCategoryChange(transaction.matched_expense_name, expense.expense_name, transaction.id)}
                                                    >
                                                        {transaction.matched_expense_name === expense.expense_name && (
                                                            <FontAwesomeIcon 
                                                                icon={faCheckCircle} 
                                                                style={{ marginRight: '10px'}}
                                                            />
                                                        )}
                                                        {expense.expense_name}
                                                    </div>
                                                ))}
                                                </div>

                                                {/* Display the success, error, or updating message */}
                                                {message && (
                                                    <div>
                                                        {message === 'Update Successful!' && <SuccessMessage>{message}</SuccessMessage>}
                                                        {message === 'Updating...' && <SuccessMessage>{message}</SuccessMessage>}
                                                        {message !== 'Update Successful!' && message !== 'Updating...' && <ErrorMessage>{message}</ErrorMessage>}
                                                    </div>
                                                )}
                                            </div>

                                        </>
                                    ) : (
                                        <>
                                        <span style={{ color: 'grey' }} onClick={() => toggleEdit(transaction.id)}>📌 {transaction.matched_expense_name}</span>
                                        <FontAwesomeIcon 
                                            icon={faEdit} 
                                            style={{ marginLeft: '4px',color: 'grey'  }}
                                            onClick={() => handleCategoryEditClick(transaction.id)}
                                        />
                                        
                                        </>
                                    )
                                    }

                                        <span 
                                            style={{ flexGrow: 1, textAlign: 'right', marginRight: '10px', step:"0.01" }}
                                            onClick={() => toggleEdit(transaction.id)}
                                        >
                                            {parseFloat(transaction.transaction_amount).toFixed(2)}
                                        </span>

                                        <FontAwesomeIcon 
                                            icon={faTimes} 
                                            className="custom-icon-class" 
                                            onClick={() => deleteExpense(transaction.user_id, transaction.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </div>
                                </>
                            )}
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