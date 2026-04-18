import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import socket from "../socket";
import ChatBox from "../ChatBox";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Hero() {
    const { id: recipientId } = useParams(); // Destructure for cleaner code
    console.log(useParams());
    const [ready, setReady] = useState(false);
    const [userData, setUserData] = useState(null); // Initialize as null to check status
    const [activeChat, setActiveChat] = useState(null);
    console.log(recipientId);

    const backendUrl = "https://findbuddy-back.onrender.com";

    const fetchUser = async () => {
        try {
            const profile = await axios.post(`${backendUrl}/user`, { id: recipientId });
            console.log(profile);
            setUserData(profile.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } []
    };

    // Triggered only when userData is successfully fetched
    const handleConnect = () => {
        const token = localStorage.token;
        const jwtToken = jwtDecode(token);
        const myId = jwtToken._id || jwtToken.id;
        console.log("Client Id : ", recipientId);
        console.log("token : ", myId);
        const roomId = [myId, recipientId].sort().join("_");

        socket.emit("join_private_chat", { roomId });

        setActiveChat({
            roomId,
            recipientName: userData.username,
            recipientId: recipientId
        });

        setReady(true);
    };

    useEffect(() => { fetchUser(); }, [recipientId]);

    // This effect acts as a "listener" for when the data is ready
    useEffect(() => {
        if (userData && userData._id) {
            handleConnect();
        }
    }, [userData]);

    if (!ready) {
        return (
            <div className='root'>
                <div className="loaderContent">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {activeChat && (
                <div className="chatContainer" style={{
                    width: '100%',
                    margin: '0 auto',   // Centers it
                    display: 'flex',
                    flexDirection: 'column',
                    height: '90vh',    // Takes up most of the screen height
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div className="chat-header" style={{
                        background: '#FF3D00',
                        color: 'white',
                        padding: '12px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexShrink: 0 // Keeps header from squishing
                    }}>
                        <span style={{ fontWeight: 'bold' }}>Chat: {activeChat.recipientName}</span>
                    </div>
                    <ChatBox socket={socket} roomId={activeChat.roomId} myId={userData._id} />
                </div>
            )}
        </>
    );
}

export default Hero;