import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { toast } from "react-toastify"; // Or your preferred toast library
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function Hero() {
    const backendUrl = "https://findbuddy-back.onrender.com";
    const socket = io(`${backendUrl}`);

    const [notifications, setNotifications] = useState([]);
    const userId = jwtDecode(localStorage.token).id;
    console.log(notifications);

    const ICON_PATHS = {
        LIKE: <i class="fa-regular fa-circle-heart" style={{color: "rgb(238, 46, 46)"}}></i>,
        COMMENT: <i class="fa-regular fa-comment" style="color: rgb(60, 222, 86);"></i>,
        CONNECT: <i class="fa-solid fa-handshake" style={{color: "rgb(240, 200, 39)"}}></i>,
        FOLLOW: <i class="fa-solid fa-user-plus" style={{color: "rgb(93, 108, 237)"}}></i>,
        CHAT: <i class="fa-solid fa-comment" style={{color: "rgb(162, 236, 174)"}}></i>,
    };

    useEffect(() => {
        const Notifications = async () => {
            try {
                const notificationHistory = await axios.get(`${backendUrl}/notifications/${userId}`);
                console.log(notificationHistory);
                setNotifications(notificationHistory.data);
            } catch (error) {
                console.log(error);
            }
        }
        Notifications()
    }, []);

    if (notifications.length === 0) {
        return (
            <>
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
                                    mixBlendMode: "multiply",
                                    filter: "grayscale(20%)"
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/notifications-animation-gif-download-9166489.mp4'}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="col-lg-6 text-center">
                            <h2 style={{ fontWeight: "600", letterSpacing: "-0.02em", color: "#111" }}>
                                Nothing to see here... yet.
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                                Stay in the loop! New connections, mentions, and updates will show up here as they happen
                            </p>
                        </div>

                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            {notifications.map((items) => (
                <div class="notification-card unread" key={items._id}>
                    <Link className="postHeader" to={`/userProfile/${items.sender._id}`}>

                        <div class="avatar-container">
                            <img src={items.sender.profileId.profileImage} alt="User Profile" class="avatar" />
                            <div className={`icon-badge ${items.type.toLowerCase()}`}>
                                {ICON_PATHS[items.type]}
                            </div>
                        </div>

                        <div class="notif-content">
                            <p class="notif-text">
                                <span class="username">{items.sender.username}</span> {items.content}.
                            </p>
                            <span class="notif-time">{items.createdAt ?
                                formatDistanceToNow(new Date(items.createdAt), { addSuffix: true }).replace('about ', '')
                                : "Just now"} • <i className="fas fa-globe-americas"></i></span>
                        </div>

                        <div class="status-dot"></div>
                    </Link>
                </div >
            ))}
        </>
    )
}

export default Hero;