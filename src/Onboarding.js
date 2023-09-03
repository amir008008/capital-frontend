
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
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
const BASE_URL = 'http://localhost:5000';
//const BASE_URL = "http://capital-route-amir-sh-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com";
const Nushi = process.env.PUBLIC_URL + '/Nushi/onboarding.jpg';
const NushiAnalytical = process.env.PUBLIC_URL + '/Nushi/analytical.png';
const NushiSupportive = process.env.PUBLIC_URL + '/Nushi/supportive.png';


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
    position: 'relative',
    top: 30,  // Position it right at the top
    left: '0%',  // Start from the left
    width: '70%',
    zIndex: 1000,  // Ensure it stays above other elements

    // background: 'linear-gradient(to right, var(--purple-2), var(--purple-3))',  // Gradient from medium to dark purple
    boxShadow: '0 2px 4px rgba(var(--purple-3), 0.5)',  // Less intense shadow with reduced opacity
    borderRadius: '2px',  // Rounded corners
    transition: 'all 0.3s ease',  // Smooth transition effect for any changes
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

function AppInfo({ onNext, setProgress }) {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);

    setProgress(40);

    const handleContinue = () => {
        setProgress(60);
        onNext();
    };
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            margin: '40px auto 0',
            padding: '0 5%',
            maxWidth: '100%',
            textAlign: 'left',
            position: 'relative'
        },
        headingRow: {
            width: '100%',
            textAlign: 'center'
        },
        contentRow: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
        },
        image: {
            flex: '1 0 30%',  // Adjusted to take up only 30% of the width instead of 50%
            maxWidth: '200px',  // Added a maximum width
            height: 'auto',  // Adjusted to maintain aspect ratio
            objectFit: 'cover',
            marginRight: 'auto',  // This will push the image to the left
        },
        
        textWrapper: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            flex: '1 0 50%',
        },
        heading: {
            fontSize: '28px',
            marginBottom: '20px',
        },
        paragraph: {
            fontSize: '16px',
            margin: '20px 0',
            lineHeight: '1.5',
            wordWrap: 'break-word',
            paddingRight: '20px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '18px',
            alignSelf: 'flex-end',
            paddingRight: '20px',
            marginLeft: 'auto', // This moves the button to the left if it's within a flex container
        },
        
    };
    
    return (
        <div style={styles.container}>
        <div style={styles.headingRow}>
            <h1 style={styles.heading}>{t('greeting', { username: user.username })}</h1>
        </div>
        <div style={styles.contentRow}>
            <img src={Nushi} alt="Illustration of a Man" style={styles.image} />
            <div style={styles.textWrapper}>
                <p style={styles.paragraph}>{t('coachIntro')}</p>
                <ul>
                    <li style={styles.paragraph}>{t('bulletPoint1')}</li>
                    <li style={styles.paragraph}>{t('bulletPoint2')}</li>
                    <li style={styles.paragraph}>{t('bulletPoint3')}</li>
                </ul>
            </div>
        </div>
        <div>
            <p style={styles.paragraph}>{t('successNote')}</p>
        </div>
        <Button style={styles.button} onClick={handleContinue}>{t('agree')}</Button>
    </div>
    );
}


