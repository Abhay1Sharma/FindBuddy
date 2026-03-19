import react, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import socket from "../socket";
import ChatBox from "../ChatBox";

const backendUrl = "https://findbuddy-back.onrender.com" || "http://localhost:3001";

// 1. Add Styles for the floating overlay
const chatOverlayStyles = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '320px',
    backgroundColor: 'white',
    boxShadow: '0px 10px 25px rgba(0,0,0,0.2)',
    borderRadius: '12px',
    zIndex: 9999,
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
};

function Hero({ search }) {
    const [allUserData, setAllUserData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [ready, setReady] = useState(false);
    const [activeChat, setActiveChat] = useState(null);

    const handleConnect = (recipient) => {
        // Build Room ID
        const myId = userData.formId;
        const recipientId = recipient._id;
        const roomId = [myId, recipientId].sort().join("_");

        // Join Socket Room
        socket.emit("join_private_chat", { roomId });

        // Open Overlay
        setActiveChat({
            roomId,
            recipientName: recipient.name,
            recipientId: recipientId
        });
    };

    const fetchUser = async () => {
        const token = localStorage.token;
        if (!token) return;
        const jwtDecodeToken = jwtDecode(token);

        try {
            const res = await axios.get(`${backendUrl}/allFormData`);
            const user = await axios.get(`${backendUrl}/user/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserData(user.data);
            setAllUserData(res.data);
        } catch (err) {
            console.log("Fetch Error:", err);
        }
        setReady(true);
    };

    useEffect(() => { fetchUser() }, []);

    if (!ready) {
        return (
            <div className='root'>
                <div className="loaderContent">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    const filteredUsers = allUserData.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.city?.toString().toLowerCase().includes(query) ||
            item.state?.toString().toLowerCase().includes(query) ||
            item.gymname?.toString().toLowerCase().includes(query) ||
            item.goal?.toString().toLowerCase().includes(query)
        );
    });

    return (
        <>
            {/* 2. User Card List */}
            {filteredUsers.filter((items) => items._id !== userData.formId).map((items) => (
                <div className="card mb-4" key={items._id}>
                    <div className="profile">
                        <div className="profile-pic">
                            <img src={items.profilePicture} alt={items.name} />
                        </div>
                        <div className="userBio">
                            <h4 style={{ fontWeight: 700 }}>{items.name}</h4>
                            <small style={{ color: "#64748b" }}>Passionate about fitness and peak potential.</small>
                        </div>
                    </div>

                    <div className="gym-info-bar">
                        <div className="gym-tag">
                            <i className="fas fa-dumbbell" style={{ marginRight: '8px', color: "#FF3D00" }}></i>
                            <span>{items.gymname}</span>
                        </div>
                        <div className="availability-dot">
                            <span className="dot"></span> Active Now
                        </div>
                    </div>

                    <div className="allGoal">
                        <div className="goal"><i class="fa-duotone fa-solid fa-chart-line"></i><small>{items.fitnessLevel}</small></div>
                        <div className="goal"><i class="fa-solid fa-bullseye"></i><small>{items.goal}</small></div>
                        <div className="goal"><i class="fa-solid fa-person"></i><small>{items.typeOfBuddy}</small></div>
                        <div className="goal"><i class="fa-solid fa-clock"></i><small>{items.shifts}</small></div>
                    </div>

                    <div className="location">
                        <div className="locationName"><i className="fas fa-map-marker-alt"></i> {items.city}, {items.state}</div>
                    </div>

                    <Button className="connectNow-btn" onClick={() => handleConnect(items)}>
                        Connect Now
                    </Button>
                </div>
            ))}

            {/* 3. Floating Private Chat Overlay (Doesn't hide the list) */}
            {activeChat && (
                <div className="chat-overlay" style={chatOverlayStyles}>
                    <div className="chat-header" style={{ background: '#FF3D00', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold' }}>Chat: {activeChat.recipientName}</span>
                        <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }} onClick={() => setActiveChat(null)}>×</button>
                    </div>

                    <ChatBox
                        socket={socket}
                        roomId={activeChat.roomId}
                        myId={userData.formId}
                    />
                </div>
            )}
        </>
    );
};

export default Hero;