
import { useTranslation } from 'react-i18next';
import { Circle, Line } from 'rc-progress';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';
import AuthContext from './components/Account/AuthContext';  // Update this to the actual path
import React, { useContext, useState, useEffect,useRef,useCallback } from 'react';
import UserPreferencesContext from '../src/components/Account/UserPreferencesContext';
import i18n from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

//const BASE_URL = 'http://localhost:5000';
const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";


export const OnboardingContainer = styled.div`
    font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const Button = styled.button`
  background-color: #820ad1;
  font-family: 'Gelix', sans-serif;  // Here we're using the custom font, and providing a fallback of sans-serif.
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4c0677;
  }
`;

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0e6fa 0%, #d8e9f3 100%)',
    paddingTop: '35px'  // Adjust this based on the height of your progress bar + some padding
};

const lineStyle = {
    position: 'fixed',
    top: 50,  // Position it right at the top
    left: '15%',  // Assuming you want it to start 15% from the left to achieve 70% width
    width: '70%',
    zIndex: 1000  // Ensure it stays above other elements
};
const buttonStyle = {
    margin: '10px',
    border: '1px solid #d0d0d0',
    borderRadius: '5px'
};


const skipButtonStyle = {
    position: 'absolute',
    bottom: '5vh',
    background: 'transparent',
    border: '1px solid grey',
    borderRadius: '15px',
    color: 'grey',
    padding: '10px',
    cursor: 'pointer'
};
import { useNavigate } from 'react-router-dom';  // Replace useHistory with useNavigate

function CompletionModal({ onFinish, onNext, onAICoachChange, setProgress, progress }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (progress < 100) {
            setProgress(prevProgress => Math.min(prevProgress + 20, 100));
        }
    }, [setProgress, progress]);

    const { t } = useTranslation();

    const navigateToLogs = () => {
        navigate('/logs');
    };

    return (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            {/* <img src="path_to_avatar_image.jpg" alt="Avatar" /> */}
            <h2>{t('allDone')}</h2>
            {/* <Button onClick={onFinish}>{t('finishOnboarding')}</Button> */}
            <Button onClick={navigateToLogs}>{t('finishOnboarding')}</Button> {/* Add this button */}
        </div>
    );
}



function AppInfo({ onNext, setProgress, progress }) {
    const { t } = useTranslation();
    setProgress(40); 

    // Uncomment this if you want the progress to update on component mount
    // useEffect(() => {
    //     setProgress(Math.min(progress + 25, 100));
    // }, []);
  
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', // Take the full viewport height
        margin: '0 auto', // Center the container horizontally
        padding: '0 5%', // 5% padding on the left and right
        maxWidth: '800px', // Set a maximum width
        textAlign: 'center', // Center the text
    };

    const headingStyle = {
        fontSize: '28px',
        marginBottom: '20px'
    };

    const paragraphStyle = {
        fontSize: '16px',
        margin: '20px 0',
        lineHeight: '1.5' // Improve readability by increasing line height
    };

    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '18px',
    };

    const handleContinue = () => {
        setProgress(60); // Update the progress to 60
        onNext(); // Call the onNext function to proceed to the next step
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>{t('appInfo')}</h1>
            <p style={paragraphStyle}>{t('appDescription')}</p>
            <Button style={buttonStyle} onClick={handleContinue}>{t('continue')}</Button>
        </div>
    );
}

function LanguageSelection({ onNext, onLanguageChange }) {
    const { t } = useTranslation();
    const [transformValue, setTransformValue] = useState('100vh');

    useEffect(() => {
        setTransformValue('0');
    }, []);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        justifyContent: 'center',
        padding: '5%',
        overflow: 'hidden',
        transition: 'transform 0.7s ease-in-out',
        transform: `translateY(${transformValue})`
    };

    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    
    const headingStyle = {
        fontSize: '24px',
        textAlign: 'top',
        marginTop: '0%',   // Move the heading closer to the top
        marginBottom: '50px'  // Slightly reduce the bottom margin to balance spacing
    };

    const buttonContainer = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    };

    const buttonStyle = {
        margin: '10px',
        padding: '15px 30px',
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '250px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>{t('Choose your language')}</h1>
            <div style={buttonContainer}>
                <Button style={buttonStyle} onClick={() => onLanguageChange('en-US')}>
                    🇺🇸 English
                </Button>
                <Button style={buttonStyle} onClick={() => onLanguageChange('es-ES')}>
                    🇪🇸 Español
                </Button>
                <Button style={buttonStyle} onClick={() => onLanguageChange('zh-CN')}>
                    🇨🇳 中文
                </Button>
                <Button style={buttonStyle} onClick={() => onLanguageChange('ar')}>
                    🇸🇦 العربية
                </Button>
                <Button style={buttonStyle} onClick={() => onLanguageChange('ru')}>
                    🇷🇺 Русский
                </Button>
            </div>
        </div>
    );
}



function Onboarding() {  
    function ProfileSetup({ onNext }) {
        const [showCompletionModal, setShowCompletionModal] = useState(false);
    
        const [currentPage, setCurrentPage] = useState(1); // Up to 5 pages now    const { user } = useContext(AuthContext);
    
        const { t } = useTranslation();
        const { user } = useContext(AuthContext); 
    
        const [income, setIncome] = useState('');
        const handleMonthlyIncomeChange = useCallback((income) => {
            // Assume you have userId and other user info, send to server:
            fetch(`${BASE_URL}/preferences/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    monthly_income: income,
                    // ... other preferences if necessary
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Income updated successfully.")
                     //setProgress(90);
                    // setCurrentPage(5);
                    setShowCompletionModal(true);
    
                } else {
                    console.log("Error updating monthly income.")
                    // Handle error
                }
            });
        }, []);
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>{t('tellUsMore')}</h2>
                <label>
                    {t('monthlyIncome')}
                    <input type="text" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="XXXX" />
                </label>
                <Button onClick={() => handleMonthlyIncomeChange(income)}>{t('submit')}</Button>
    
                {showCompletionModal && <CompletionModal onFinish={() => setShowCompletionModal(false)} />}
            </div>
        );
    }
    
