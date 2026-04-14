import { useEffect } from 'react';
import { io } from "socket.io-client";
import { toast } from "react-hot-toast"; // Or your preferred toast library

const socket = io("http://localhost:3001");

function App() {
    const userId = "current_logged_in_user_id";

    useEffect(() => {
        if (userId) {
            socket.emit("register_user", userId);

            socket.on("new_notification", (data) => {
                toast.success(`Someone ${data.content}!`);
                // Optional: Update your notification state/badge count here
            });
        }

        return () => socket.off("new_notification");
    }, [userId]);
}