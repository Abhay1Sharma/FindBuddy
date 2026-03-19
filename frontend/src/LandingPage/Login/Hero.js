import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthjsContext";
import ForgotPassword from "../ForgotPassword/Hero";

function Hero() {

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

      const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";


    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${backendUrl}/login`,
                formData, // Contains username and password
                { withCredentials: true } // CRITICAL: This allows the session cookie to be saved
            );

            localStorage.setItem('token', res.data.token);

            toast.success("Logged in successfully!");

            await fetchUser();
            navigate("/");
        } catch (err) {
            // If the server is sending a 400 because of the DB error we saw, this will tell you:
            const message = err.response?.data?.message || "Invalid Username or Password";
            toast.error(message);
            console.error("Login Error:", err.response?.data);
        } finally {
            setLoading(false);
        }
    };


    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    return (
        <div className="login-body container">
            <div className="row">
                <div className="col-lg-8"></div>
                <div className="login-container col-lg-4">
                    {/* <!-- Left Side - Brand & Features --> */}
                    <div className="brand-section">

                        <div className="features">
                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="feature-content">
                                    <h3>Smart Matching</h3>
                                    <p>Connect with workout partners who share your fitness goals and schedule</p>
                                </div>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="fas fa-calendar-check"></i>
                                </div>
                                <div className="feature-content">
                                    <h3>Workout Planning</h3>
                                    <p>Schedule and track workouts together with your fitness buddy</p>
                                </div>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <div className="feature-content">
                                    <h3>Safe & Verified</h3>
                                    <p>All profiles are gym-verified for secure connections</p>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial">
                            <p className="testimonial-text">
                                "I found my perfect workout partner in just 2 days! We've been training together for 6 months and hitting new PRs every week."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar">SJ</div>
                                <div className="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <p>Member since 2023</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Right Side - Login Form --> */}
                    <div className="login-section">
                        <div className="login-header">
                            <h2>< span style={{ color: "#848080ff" }}>Welcome</span><span style={{ color: "#FF3D00" }}>Back!</span></h2>
                            <p>Sign in to continue your fitness journey</p>
                        </div>

                        <form className="login-form" onSubmit={handleSubmit} method="POST">
                            <div className="form-group">
                                <label for="username" className="form-label">Username</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your username"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label for="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button type="button" className="password-toggle">
                                    </button>
                                </div>
                                <div className="password-strength">
                                    <div className="strength-bar" id="strengthBar"></div>
                                </div>
                            </div>

                            <div className="form-options">
                                <div className="checkbox-group">
                                    <div className="checkbox-input" id="rememberCheckbox" onclick="toggleCheckbox()"></div>
                                    <label for="rememberCheckbox" className="checkbox-label">Remember me</label>
                                </div>
                                <Link className="forgot-link" to={"/forgot-password"} element={<ForgotPassword />}>Forgot Password?</Link>
                            </div>

                            <button type="submit" className="login-button" disabled={loading} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                                {!loading ? <span>Login In <i className="fas fa-arrow-right"></i></span> : <span>Wait!! Check your credentials....</span>}
                            </button>

                            <div className="register-section">
                                Don't have an account? <Link className="nav-link active m-1.5 register-link" to={"/signup"}>Create account</Link >
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;