function LanguageSelection({ onNext, onLanguageChange }) {
    const { t } = useTranslation();

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',  // changed from height to minHeight to allow content expansion
        justifyContent: 'center',
        padding: '5%',
        overflowY: 'auto'   // Allow vertical scroll if content exceeds the viewport height
    };

    const headingStyle = {
        fontSize: '24px',
        textAlign: 'center',  // center-aligned the heading
        marginTop: '0%',  // Move the heading closer to the top
        marginBottom: '30px'  // Reduced the bottom margin to balance spacing
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
                {/* <Button style={buttonStyle} onClick={() => onLanguageChange('ru')}>
                    🇷🇺 Русский
                </Button> */}
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
        const handleMonthlyIncomeChange = useCallback((income,currency) => {
            // Assume you have userId and other user info, send to server:
            fetch(`${BASE_URL}/preferences/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    monthly_income: income,
                    currency: currency, // Send selected currency
                    // ... other preferences if necessary
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log("Income updated successfully.");
                    //setProgress(90);
                    // setCurrentPage(5);
                    setShowCompletionModal(true);
                } else {
                    console.log("Error updating monthly income.");
                    // Handle error
                }
            })
            .catch(error => {
                console.error("An error occurred:", error); // Log any other unexpected errors
            });
            
        }, []);
        const [currency, setCurrency] = useState('CNY'); // Default to USD

        const containerStyle = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            margin: '40px auto 0',
            padding: '0 5%',
            maxWidth: '100%',
            textAlign: 'left',
            position: 'relative'
        };
        return (
            
            <div style={{ ...containerStyle, marginTop: '30px' }}>

                <h2>{t('tellUsMore')}</h2>
                <label>
                    {t('monthlyIncome')}
                    <input type="text" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="XXXX" />
                </label>
                
                <label>
                    <p>{t('currency')}
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="USD">{t('usDollar')}</option>
                    <option value="EUR">{t('euro')}</option>
                    <option value="GBP">{t('britishPound')}</option>
                    <option value="JPY">{t('japaneseYen')}</option>
                    <option value="AUD">{t('australianDollar')}</option>
                    <option value="CAD">{t('canadianDollar')}</option>
                    <option value="CHF">{t('swissFranc')}</option>
                    <option value="CNY">{t('chineseYuan')}</option>
                    <option value="SEK">{t('swedishKrona')}</option>
                    <option value="NZD">{t('newZealandDollar')}</option>
                    <option value="MXN">{t('mexicanPeso')}</option>
                    <option value="SGD">{t('singaporeDollar')}</option>
                    <option value="HKD">{t('hongKongDollar')}</option>
                    <option value="NOK">{t('norwegianKrone')}</option>
                    <option value="INR">{t('indianRupee')}</option>
                    <option value="ZAR">{t('southAfricanRand')}</option>
                    <option value="BRL">{t('brazilianReal')}</option>
                    <option value="RUB">{t('russianRuble')}</option>
                    <option value="KRW">{t('southKoreanWon')}</option>
                    <option value="PKR">{t('pakistaniRupee')}</option>
                        {/* Add other currencies as needed */}
                    </select>
                    </p>
                </label>

                <Button onClick={() => handleMonthlyIncomeChange(income,currency)}>{t('submit')}</Button>
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
                console.log("Error with coach setting:", data.error); // Log the error message from the server
                // Handle error
            }
        })
        .catch(error => {
            console.error("An error occurred:", error); // Log any other unexpected errors
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
        minHeight: '100vh',
        margin: '40px auto 0',
        padding: '0 5%',
        maxWidth: '100%',
        textAlign: 'left',
        position: 'relative'
    };

    const titleStyle = {
        fontSize: '24px',
        marginBottom: '5px'
    };


    const avatarStyle = {
        fontSize: '40px',
        marginBottom: '5px'
    };
    const arrowButtonStyle = {
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'transparent', // Transparent background
        alignSelf: 'flex-end', // Align arrow to the right side
        marginTop: '10px', // Add margin between the tile content and arrow
        cursor: 'pointer', // Add pointer cursor to indicate interactivity
    };

    const coachTileStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'space-between',
        margin: '5px',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        width: '45%',
        boxSizing: 'border-box',
        height: '240px', // Adjusted height to 240px
    };
const selectButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '18px',                  // Reduced font size for a "smaller" look
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    border: '1px solid #ccc',          // Thinner border to match the tile style
    borderRadius: '8px',
    padding: '8px 16px',               // Adjusted padding to better suit the reduced size
    marginTop: '5px',                 // Reduced margin to make it feel compact
    cursor: 'pointer',
    color: '#555',
    transition: 'all 0.3s',
    ':hover': {
        backgroundColor: '#e6e6e6',   // Slightly darker hover to offer a subtle effect
        borderColor: '#aaa',
        color: '#333',
        transform: 'translateY(-2px)'
    }
};
    
    // Usage
    // Assuming you're using React for example:
    // <button style={selectButtonStyle}>Select \u2192</button>
    

    return (
        <div style={{ ...containerStyle, marginTop: '30px' }}>
            <h1 style={titleStyle}>{t('selectAICoach')}</h1>
            <p>{t('basedOnThis')}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1, 2].map((index) => (
                    <div key={index} style={coachTileStyle}>
                        <img
                            src={index === 1 ? NushiAnalytical : NushiSupportive} // Use different images based on the index
                            alt="Nushi"
                            style={{ width: '100%', height: 'auto', maxHeight: '220px' }}
                            onClick={() => {
                                onAICoachChange(`coach${index}`);
                                onNext();
                            }}
                        />
                        <div>
                            <h3>{t(`coach${index}`)}</h3>
                            <p style={{ width: '110%' }}>{t(`coach${index}Description`)}</p>
                        </div>
                        <button
                            onClick={() => {
                                onAICoachChange(`coach${index}`);
                                onNext();
                            }}
                            style={selectButtonStyle}
                        >
                            {t('select')}
                            <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '5px' }} />
                        </button>
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
        right: '10px',
        bottom: '10px',  // position the button at the bottom-right corner
        background: 'transparent',
        border: 'none',
        color: 'grey'
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
                        top: '60px',
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
             { t('skip')}
            </button>
    
            {showCompletionModal && <CompletionModal onFinish={closeCompletionModal} />}
        </OnboardingContainer>
    );
    
}
export default Onboarding;