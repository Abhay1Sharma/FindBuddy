import { io } from "socket.io-client";

const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";

const socket = io(`${backendUrl}`, {
    withCredentials: true,
    autoConnect: true
});

export default socket;