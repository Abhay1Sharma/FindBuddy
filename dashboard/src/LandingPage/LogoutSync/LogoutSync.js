// src/components/LogoutSync.js
import { useEffect } from "react";

const LogoutSync = () => {
    useEffect(() => {
        localStorage.clear(); // Clears Port 3002
        // Redirect back to the main portal login
        window.location.href = "http://localhost:3000/login"; 
    }, []);

    return <div>Syncing logout...</div>;
};

export default LogoutSync;