function AICoachSelection({ onNext, setProgress, progress }) {
    const [currentPage, setCurrentPage] = useState(1); // Up to 5 pages now    const { user } = useContext(AuthContext);


        const handleAICoachChange = useCallback((coach) => {
        setProgress(60); // End of onboarding

        // Assume you have userId and other user info, send to server:
        fetch(`${BASE_URL}/preferences/${user.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ai_coach: coach,
                // ... other preferences if necessary
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                console.log("Handle success - e.g. go to next onboarding step")

                // Handle success - e.g. go to next onboarding step
                setProgress(80); 
                
            } else {
                console.log("Error with coach setting")
                // Handle error
            }
        });
    }, []);
    const onAICoachChange = (coachName) => {
        handleAICoachChange(coachName);
        console.log(`Selected AI coach: ${coachName}`);
        // setShowCompletionModal(true);
        setCurrentPage(4)

    };
    const { user } = useContext(AuthContext); 

    const { t } = useTranslation();

    // useEffect(() => {
    //     if (progress < 100) {
    //         setProgress(prevProgress => Math.min(prevProgress + 20, 100));
    //     }
    // }, [progress]);

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', 
        padding: '10px 5%',
        height: 'calc(100vh - 150px)', // account for the header
        overflowY: 'auto' // enable vertical scrolling
    };

    const titleStyle = {
        fontSize: '24px',
        marginBottom: '20px'
    };

    const coachTileStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '90%', // nearly full width for mobiles
        boxSizing: 'border-box'
    };

    const avatarStyle = {
        fontSize: '40px',
        marginBottom: '5px'
    };

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>{t('selectAICoach')}</h1>
            
            <div>
                {/* {[1, 2, 3, 4].map((index) => ( */}
                {[1, 2, ].map((index) => (
                    <div key={index} style={coachTileStyle}>
                        <div style={avatarStyle}>🤖</div>
                        <Button 
                            onClick={() => { 
                                onAICoachChange(`coach${index}`);
                                onNext(); // Move to the next page
                            }}
                        >
                            {t(`coach${index}`)}
                        </Button>
                        <p>{t(`coach${index}Description`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}



    const handleLanguageChange = useCallback((language) => {
        
        i18n.changeLanguage(language);
        // Assume you have userId and other preferences info, send to server:
        fetch(`${BASE_URL}/preferences/${user.id}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            locale: language,
            // ... other preferences
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
            setProgress(100/5); // End of onboarding
            setCurrentPage(2)
            }
        });
    }, [ ]);
    const fetchedRef = useRef(false);  // Use this ref to track if data has been fetched
    const [showCompletionModal, setShowCompletionModal] = useState(false);

    // Close the completion modal
    const closeCompletionModal = () => {
        setShowCompletionModal(false);
        setCurrentPage(4);  // Assuming you have another step after coach selection
    };

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { preferences, setPreferences } = useContext(UserPreferencesContext);
    const [formPreferences, setFormPreferences] = useState(preferences);

    const { user } = useContext(AuthContext); 
    useEffect(() => {
        // If there's no user or data has been fetched, don't fetch again
        if (!user || fetchedRef.current) {
            return;
        }
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
                    fetchedRef.current = true;  // Mark data as fetched
                    
                    // Perform deep comparison before setting data
                    // This is a basic comparison, consider using lodash's isEqual for deep comparison
                    if (JSON.stringify(data.data) !== JSON.stringify(preferences)) {
                        setPreferences(data.data);
                        setFormPreferences(data.data);
                        
                        if (data.data.language) {
                            i18n.changeLanguage(data.data.language);
                        }
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
    const [currentPage, setCurrentPage] = useState(1); // Up to 5 pages now    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [progress, setProgress] = useState(20);
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (currentPage < 3) {
                setCurrentPage(currentPage + 1);
                setProgress(Math.min(progress + 20, 100));
            }
        },
        onSwipedRight: () => {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                setProgress(Math.max(progress - 20, 0));
            }
        }
    });
    
    
    if (!user) {
    return null;
    }


    const userId = user.id;

    const goBack = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setProgress(Math.max(progress - 20, 0));
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0e6fa 0%, #d8e9f3 100%)' // Softer gradient background
    };
    
    const progressBarContainerStyle = {
        width: '100%',
        height: '30vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };
    
    const buttonStyle = {
        margin: '10px',
        border: '1px solid #d0d0d0',
        borderRadius: '5px'
    };
    
    const skipButtonStyle = {
        position: 'absolute',
        bottom: '5vh',
        right: '5vw',
        background: 'transparent',
        border: '1px solid grey',
        borderRadius: '15px',
        color: 'grey',
        padding: '15px 40px', // Increase right and left padding to make it wider
        cursor: 'pointer',
        minWidth: '150px' // Setting a minimum width will also ensure it's wider
    };
    


    return (
        <OnboardingContainer {...handlers} style={containerStyle}>
            <div style={lineStyle}>
                <Line percent={progress} strokeWidth="2" strokeColor="#bd0fea" />

            </div>
    
            {currentPage > 1 && (
                <button
                    onClick={goBack}
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '80px',
                        background: 'transparent',
                        border: 'none',
                        color: 'grey'
                    }}>
                    <FontAwesomeIcon icon={faArrowLeft} size="lg" />
                </button>
            )}
    
            {currentPage === 1 && (
                <LanguageSelection 
                    onNext={() => setCurrentPage(2)} 
                    onLanguageChange={handleLanguageChange} 
                />
            )}
    
            {currentPage === 2 && (
                <AppInfo 
                    onNext={() => setCurrentPage(3)} 
                    setProgress={setProgress} 
                    progress={progress}
                />
            )}
    
            {currentPage === 3 && (
                <AICoachSelection 
                    onNext={() => setCurrentPage(4)} 
                    setProgress={setProgress} 
                    progress={progress}
                />
            )}
    
            {currentPage === 4 && (
                <ProfileSetup onNext={() => setCurrentPage(5)} 
                    setProgress={setProgress} 
                    progress={progress}
                />
            )}
    
            <button style={skipButtonStyle} onClick={() => {
                if (currentPage < 5) {
                    setCurrentPage(currentPage + 1);
                    setProgress(Math.min(progress + 20, 100));
                }
            }}>
             { t('next')}
            </button>
    
            {showCompletionModal && <CompletionModal onFinish={closeCompletionModal} />}
        </OnboardingContainer>
    );
    
}
export default Onboarding;