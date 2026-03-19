import { useEffect } from "react";

const LogoutSync = () => {
    useEffect(() => {
        localStorage.clear(); // Clears Port 3000
        window.location.href = "/login"; // Stays on 3000
    }, []);

    return <div>Syncing logout...</div>;
};

export default LogoutSync;