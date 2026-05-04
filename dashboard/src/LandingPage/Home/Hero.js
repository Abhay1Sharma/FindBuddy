import react, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import socket from "../socket";
import ChatBox from "../ChatBox";
import { Link } from "react-router-dom";

const backendUrl = "https://findbuddy-back.onrender.com";

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
    console.log(allUserData);
    const token = jwtDecode(localStorage.token);
    const userid = token.id;

    const handleConnect = (recipient) => {
        const myId = userData.formId;
        const recipientId = recipient._id;
        // Build Room ID
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

    const giveNotification = async (userId, ownerid) => {
        try {
            console.log(userId, ownerid);
            const data = {
                senderId: userId,
                ownerId: ownerid,
            }
            const sendIds = await axios.post(`${backendUrl}/messageIds`, data);
            console.log(sendIds)
        } catch (error) {
            console.log(error);
        }
    }

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
            <>
                <div className='root'>
                    <div className="loaderContent">
                        <div className="loader"></div>
                    </div>
                </div>
            </>
        );
    }

    if (allUserData.length === 1) {
        return (
            <>
                {/* <div className="container NotFound" style={{ userSelect: "none" }}>

                    <div className="row">

                        <div className="col-lg-12 col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                            <img className="notFoundImage" src="https://img.freepik.com/premium-vector/empty-cart-illustration-perfect-user-interface-uiux-projects_854078-2080.jpg?w=1480" alt="EmptyCart" />
                        </div>

                        <div className="colo-lg-6" style={{ textAlign: "center" }}>
                            <h2>No other user exist in the findbuddy</h2>
                            <p>Your collection is empty. Bookmark posts to see them here later</p>
                        </div>

                    </div>

                </div> */}



                <div className="container empty-state-wrapper" style={{ userSelect: "none", padding: "4rem 0" }}>
                    <div className="row justify-content-center">

                        {/* Video Container */}
                        <div className="col-12 d-flex justify-content-center mb-4">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                className="empty-state-video"
                                style={{
                                    maxWidth: "65vh",
                                    mixBlendMode: "multiply", // Blends video background if it's white
                                    filter: "grayscale(20%)"   // Gives it a slightly more professional tone
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/man-fishing-on-camping-animation-gif-download-7358590.mp4'}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="col-lg-6 text-center">
                            <h2 style={{ fontWeight: "600", letterSpacing: "-0.02em", color: "#111" }}>
                                You’re the first one here-welcome to the inner circle
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                                Start the movement by creating your profile and inviting your inner circle to join the journey
                            </p>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    console.log(allUserData);

    const filteredUsers = allUserData.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.city?.toString().toLowerCase().includes(query) ||
            item.state?.toString().toLowerCase().includes(query) ||
            item.gymname?.toString().toLowerCase().includes(query) ||
            item.goal?.toString().toLowerCase().includes(query) ||
            item.shifts?.toString().toLowerCase().includes(query) ||
            item.userId?.username?.toString().toLowerCase().includes(query)
        );
    });

    if (filteredUsers.length === 0) {
        return (
            <>
                {/* <div className="container NotFound" style={{ userSelect: "none" }}>

                    <div className="row">

                        <div className="col-lg-12 col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                            <video autoPlay loop muted disablepictureinpicture="true" className="notFoundImage" src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/file-not-found-animation-gif-download-6342141.mp4'} />
                        </div>

                        <div className="colo-lg-6" style={{ textAlign: "center" }}>
                            <h2>No results found</h2>
                            <p>Please check the spelling or try searching for a different name or IDs</p>
                        </div>

                    </div>

                </div> */}

                <div className="container empty-state-wrapper" style={{ userSelect: "none", padding: "4rem 0" }}>
                    <div className="row justify-content-center">

                        {/* Video Container */}
                        <div className="col-12 d-flex justify-content-center mb-4">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                className="empty-state-video"
                                style={{
                                    maxWidth: "65vh",
                                    mixBlendMode: "multiply", // Blends video background if it's white
                                    filter: "grayscale(20%)"   // Gives it a slightly more professional tone
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/file-not-found-animation-gif-download-6342141.mp4'}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="col-lg-6 text-center">
                            <h2 style={{ fontWeight: "600", letterSpacing: "-0.02em", color: "#111" }}>
                                No results found
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                                Please check the spelling or try searching for a different name or IDs
                            </p>
                        </div>

                    </div>
                </div>

            </>
        )
    }

    console.log(filteredUsers);
    return (
        <>
            {/* 2. User Card List */}
            <div className="allCard">
                {filteredUsers.filter((items) => items._id !== userData.formId).map((items) => (
                    <div className="card m-4">
                        <div className="" key={items._id || items.id}>
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

                            <div className="button" >
                                <Link className="connectNow-button left" to={`/userProfile/${items.userId._id}`}> VIEW PROFILE </Link>
                                <Link className="connectNow-button right" to={`/userChats/${items.userId}`} onClick={() => { giveNotification(items.userId, userid) }}> MESSAGE </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Hero;