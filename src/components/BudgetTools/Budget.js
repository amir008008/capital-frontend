import React, { useRef,useState ,useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import '../../App.css';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import Modal from 'react-modal';
import 'font-awesome/css/font-awesome.min.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import UserPreferencesContext from '../Account/UserPreferencesContext';
import { useContext } from 'react';
import AuthContext from '../Account/AuthContext';
import LoadingSpinner from '../../LoadingSpinner';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Logs.js
 const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
 //const BASE_URL = 'http://localhost:5000';
const YEAR = 2023;

// Custom hook to log and track how often it's invoked
function useLoggedHook(hookFunction, ...args) {
  const [count, setCount] = useState(0);

  useEffect(() => {
          console.log("Timeout 7 300");

      setCount(prevCount => prevCount + 1);
  });

  console.log(`Hook ${hookFunction.name} has run ${count} times.`);

  return hookFunction(...args);
}

const Budget = () => {
  const { t, i18n } = useTranslation(); // Use i18next hooks
  const { user } = useContext(AuthContext); 
  const { setPreferences, baseURL } = useContext(UserPreferencesContext);
  const [formPreferences, setFormPreferences] = useState({});
  const [renderCount, setRenderCount] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    //  setTimeout(() => {
    //   console.log("Timeout 500 because user, setPreferences, baseURL, t, i18n" );
    // }, 500);
    console.log("Timeout first because user, setPreferences, baseURL, t, i18n" );

      if (user) {

          fetch(`${BASE_URL}/preferences/${user.id}`)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
              })
              .then(data => {
                  if (data.success && data.data) {
                      setPreferences(data.data);
                      setFormPreferences(data.data);
                      
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
  }, []);

  useEffect(() => {
    console.log("Timeout 2 300");

      setRenderCount(prevCount => prevCount + 1);
      console.log(`Component has rendered ${renderCount} times.`);
  }, []);

  // window.alert('Reset');
  const currentSystemMonthIndex_X9aB72 = new Date().getMonth();
  const [activeMonthIndex_X9aB72, setActiveMonthIndex_X9aB72] = useState(currentSystemMonthIndex_X9aB72);
  const navigate = useNavigate();
  //const { user } = useContext(AuthContext);
  const username = user ? user.username : null;
  const [dataRefreshKey, setDataRefreshKey] = useState(0);
  const handleRefresh = () => {
    setDataRefreshKey(prevKey => prevKey + 1);
};


const [isLoading, setIsLoading] = useState(false); // For the loading spinner
// useRef to hold references to the active month
const monthRefs = React.useRef({});

// 1. Scroll to the active month when the active month changes
React.useEffect(() => {
  console.log("【3】 activeMonthIndex_X9aB72" , activeMonthIndex_X9aB72);

  if (monthRefs.current[activeMonthIndex_X9aB72] && monthRefs.current[activeMonthIndex_X9aB72].current) {
    monthRefs.current[activeMonthIndex_X9aB72].current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
  }

  // Capture the active ref and log the details
  const activeRef = monthRefs.current[activeMonthIndex_X9aB72];
  // console.log('Active ref:', activeRef);
  // console.log('Active month:', activeMonthIndex_X9aB72);
}, [activeMonthIndex_X9aB72]);

// 2. Fetch data when activeMonthIndex_X9aB72 or dataRefreshKey changes
React.useEffect(() => {

  console.log("【4】activeMonthIndex_X9aB72 ",activeMonthIndex_X9aB72);

  const activeRef = monthRefs.current[activeMonthIndex_X9aB72];

  async function fetchData() {
    // Check the ref immediately at the start of the fetchData function
    if (!activeRef.current) {
      console.warn('Ref not set. Returning from fetchData.');
      return;
    }

    const monthYear = getYearMonth(activeMonthIndex_X9aB72);
    const userId = user.id;

    try {
      const result = await populateExpensesDropdown(userId, monthYear);
      // Assuming populateExpensesDropdown returns some value to set in state
      // setState(result);

      const fetchPromises = months.map((_, monthIndex) => {
          const monthYear = getYearMonth(monthIndex);
          return fetch(`${BASE_URL}/get-budget-status?user_id=${userId}&month=${monthYear}`)
              .then(response => response.json())
              .then(data => {
                  return { monthYear, status: data.status };
              });
      });

      const results = await Promise.all(fetchPromises);
      const newMonthStatuses = results.reduce((acc, result) => {
          acc[result.monthYear] = result.status;
          return acc;
      }, {});

      setMonthStatuses(prevStatus => ({ ...prevStatus, ...newMonthStatuses }));

      const response = await fetch(`${BASE_URL}/get-expenses?user_id=${userId}&month=${monthYear}`);
      const data = await response.json();
      setExpenses(data.expenses);
    } catch (error) {
      console.error('Error during fetch operations:', error);
    } finally {
      // console.log('Active ref:', activeRef);
      // console.log('Active month:', activeMonthIndex_X9aB72);
      setIsLoading(false); // End the loading process
    }
  }

  // This ensures fetchData only runs if the ref is set.
  if (activeRef && activeRef.current) {
    fetchData();
  }
}, [activeMonthIndex_X9aB72, dataRefreshKey]);

// 3. Watch for ref changes
React.useEffect(() => {
  console.log("【5】 activeMonthIndex_X9aB72", activeMonthIndex_X9aB72);

  const activeRef = monthRefs.current[activeMonthIndex_X9aB72];
  if (activeRef && activeRef.current) {
    // console.log("Ref has been set!");
  }
}, [activeMonthIndex_X9aB72]);

  // if (!username) {
  //     navigate('/login');
  //     return <div>Loading...</div>;
  // }
  
  // Rest of your component logic
  

  // window.alert(user.username);
  Budget.propTypes = {
    categoryName: PropTypes.string.isRequired,
    setCategoryName: PropTypes.func.isRequired,
    categoryValue: PropTypes.number.isRequired,
    setCategoryValue: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleCancel: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool, // Assuming it's a boolean, but you should adjust as necessary
    type: PropTypes.string, // Assuming it's the type for an input like "text", "password", etc.
    placeholder: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    isAddingCategory: PropTypes.bool.isRequired,
    handleAdd: PropTypes.func.isRequired,
    totalAmount: PropTypes.number.isRequired,
    usedAmount: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    status: PropTypes.string.isRequired
};

  const { preferences } = useContext(UserPreferencesContext);
    const months = t('months.short', { returnObjects: true });
    const monthsfull = t('months.long', { returnObjects: true });

    if (process.env.NODE_ENV === 'development') {
        whyDidYouRender(React, {
            trackAllPureComponents: true,
            logOwnerReasons: true, // log more info about the rerender
            onlyLogs: true, // Don't use the default notifications but only logs
        });
    }
     

    
    
    const openAgain = () => {
        const monthYear = getYearMonth(activeMonthIndex_X9aB72);
        const userId = user.id; // Replace with the user ID later on
    
        // Check if there's already a month with 'ongoing' status
        const isOngoingMonthExists = Object.values(monthStatuses).includes('ongoing');
    
        if (isOngoingMonthExists) {
            console.warn("There's already a month with 'ongoing' status.");
            window.alert("There's already a month with 'ongoing' status.");
            return; // Exit the function if another 'ongoing' month exists
        }
    
        // If no ongoing month exists, set the selected month to 'ongoing'
        const newStatus = 'ongoing';
    
        fetch(`${BASE_URL}/edit-budget-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                month: monthYear,
                newStatus: newStatus,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the monthStatuses state to reflect the new status
                    setMonthStatuses(prevStatus => ({
                        ...prevStatus,
                        [monthYear]: newStatus,
                    }));
                } else {
                    console.error('Error editing budget:', data.error || data.message);
                }
            })
            .catch(error => {
                console.error('Error editing budget:', error);
            });
    };
    
    const displayExpensesForTesting = () => {
      const variableExpenses = getExpensesOfType('Variable', currentMonthStatus);
      const fixedExpenses = getExpensesOfType('Fixed', currentMonthStatus);
    
      console.log('Variable Expenses:', variableExpenses);
      console.log('Fixed Expenses:', fixedExpenses);
    };
    
    
    const closeBudget = () => {
      const monthYear = getYearMonth(activeMonthIndex_X9aB72);
      const nextMonthYear = getYearMonth((activeMonthIndex_X9aB72 + 1) % 12); // wrap around to 0 if it's December
      const userId = user.id; // Replace with the user ID later on
  
      const requests = [
        // Request to close the current month
        fetch(`${BASE_URL}/edit-budget-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            month: monthYear,
            newStatus: 'closed',
          }),
        }),
  
        // Request to set the next month to 'waiting'
        fetch(`${BASE_URL}/edit-budget-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            month: nextMonthYear,
            newStatus: 'waiting',
          }),
        }),
      ];
  
      Promise.all(requests)
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(dataArray => {
          // Check the responses from both requests
          dataArray.forEach((data, index) => {
            const monthToUpdate = index === 0 ? monthYear : nextMonthYear;
            const statusToUpdate = index === 0 ? 'closed' : 'waiting';
  
            if (data.success) {
              // Update the monthStatuses state to reflect the new status
              setMonthStatuses(prevStatus => ({
                ...prevStatus,
                [monthToUpdate]: statusToUpdate,
              }));
            } else {
              console.error(`Error updating ${monthToUpdate} budget:`, data.error || data.message);
            }
          });
        })
        .catch(error => {
          console.error('Error updating budgets:', error);
        });
  };
  
      const approveBudget = () => {
        const monthYear = getYearMonth(activeMonthIndex_X9aB72);
        const userId = user.id; // Replace with the user ID later on
        const newStatus = 'ongoing';
    
        fetch(`${BASE_URL}/edit-budget-status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            month: monthYear,
            newStatus: newStatus,
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Update the monthStatuses state to reflect the new status
              setMonthStatuses(prevStatus => ({
                ...prevStatus,
                [monthYear]: newStatus,
              }));
            } else {
              console.error('Error approving budget:', data.error || data.message);
            }
          })
          .catch(error => {
            console.error('Error approving budget:', error);
          });
      };
      const [monthStatuses, setMonthStatuses] = useState({});
      const [estimatedBudget, setEstimatedBudget] = useState(1000);
      const [expenses, setExpenses] = useState([]);
      const [selectedMonthIndex, setSelectedMonthIndex] = useState(7); // August index
      const [showTransactionLogger, setShowTransactionLogger] = useState(false);
      const handleMonthChange = (index) => {
        setActiveMonthIndex_X9aB72(index);
    
        // Scroll the selected month into view
        monthRefs.current[index].current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
    };
    
    
    
    const summarizeBudgetData = () => {
      // Prepare a CSV string with header.
      let csvContent = "Expense Name,Expense Amount,Used Amount,Remaining\n";
  
      // Calculate total expenses and populate the CSV string.
      const totalExpenses = expenses.reduce((acc, expense) => {
          // Populate individual expense data into the CSV string.
          const remaining = expense.expense_amount - expense.used_already;
          csvContent += `${expense.expense_name},${expense.expense_amount},${expense.used_already},${remaining}\n`;
          return acc + expense.expense_amount;
      }, 0);
  
      // Calculate total remaining funds.
      const totalRemaining = expenses.reduce((acc, expense) => acc + (expense.expense_amount - expense.used_already), 0);
  
      // Append totals to the CSV content.
      csvContent += `Total,${totalExpenses},,${totalRemaining}\n`;
      csvContent += `Overall Status,,,${totalRemaining >= 0 ? 'positive' : 'negative'}`;
  
      // Return an object with totalExpenses, totalRemaining, and csvContent
      return {
          totalExpenses,
          totalRemaining,
          csvContent
      };
  };
  
    
    
  const getFeedbackFromChatGPT = async (budgetSummary) => {
    const promptText = `Reply to me one sentence only that specificily target the wrong or right items in list. Based on my budget data: ${budgetSummary.csvContent}, expenses ${budgetSummary.totalExpenses}，and currently has ${budgetSummary.totalRemaining} . Give feedback in one sentence about spending habits, suggestions, and budget proportions, like duolingo. use item names when necessary`;

    try {
        // Fetching from the proxy route in our backend instead of directly from OpenAI
        const response = await fetch(BASE_URL + "/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: promptText,
                max_tokens: 150
            }),
        });

        // Handle non-ok responses
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Since the server is supposed to return a plain string, we get the response as text
        const feedbackText = await response.text();
        console.log('Feedback text:', feedbackText);

        return feedbackText.trim();

    } catch (error) {
        console.error("Error fetching from ChatGPT:", error);
        return null; // or throw the error to handle it upstream
    }
};

  

    
    const fetchBudgetFeedback = async () => {
      const budgetSummary = summarizeBudgetData();
      const feedback = await getFeedbackFromChatGPT(budgetSummary);
      console.log(feedback); // display this feedback in your app or wherever needed
      window.alert(feedback);

    };
    
    
    const getExpensesOfType = (expenseType, status) => {
      return expenses
        .filter(expense => expense.expense_type === expenseType)
        .map((expense, expenseIndex) => (
          <li key={expenseIndex} className="expense-item">
            {editingExpenseId === expense.id ? (
              <>
                <input 
                  value={editingExpenseName}
                  onChange={(e) => setEditingExpenseName(e.target.value)}
                />
                <input 
                  value={editingExpenseValue}
                  onChange={(e) => setEditingExpenseValue(e.target.value)}
                />
                <button className="button-submit" onClick={() => setEditingExpenseId(null)}>Save</button>
              </>
            ) : (
              <>
                <span className="expense-name">{formatExpenseName(expense.expense_name)}</span>

                <span className={status !== 'waiting' && status !== 'expected' ? "expense-amount-closed-ongoing" : "expense-amount"}>
                   {new Intl.NumberFormat(preferences.locale, { style: 'currency', currency: preferences.currency }).format(Math.round(expense.expense_amount))}
                </span>


                    
                {(status !== 'waiting' && status !== 'expected' ) && (
                  
                  <span className={`used-already ${expense.expense_amount - expense.used_already >= 0 ? 'positive' : 'negative'}`}>
                    {expense.expense_amount - expense.used_already >= 0 ? (
                      <span className="positive">{(expense.expense_amount - expense.used_already).toFixed(2)}</span>
                    ) : (
                      <span className="negative">({Math.abs(expense.expense_amount - expense.used_already).toFixed(2)})</span>
                    )}
                  </span>
                )}
    
                {/* Uncomment the following if you wish to have an edit button in the future */}
                {/* 
                <button className="button-submit" onClick={() => {
                  setEditingExpenseId(expense.id);
                  setEditingExpenseName(expense.expense_name);
                  setEditingExpenseValue(expense.expense_amount);
                }}>
                  Edit
                </button>
                */}
                {(currentMonthStatus !== 'closed' && currentMonthStatus !== 'ongoing') && (
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="custom-icon-class" 
                    onClick={() => deleteExpense(1, expense.id)}
                  />
                )}
              </>
            )}
          </li>
        ));
    };
    
    
      
    
      
      
      
      const addCategory = (userId, category, expenseName, expenseAmount, expenseType, expenseMonth) => {
        fetch(`${BASE_URL}/add-expense`, {
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
            expenseMonth: expenseMonth
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('Successfully added expense:', data.expenseId);
              handleRefresh();
            } else {
              console.error('Error adding expense:', data.error || data.message);
            }
          })
          .catch(error => {
            console.error('Error adding expense:', error);
          });
      };
      
     
      const [isAddingCategoryFixed, setIsAddingCategoryFixed] = useState(false);
      const [newCategoryNameFixed, setNewCategoryNameFixed] = useState('');
      const [newCategoryValueFixed, setNewCategoryValueFixed] = useState('');
    
      
    
      const [isAddingCategoryVariable, setIsAddingCategoryVariable] = useState(false);
      const [newCategoryNameVariable, setNewCategoryNameVariable] = useState('');
      const [newCategoryValueVariable, setNewCategoryValueVariable] = useState('');
      
      const handleAddCategory = (type, name, value) => {
        if (type === 'Fixed') {
          if (isAddingCategoryFixed) {
            // Extract the current month from selectedMonthYear
            const currentMonth = parseInt(selectedMonthYear.split('-')[1], 10);
            const currentYear = selectedMonthYear.split('-')[0];
      
            // Loop through the months starting from the current month till December
            for (let month = currentMonth; month <= 12; month++) {
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
            }
        
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
              const expenseMonth = `${selectedMonthYear}-01`;
    
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
    
    const refreshTabContent = () => {
      // Increment the tabDataChangeToken to trigger a re-render.
      setTabDataChangeToken(prevToken => prevToken + 1);
    };
    
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editingExpenseName, setEditingExpenseName] = useState('');
    const [editingExpenseValue, setEditingExpenseValue] = useState('');
    
    // Function to edit an expense
    const editExpense = (userId, expenseId, updatedName, updatedValue, usedAlready) => {
      fetch(`${BASE_URL}/edit-expense`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          expenseId: expenseId,
          updatedName: updatedName, // New expense name
          updatedValue: updatedValue, // New expense value
          usedAlready: usedAlready
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Successfully updated expense.');
          } else {
            console.error('Error updating expense:', data.error || data.message);
          }
        })
        .catch(error => {
          console.error('Error updating expense:', error);
        });
    };
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Function to delete an expense
    const deleteExpense = (userId, expenseId) => {
      fetch(`${BASE_URL}/delete-expense`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          expenseId: expenseId,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('Successfully deleted expense.');
            //goToNextMonth();
            handleRefresh();
          } else {
            console.error('Error deleting expense:', data.error || data.message);
          }
        })
        .catch(error => {
          console.error('Error deleting expense:', error);
        });
        //goToPreviousMonth();
      };
    
      const addValue = (userId, expenseId, usedAlready) => {
        fetch(`${BASE_URL}/edit-expense`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            expenseId: expenseId,
            usedAlready: usedAlready
          }),
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              console.log('Successfully updated expense value.');
            } else {
              console.error('Error updating expense value:', data.error || data.message);
            }
          })
          .catch(error => {
            console.error('Error updating expense value:', error);
          });
      };
    
      const populateDropdown = () => {
        if (!expenses || expenses.length === 0) return null; // Guard clause to ensure expenses are present
        
        return expenses.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.name}</option>
        ));
    };
    
      const CategoryInputForm = ({ categoryName, setCategoryName, categoryValue, setCategoryValue, handleSubmit, handleCancel }) => {
        return (
            <>
                <input 
                    type="text"
                    placeholder="Category"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Value"
                    value={categoryValue}
                    onChange={(e) => setCategoryValue(e.target.value)}
                />
                <div className="add-category button-submit" onClick={handleSubmit}>Submit</div>
                <div className="add-category button-close" onClick={handleCancel}>Cancel</div>
            </>
        );
    }
    
      function calculateTotalExpenses() {
        return expenses.reduce((acc, curr) => acc + parseFloat(curr.expense_amount), 0);
      }
      function calculateActualUsed() {
        return expenses.reduce((acc, curr) => {
          const usedAlready = parseFloat(curr.used_already);
          if (!isNaN(usedAlready)) {
            return acc + usedAlready;
          }
          return acc;
        }, 0);
      }
    
      const [forceUpdate, setForceUpdate] = useState(0);
    
    // useEffect(() => {
    //     console.log('Component updated!');
    // });
    
      
    // function CustomInput(props) {
    //   const inputRef = useRef(null);
    
    //   useEffect(() => {
    //     if (props.autoFocus && inputRef.current) {
    //       inputRef.current.focus();
    //     }
    //   }, [props.autoFocus]);
    
    //   return (
    //     <input 
    //         ref={inputRef}
    //         type={props.type || "text"}
    //         placeholder={props.placeholder}
    //         value={props.value}
    //         onChange={props.onChange}
    //     />
    //   );
    // }
    
    
      const categoryNameRef = useRef(null);
    const categoryValueRef = useRef(null);
  
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
            <input
              type="text"
              className="category-input"
              placeholder="Category"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Value"
              className="number-input"
              value={categoryValue}
              onChange={(e) => setCategoryValue(e.target.value)}
            />
    
            <div className="add-category button-submit" onClick={handleSubmit}>Submit</div>
            {handleCancel && 
              <div className="add-category button-close" onClick={handleCancel}>Cancel</div>}
          </>
        );
      } else {
        return (
          <div className="add-category" onClick={handleAdd}>Add category</div>
        );
      }
    }
    const selectedMonthYear = getYearMonth(activeMonthIndex_X9aB72);
  
    const populateExpensesDropdown = async (userId, monthYear) => {
      const abortController = new AbortController(); // Create a new AbortController
      const signal = abortController.signal; // Get its signal
    
      try {
        const response = await fetch(`${BASE_URL}/get-expenses?user_id=${userId}&month=${monthYear}`, { signal }); // Use the signal in fetch
        const data = await response.json();
    
        // Log the data returned from the API
        console.log("API Response Data:", data);
    
        if (data && data.expenses && Array.isArray(data.expenses)) {
          setExpenses(data.expenses);
        } else {
          console.error("Invalid data format returned from API");
          setExpenses([]);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
        if (error.name === 'AbortError') return; // Ignore fetch aborts
        setExpenses([]);
      }
    
      return abortController; // Return the AbortController so it can be used to abort the fetch if necessary
    };
    
    

  
    
    const calculateExpenseProgress = (totalAmount, usedAmount) => {
      const remainingAmount = totalAmount - usedAmount;
      const progress = (remainingAmount / totalAmount) * 100;
      return Math.min(Math.max(progress, 0), 100); // ensures it's between 0 and 100
    };
    
    const ProgressBar = ({ totalAmount, usedAmount }) => {
      const progress = calculateExpenseProgress(totalAmount, usedAmount);
      return (
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      );
    };
    function getYearMonth(index) {
      const month = index + 1; // Month index is 0-based, so add 1
      return `${YEAR}-${month.toString().padStart(2, '0')}`;
    }
  

    const formatExpenseName = (name) => {
      const maxChars = 20;  // Set this to your desired character limit
      if (name.length > maxChars) {
          return `${name.slice(0, maxChars - 3)}...`;
      } else {
          return name.padEnd(maxChars, ' ');
      }
  };
  
    function TransactionLogger({ userId, isOpen, onClose }) {
      const [expenses, setExpenses] = useState([]);
      const [selectedExpense, setSelectedExpense] = useState(null);
      const [expenseValue, setExpenseValue] = useState('');
    
      const populateExpensesDropdown = async (userId, monthYear) => {
        try {
          const response = await fetch(`${BASE_URL}/get-expenses?user_id=${userId}&month=${monthYear}`);
          const data = await response.json();
    
          // Log the data returned from the API
          console.log("API Response Data:", data);
    
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
    //   useEffect(() => {
    //     let abortController; // Declare outside the condition so it's accessible in the cleanup function
    
    //     if (isOpen) {
    //         console.log("Fetching expenses...");
    //         const monthYear = getYearMonth(selectedMonthIndex);
    //         const userId = user.id; // Replace with dynamic user ID later on
    //         abortController = populateExpensesDropdown(userId, monthYear); // This now returns the abort controller
    //     }
    
    //     // Cleanup: If component is unmounted and fetch is ongoing, abort it
    //     return () => {
    //         if (abortController) {
    //             abortController.abort();
    //         }
    //     };
    
    // }, [isOpen, selectedMonthIndex]);
    
      const handleSave = () => {
        if (selectedExpense && expenseValue) {
          const usedAlreadyValue = parseFloat(expenseValue); // Parse as float
          const newUsedAlready = selectedExpense.used_already + usedAlreadyValue; // Accumulate the new value
          console.log("Saving expense:", selectedExpense.id, selectedExpense.expense_name, selectedExpense.expense_amount, newUsedAlready);
          editExpense(userId, selectedExpense.id, selectedExpense.expense_name, selectedExpense.expense_amount, newUsedAlready);
          onClose(); // Close the modal
          //window.location.reload();
    
        }
      };
    
      console.log("Rendering TransactionLogger...");
    
      return (
        <Modal className="modal" isOpen={isOpen} contentLabel="Log Transaction">
          {expenses?.length > 0 && (
            <select className="modal-select" onChange={(e) => {
              const selectedOption = expenses.find(exp => exp.id === parseInt(e.target.value));
              setSelectedExpense(selectedOption);
              console.log("Selected Expense:", selectedOption);
            }}>
              <option value="">Select an expense</option>
              {expenses.map(exp => (
                <option key={exp.id} value={exp.id}>{exp.expense_name}</option>
              ))}
            </select>
          )}
    
          {selectedExpense && (
            <div className="input-group">
              <span className="expense-name">{selectedExpense.expense_name}</span>
              <span className="used-already right">{selectedExpense.used_already}</span> {/* Display used already */}
              <input className="number-input" type="number" step="0.01" value={expenseValue} onChange={(e) => setExpenseValue(e.target.value)} />
            </div>
          )}
          <p></p>
          <button className="button save-button" onClick={handleSave}>Save</button>
          <button className="button cancel-button" onClick={onClose}>Cancel</button>
        </Modal>
      );
    }

    
  
  
    
      
      const currentMonthStatus = monthStatuses[selectedMonthYear] || "waiting";
         // Extract the status of the currently selected month
         const TabContent = ({ status }) => {
          switch (status) {
            case "expected":
              case "waiting":
                  return (
                      <div>
                      <div className="budget-info">
                        <div className="current-month">
                          {t('currentMonthYear', { month: monthsfull[activeMonthIndex_X9aB72], year: YEAR })}
                      </div>
                          <div className="budget-amount">{calculateTotalExpenses()}</div>
                          <div className="step-description">{t('step1')}</div>
                        </div>



                          <div className="budget-details">
                          <div className="expenses-heading">{t('fixedExpenses')}</div>
                            <ul className="expense-list">
                            {getExpensesOfType('Fixed', currentMonthStatus)}
                            </ul>
                          
    
                          <div className="button-group">
                          <ExpenseInput 
                              isAddingCategory={isAddingCategoryFixed}
                              categoryName={newCategoryNameFixed}
                              categoryValue={newCategoryValueFixed}
                              setCategoryName={setNewCategoryNameFixed}
                              setCategoryValue={setNewCategoryValueFixed}
                              handleAdd={(categoryName, categoryValue) => handleAddCategory('Fixed', categoryName, categoryValue)}
                              handleCancel={() => setIsAddingCategoryFixed(false)}
                          />
                          </div>    
                          </div>
                          <div className="budget-details">
                            <p></p>
                            <div className="expenses-heading">{t('variableExpenses')}</div>
                            <ul className="expense-list ">
                            {getExpensesOfType('Variable', currentMonthStatus)}
                            </ul>
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
                          </div>
                      </div>
                  );
              
            case "ongoing":
              return (
                <div>
                  <div className="ongoing-info">
                  <div className="header-text">{t('ongoingHeader')}</div>
                    <div className="expense-value">{calculateActualUsed()}</div>
                    <div className="step-description">{t('step3StayOnBudget', { budget: calculateTotalExpenses() })}</div>
                  </div>
                  <div className="budget-details">
                    {/* <div className="expenses-heading">{t('fixedExpenses')}</div> */}
                    <ul className="expense-list">
                      <li className="expense-item">
                        <span className="expenses-heading">{t('fixedExpenses')}</span>
                        <div className="expenses-heading">{t('variableExpenses')}<span className="available-heading">{t('available')}</span></div>
                      </li>
                      {getExpensesOfType('Fixed', currentMonthStatus)}
                    </ul>
                    {/* <div className="button-group">
                      <div className="add-category">Add item</div>
                      <div className="add-value">Add value</div>
                    </div> */}
                    <p></p>
                    <div className="expenses-heading">{t('variableExpenses')}<span className="available-heading"></span></div>
                     {/* Heading for the column */}

                    <ul className="expense-list">
                    {getExpensesOfType('Variable', currentMonthStatus)}
                    </ul>
                    {/* <div className="button-group">
                      <div className="add-category">Add item</div>
                      <div className="add-value">Add value</div>
                    </div> */}
                     <button className="submit-button  open" onClick={closeBudget}>
                        {t('closeBudgetButton')}
                      </button>
                  </div>
                </div>
                
              );
              case "closed":
                return (
                  <div>
                    <div className="closed-info">
                      <div className="total-price">{t('budget')}</div>
                      <div className="budget-amount">{calculateTotalExpenses()}</div>
                      <div className="total-price">{t('expenses')}</div>
                      <div className="budget-amount">{calculateActualUsed()}</div>
                      <div className="step-description">{t('closed')}</div>
                    </div>
                    <div className="budget-details">
                      <ul className="expense-list">
                        <li className="expense-item">
                          <span className="expenses-heading">{t('fixedExpenses')}</span>
                          <div className="expenses-heading">{t('variableExpenses')}<span className="available-heading">{t('available')}</span></div>
                        </li>
                        {getExpensesOfType('Fixed', currentMonthStatus)}
                      </ul>
                      <p></p>
                      <div className="expenses-heading">{t('variableExpenses')}</div>
                      <ul className="expense-list">
                      {getExpensesOfType('Variable', currentMonthStatus)}
                      </ul>
                      <button className="submit-button  admin" onClick={openAgain}>
                        {t('openAgain')}
                      </button>
                    </div>
                  </div>
                  
                );
            default:
              return;
          }
        };
        const MemoizedTabContent = React.memo(TabContent);
    
      const [isModalOpen, setModalOpen] = useState(false);
      const [categoryInput, setCategoryInput] = useState('');
      const [expenseNameInput, setExpenseNameInput] = useState('');
      const [expenseAmountInput, setExpenseAmountInput] = useState('');
      const [expenseTypeInput, setExpenseTypeInput] = useState('');
      const [expenseMonthInput, setExpenseMonthInput] = useState('');
    
      const handleSubmit = () => {
        addCategory(1, categoryInput, expenseNameInput, expenseAmountInput, expenseTypeInput, expenseMonthInput);
        setModalOpen(false);
      };
      const [localCategoryName, setLocalCategoryName] = useState(newCategoryNameFixed);
      const [localCategoryValue, setLocalCategoryValue] = useState(newCategoryValueFixed);
      const fixedCategoryInputRef = useRef(null);
      const fixedValueInputRef = useRef(null);
      const variableCategoryInputRef = useRef(null);
      const variableValueInputRef = useRef(null);
      const [tabDataChangeToken, setTabDataChangeToken] = useState(0);
      const goToNextMonth = () => {
        setActiveMonthIndex_X9aB72(prevIndex => prevIndex + 1);
      }
    
    const goToPreviousMonth = () => {
      setActiveMonthIndex_X9aB72(prevIndex => prevIndex - 1);
      }
    

    
    useEffect(() => {
      console.log("【6】 newCategoryNameFixed", newCategoryNameFixed);

      if (fixedCategoryInputRef.current) {
          fixedCategoryInputRef.current.focus();
      }
      return () => {
          if (fixedCategoryInputRef.current) {
              fixedCategoryInputRef.current.blur();
          }
      };
  }, [newCategoryNameFixed]);
  
  // useEffect(() => {
  //     if (fixedValueInputRef.current) {
  //         fixedValueInputRef.current.focus();
  //     }
  //     return () => {
  //         if (fixedValueInputRef.current) {
  //             fixedValueInputRef.current.blur();
  //         }
  //     };
  // }, [newCategoryValueFixed]);
  
  // useEffect(() => {
  //     if (variableCategoryInputRef.current) {
  //         variableCategoryInputRef.current.focus();
  //     }
  //     return () => {
  //         if (variableCategoryInputRef.current) {
  //             variableCategoryInputRef.current.blur();
  //         }
  //     };
  // }, [newCategoryNameVariable]);
  
  // useEffect(() => {
  //     if (variableValueInputRef.current) {
  //         variableValueInputRef.current.focus();
  //     }
  //     return () => {
  //         if (variableValueInputRef.current) {
  //             variableValueInputRef.current.blur();
  //         }
  //     };
  // }, [newCategoryValueVariable]);
  
    
  return isLoading ? <LoadingSpinner /> : (
            <div>
                    <Tabs className="tabs-container" selectedIndex={2} onSelect={handleMonthChange} forceRenderTabPanel={true}>
            
            {/* The scrollable months */}
            <div className="month-tab-list">
              {months.map((month, index) => {
                  if (!monthRefs.current[index]) {
                      monthRefs.current[index] = React.createRef();
                  }

                  const monthYear = getYearMonth(index);
                  const monthStatusClass = monthStatuses[monthYear] || 'default-status';
                  const isSelected = activeMonthIndex_X9aB72 === index;

                  return (
                      <div 
                          key={index} 
                          className={`month-tab-item ${isSelected ? 'selected' : ''}`} 
                          onClick={() => handleMonthChange(index)}
                          ref={monthRefs.current[index]}
                      >
                          <div className={`tab-content ${monthStatusClass}`}>
                              {month}
                          </div>
                      </div>
                  );
              })}
          </div>



            
            {/* The swipeable content */}
            <SwipeableViews index={activeMonthIndex_X9aB72} onChangeIndex={handleMonthChange} resistance>
                {months.map((month, index) => (
                    <TabPanel 
                        key={index} 
                        className="tab-panel" 
                        changeToken={tabDataChangeToken}
                    >
                        <MemoizedTabContent status={currentMonthStatus} />
                    </TabPanel>
                ))}
            </SwipeableViews>
            <div className="budget-details">
              <button
            className={`submit-button 
                            ${currentMonthStatus === 'closed' ? 'closed' : 
                              currentMonthStatus === 'waiting' ? 'waiting' : 
                              currentMonthStatus === 'expected' ? 'expected' : 
                              currentMonthStatus === 'ongoing' ? 'ongoing' : 
                              'not-closed'}`}
                onClick={() => {
                  if (currentMonthStatus === 'waiting') {
                    approveBudget();
                  } else if (currentMonthStatus === 'ongoing') {
                    setShowTransactionLogger(true);  // Open the modal
                  }
                }}
              >
              {currentMonthStatus === 'closed'
                  ? 'CLOSED'
                  : currentMonthStatus === 'waiting'
                  ? 'I commit myself to my goal 😊'
                  : currentMonthStatus === 'ongoing'
                  ? 'LOG TRANSACTION'
                  : 'Expected'}

              </button>
              {/* <button className="submit-button"onClick={fetchBudgetFeedback}>Get Budget Feedback</button> */}

            </div>
        </Tabs>
            {/* Additional content for logs goes here */}
        </div>
    );
}

export default Budget;
