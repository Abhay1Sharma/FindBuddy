import React from "react";
import "./index.css";
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./LandingPage/Navbar/Navbar";
import Homepage from "./LandingPage/Home/Homepage";
import Statstics from "./LandingPage/Statstics/Statstics";
import Footer from "./LandingPage/Footer/Footer";
import Membership from "./LandingPage/Membership/Membership";
import Features from "./LandingPage/Features/Features";
import Trainers from "./LandingPage/Trainers/Trainers";
import Contact from "./LandingPage/Contact/Contact";
import SignUp from "./LandingPage/SignUp/SignUp";
import { GoogleOAuthProvider } from '@react-oauth/google';
import NotFound from "./LandingPage/NotFound/NotFound";
import LoginPage from "./LandingPage/Login/LoginPage";
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from "./AuthjsContext";
import VerifyEmail from './LandingPage/VerifyEmail/VerifyEmail';
import ForgotPassword from './LandingPage/ForgotPassword/ForgotPassword';
import ResetPassword from './LandingPage/ResetPassword/ResetPassword';
import LogoutSync from "./LandingPage/LogOutSync/LogoutSync";
import OnLogin from "./LandingPage/OnLogin/OnLogin"

const clientId = process.env.REACT_APP_CLIENTID;
const root = ReactDOM.createRoot(document.getElementById('root'));
const token = localStorage.token;
console.log(token);

function App() {

    // if (token) {
    //     return (
    //         <BrowserRouter>
    //             <AuthProvider>
    //              <GoogleOAuthProvider clientId={clientId}>
    //                     <div className="page-wrapper">
    //                         <Navbar />
    //                         <div className="content">
    //                             <Routes>
    //                                 <Route path="/" element={<Homepage />} />
    //                                 <Route path="/statstics" element={<Statstics />} />
    //                                 <Route path="/membership" element={<Membership />} />
    //                                 <Route path="/feature" element={<Features />} />
    //                                 <Route path="/trainers" element={<Trainers />} />
    //                                 <Route path="/contact" element={<Contact />} />
    //                                 <Route path="/login" element={<OnLogin />} />
    //                                 <Route path="/signup" element={<OnLogin />} />
    //                                 <Route path="/verify-email" element={<VerifyEmail />} />
    //                                 <Route path="/forgot-password" element={<ForgotPassword />} />
    //                                 <Route path="/reset-password" element={<ResetPassword />} />
    //                                 <Route path="/logout-sync" element={<LogoutSync />} />
    //                                 <Route path="*" element={<NotFound />} />
    //                             </Routes>
    //                         </div>
    //                         <Footer />
    //                     </div>
    //                 </GoogleOAuthProvider>
    //             </AuthProvider>
    //             <ToastContainer />
    //         </ BrowserRouter>
    //     );
    // }

    return (
        <BrowserRouter>
            <AuthProvider>
                <GoogleOAuthProvider clientId={clientId}>
                    <div className="page-wrapper">
                        <Navbar />
                        <div className="content">
                            <Routes>
                                <Route path="/" element={<Homepage />} />
                                <Route path="/statstics" element={<Statstics />} />
                                <Route path="/membership" element={<Membership />} />
                                <Route path="/feature" element={<Features />} />
                                <Route path="/trainers" element={<Trainers />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/verify-email" element={<VerifyEmail />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password" element={<ResetPassword />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/logout-sync" element={<LogoutSync />} />
                                <Route path="*" element={<NotFound />}></Route>
                            </Routes>
                        </div>
                        <Footer />
                    </div>
                </GoogleOAuthProvider>
            </AuthProvider>
            <ToastContainer />
        </ BrowserRouter>
    );
}

root.render(
    <App />
);