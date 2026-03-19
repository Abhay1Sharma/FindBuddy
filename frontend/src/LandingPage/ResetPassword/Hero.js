import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";

    const navigate = useNavigate();
    const token = searchParams.get('token');

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match!");
        }

        setLoading(true);
        try {
            await axios.post(`${backendUrl}/api/reset-password`, {
                token,
                newPassword
            });
            toast.success("Password changed successfully!");
            navigate('/login');
        } catch (err) {
            toast.error("Link expired or invalid. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // --- Modern Styles ---
    const containerStyle = {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '80vh', fontFamily: "'Segoe UI', Roboto, sans-serif",
        backgroundColor: '#f9f9fb'
    };

    const cardStyle = {
        width: '100%', maxWidth: '400px', padding: '40px',
        borderRadius: '16px', backgroundColor: '#fff',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center'
    };

    const inputStyle = {
        width: '100%', padding: '12px 15px', margin: '10px 0',
        borderRadius: '8px', border: '1px solid #e0e0e0',
        fontSize: '16px', boxSizing: 'border-box', outline: 'none'
    };

    const btnStyle = {
        width: '100%', padding: '12px', borderRadius: '8px',
        border: 'none', backgroundColor: '#ff3d00', color: 'white',
        fontWeight: '600', fontSize: '16px', cursor: 'pointer',
        marginTop: '15px', transition: 'background 0.3s ease',
        opacity: loading ? 0.7 : 1
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔐</div>
                <h2 style={{ marginBottom: '10px', color: '#1a1a1a' }}>New Password</h2>
                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                    Almost there! Enter a strong new password for your FindBuddy account.
                </p>

                <form onSubmit={handleUpdate}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <button type="submit" disabled={loading} style={btnStyle}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', fontSize: '14px' }}>
                    <p style={{ color: '#999' }}>
                        Remembered your password? <a href="/login" style={{ color: '#ff3d00', textDecoration: 'none' }}>Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;