import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const backendUrl = "https://findbuddy-back.onrender.com";

function Hero() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', or 'error'
    const [message, setMessage] = useState('Please wait while we verify your email...');
    const navigate = useNavigate();


    useEffect(() => {
        const verifyToken = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('No token found in the link.');
                console.log("No token Found");
                return;
            }

            try {
                // Calling your backend on Port 3001
                const response = await fetch(`${backendUrl}/api/verify-email?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                    // Redirect to login after 3 seconds
                    setTimeout(() => navigate('/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('Server error. Please try again later.');
            }
        };

        verifyToken();
    }, [searchParams, navigate]);

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f4f7f6',
            fontFamily: '"Segoe UI", Roboto, sans-serif'
        },
        card: {
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%'
        },
        icon: {
            fontSize: '50px',
            marginBottom: '20px',
            display: 'block'
        },
        button: {
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
            transition: 'background 0.3s'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Visual Feedback Icons */}
                {status === 'verifying' && <span style={styles.icon}>⏳</span>}
                {status === 'success' && <span style={{ ...styles.icon, color: '#28a745' }}>✅</span>}
                {status === 'error' && <span style={{ ...styles.icon, color: '#dc3545' }}>❌</span>}

                <h2 style={{ marginBottom: '10px', color: '#333' }}>
                    {status === 'verifying' ? 'Verifying...' : status === 'success' ? 'Success!' : 'Oops!'}
                </h2>

                <p style={{ color: '#666', lineHeight: '1.5' }}>{message}</p>

                {status === 'success' && (
                    <div style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>
                        Redirecting you to login...
                    </div>
                )}

                {status === 'error' && (
                    <button
                        style={styles.button}
                        onClick={() => navigate('/signup')}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        Return to Signup
                    </button>
                )}
            </div>
        </div>
    );
};

export default Hero;