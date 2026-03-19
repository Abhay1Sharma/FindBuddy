import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {

      const dashboardUrl = "https://findbuddy-dash.onrender.com" || "http://localhost:3002";


    const handlelogout = () => {
        localStorage.clear();
        // Redirecting to the logout sync endpoint
        window.location.href = `${dashboardUrl}/logout-sync`;
    };

    return (
        /* Changed 'class' to 'className' */
        <div className="container Container mt-5 mb-5">
            <div className="sessionCard">
                <div className="icon-box">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2"        
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                        />
                    </svg>
                </div>

                <h1 className="h1">Session Active</h1>
                <p className='p'>You are currently logged in. Please logout from your current session to access the login page or switch to a different account.</p>

                <div className="button-group">
                    {/* Added to="" to the Link and className fixes */}
                    <Link to="#" onClick={handlelogout} className="btn btn-primary">Logout Now</Link>
                    <Link to="/" className="btn btn-outline">Go back</Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;