import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Login from "../Login/Hero.js";
import axios from "axios";
import { useAuth } from '../../AuthjsContext.js';

const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";

function Hero() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [checkbtn, setCheckbtn] = useState(false);
    const [count, setCount] = useState(() => {
        const savedData = localStorage.getItem('actionLimit');

        if (!savedData) return 1;

        const { value, expiry } = JSON.parse(savedData);

        // Check if the current time is past the expiry time
        if (Date.now() > expiry) {
            localStorage.removeItem('actionLimit'); // Clean up
            return 0;
        }
        return value;
    });


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${backendUrl}/signup`, formData, {
                withCredentials: true
            });

            // 200 or 201 are standard success codes
            if (response.status === 200 || response.status === 201 || response.status === 202) {
                toast.success("User Created! Please verify your email.");
                setCheckbtn(true); // Switch to 'Resend' button
            }

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                toast.success("Signup Successful!");
                navigate("/"); // Usually you navigate to home if they get a token immediately
            }
        } catch (err) {
            // Detailed logging helps you fix the 400 error
            const errorMessage = err.response?.data?.message || "Something went wrong on the server";
            toast.error(errorMessage);
            console.log("Axios Error Details:", err.response?.data);
        } finally {
            setLoading(false);
        }
    }

    const resendEmail = async (e) => {
        e.preventDefault();
        if (count >= 3) return toast.error("Limit reached for this hour!");

        setLoading(true); // Always set loading during requests
        try {
            // Fix: Send email as an object { email: "..." }
            await axios.post(`${backendUrl}/api/resend-verification`, { email: formData.email });

            const newCount = count + 1;
            setCount(newCount);

            const dataToSave = {
                value: newCount,
                expiry: Date.now() + (1 * 60 * 60 * 1000) // 1 hour
            };
            localStorage.setItem('actionLimit', JSON.stringify(dataToSave));

            toast.success("New email sent! Check your inbox.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to resend");
        } finally {
            setLoading(false);
        }
    }


    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Send the Google JWT to your backend
            const res = await axios.post(`${backendUrl}/api/google-login`, {
                token: credentialResponse.credential,
            });

            // Use the login function from AuthContext
            // res.data should contain { token, user: { name, email, picture ... } }
            login(res.data.token, res.data.user);

            toast.success("Welcome " + res.data.user.username);
            navigate("/");
        } catch (err) {
            toast.error("Google Authentication Failed");
            console.error(err);
        }
    };

    const navigate = useNavigate();
    const { login } = useAuth();
    // const { setUser } = useAuth();

    return (
        <div className="container">
            <div className="row text-center">
                <div className="col-lg-4 col-md-3"></div>
                <div className="col-lg-6 col-md-8 my-5 text-center" style={{ border: "4px solid white", borderRadius: "8px", height: "70vh", width: "58vh", boxShadow: "5px 5px 10px gray", padding: "1rem" }}>
                    <form onSubmit={handleSubmit} method='POST'>
                        <div className='row' style={{ display: "flex", justifyContent: "center" }}>
                            <h4 className='fs-2'>Sign up</h4>
                            <div className="col-lg-12 mb-3">
                                <TextField onChange={handleChange} id='username' name="username" type="text" label="Name" variant='outlined' style={{ width: "75%" }} required />
                            </div>

                            <div className="mb-3">
                                <TextField onChange={handleChange} id='email' name="email" type="email" label="Email" variant='outlined' style={{ width: "75%" }} required />
                            </div>

                            <div className="mb-3">
                                <TextField onChange={handleChange} id='password' name="password" type="password" label="Password" variant='outlined' style={{ width: "75%" }} required />
                            </div>
                            {!checkbtn ? <button style={{ width: "40vh", margin: "0 auto", marginBottom: "8px", borderRadius: "4px", backgroundColor: "#FF3D00", border: "none", color: "white", fontSize: "1.2rem", fontWeight: "400", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.8 : 1 }} disabled={loading} > {loading ? "Alomost there..." : "Sign up"} </button>
                                : <button onClick={resendEmail} style={{ width: "40vh", margin: "0 auto", marginBottom: "8px", borderRadius: "4px", backgroundColor: "#0056b3", border: "none", color: "white", fontSize: "1.2rem", fontWeight: "400" }}> Send Email again ({count})</button>}
                            <p style={{ fontSize: "0.7rem", color: "gray" }}>Already have an account? <Link to={"/login"} element={<Login />} style={{ textDecoration: 'none', color: "#FF3D00" }}>Log in</Link></p>

                            <div className='col-lg-10' style={{ alignContent: "center" }}>
                                <h6 className='text-muted'>or</h6>
                                <div className='' style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => toast.error("Login Failed")}
                                        useOneTap
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-lg-3"></div>
            </div >
        </div >
    );
}

export default Hero;