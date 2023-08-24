import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './About.css';  // Assuming you'll be storing CSS in a separate file called About.css


const Report = () => {
    const [inProp, setInProp] = useState(false);

    useEffect(() => {
        setInProp(true);
    }, []);
    const containerStyle = {
        maxWidth: '600px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0px 0px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    };

    const headerStyle = {
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
        marginBottom: '20px'
    };

    const contactStyle = {
        background: '#f7f7f7',
        padding: '10px',
        borderRadius: '5px',
        marginTop: '10px'
    };

    return (
        <CSSTransition in={inProp} timeout={1000} classNames="slide-up" appear>
        <div  className="container"style={containerStyle}>
            <header style={headerStyle}>
                <h1>Welcome to Capital App</h1>
                <p>By Mario & Amir</p>
            </header>

            <section>
                <p>At Capital App, our mission is to empower you to elevate your net worth, step by step.</p>
                <p>As we continuously strive for excellence, note that this is an early version of our platform. We&apos;re dedicated to bringing you enhanced solutions every time.</p>
            </section>

            <section style={contactStyle}>
                <p><strong>Reach out for any comments or queries:</strong></p>
                <ul>
                    <li>Email: <a href="mailto:Mariosalazarc27@gmail.com">Mariosalazarc27@gmail.com</a></li>
                    <li>WeChat: mariosalazarc</li>
                    <li>WhatsApp: <a href="tel:+8618458334427">+8618458334427</a></li>
                </ul>
            </section>
        </div>
        </CSSTransition>
    );
}

export default Report;
