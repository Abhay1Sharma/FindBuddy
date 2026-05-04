import React, { useState } from 'react';
import axios from 'axios';

const backendUrl = "https://findbuddy-back.onrender.com";

function Hero() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle');

    const handleRequest = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await axios.post(`${backendUrl}/api/forgot-password`, { email });
            if (res.status === 200) setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    // --- Dynamic Styles ---
    const containerStyle = {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '85vh', fontFamily: "'Segoe UI', Roboto, sans-serif"
    };

    const cardStyle = {
        width: '100%', maxWidth: '400px', padding: "65px 40px 40px 40px", height: "31rem",
        borderRadius: '16px', backgroundColor: '#263238',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', textAlign: 'center'
    };

    const inputStyle = {
        width: '100%', padding: '12px 15px', margin: '20px 0',
        borderRadius: '8px', border: '1px solid #e0e0e0',
        fontSize: '16px', boxSizing: 'border-box', outline: 'none'
    };

    const btnStyle = {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: 'none', backgroundColor: '#FF3D00', color: 'white',
        fontWeight: '600', fontSize: '16px', cursor: 'pointer',
        transition: 'background 0.3s ease',
        opacity: status === 'loading' ? 0.7 : 1
    };

    if (status === 'success') {
        return (
            <div class="containerr">
                <div class="cardd">
                    <div class="iconn">✅</div>
                    <h2 class="titlee">Check your email</h2>
                    <p class="textt">
                        We've sent a password reset link to <br />
                        <strong class="email-highlightt">{email}</strong>
                    </p>
                    <a href="/login" class="btnn">
                        Back to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ marginBottom: '10px', color: '#1a1a1a' }}><span style={{ color: "#ffffff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></h2>
                <p style={{ color: '#666', fontSize: '14px' }}>Forgot your password? No worries. Enter your email and we'll send you a link.</p>

                <form onSubmit={handleRequest}>
                    <input
                        type="email"
                        placeholder="name@example.com"
                        required
                        style={inputStyle}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" disabled={status === 'loading'} style={btnStyle}>
                        {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                {status === 'error' && (
                    <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '15px' }}>
                        ⚠️ Unable to find that email. Please try again.
                    </p>
                )}

                <div style={{ marginTop: '25px', fontSize: '14px' }}>
                    <a href="/login" style={{ color: '#FF3D00', textDecoration: 'none' }}>Back to Login</a>
                </div>
            </div>
        </div>
    );
}

export default Hero;