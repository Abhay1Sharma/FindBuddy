import { useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { toast } from "react-toastify"; // Or your preferred toast library
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function Hero() {
    const socket = io("http://localhost:3001");

    const [notifications, setNotifications] = useState([]);
    const userId = jwtDecode(localStorage.token).id;
    console.log(notifications);

    const ICON_PATHS = {
        LIKE: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        COMMENT: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5z",
        FOLLOW: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm11 1v6m-3-3h6",
        CHAT: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 9h8 M8 13h6"
    };

    useEffect(() => {
        const Notifications = async () => {
            try {
                const notificationHistory = await axios.get(`http://localhost:3001/notifications/${userId}`);
                console.log(notificationHistory);
                setNotifications(notificationHistory.data);
            } catch (error) {
                console.log(error);
            }
        }
        Notifications()
    }, []);

    return (
        <>
            {notifications.map((items) => (
                <div class="notification-card unread" key={items._id}>
                    <Link className="postHeader" to={`/userProfile/${items.sender._id}`}>

                        <div class="avatar-container">
                            <img src={items.sender.profileId.profileImage} alt="User Profile" class="avatar" />
                            <div className={`icon-badge ${items.type.toLowerCase() || ""}`}>
                                <svg width="10" height="10" viewBox="0 0 24 24">
                                    <path d={ICON_PATHS[items.type]} />
                                </svg>
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