// src/components/LogoutSync.js
import { useEffect } from "react";

const frontendUrl = "https://findbuddy-lsdc.onrender.com";
const LogoutSync = () => {
    useEffect(() => {
        localStorage.clear(); // Clears Port 3002
        // Redirect back to the main portal login
        window.location.href = `${frontendUrl}`; 
    }, []);

    return <div>Syncing logout...</div>;
};

export default LogoutSync;