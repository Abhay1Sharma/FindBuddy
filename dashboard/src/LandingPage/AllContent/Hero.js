import axios from "axios";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import { Link } from "react-router-dom";

function Hero() {
    const [allPost, setAllPost] = useState([]);
    const [postUser, setPostUser] = useState([]);
    const [activePostId, setActivePostId] = useState(null);

    // console.log(allPost);'

    const toggleComments = (postId) => {
        setActivePostId(prevId => (prevId === postId ? null : postId));
    };

    const fetchAllPost = async () => {
        try {
            const response = await axios.get("http://localhost:3001/allPost");
            console.log(response.data);
            setAllPost(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchUser = async (items) => {
        try {
            console.log(items);
            const id = items.userId;
            const response = await axios.post("http://localhost:3001/user", { id: id });
            setPostUser(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const goToProfile = () => {
        try {
            window.location.redirect = "http://localhost:3002/userProfile"
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllPost();
    }, []);

    return (
        <>
            {allPost.map((items) => (
                <div className="container mt-4 mb-4" key={items._id} >
                    <div className="row">
                        <div className="col-lg-12 post">
                            <div className="linkedin-card">
                                <Link className="postHeader" to={`http://localhost:3002/userProfile/${items.userId._id}`}>
                                    <div className="post-header" onClick={() => { goToProfile() }}>
                                        {items.profileId &&
                                            <img src={items.profileId.profileImage} alt="User Avatar" className="avatar" />
                                        }
                                        {items.profileId && <div className="user-information">
                                            <h3 className="user-name">{items.userId && items.userId.username}</h3>
                                            <p className="user-headline">{items.profileId.introContent}</p>
                                            <p className="post-time">{items.createdAt ?
                                                formatDistanceToNow(new Date(items.createdAt), { addSuffix: true }).replace('about ', '')
                                                : "Just now"} • <i className="fas fa-globe-americas"></i></p>
                                        </div>}
                                        <button className="options-btn">•••</button>
                                    </div>
                                </Link>


                                <div className="post-content">
                                    <p>
                                        {items.about}
                                        <span className="hashtag"> #Fitness #CodingLife #GymMotivation</span>
                                    </p>
                                    {items.media &&
                                        <div className="postMedia" style={{
                                            backgroundColor: '#f3f2ef',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: '100%',
                                            maxHeight: '560px',
                                            overflow: 'hidden'
                                        }}>
                                            {items.media && items.media.includes('.mp4') ? (
                                                <video
                                                    src={items.media}
                                                    controls
                                                    style={{
                                                        width: '100%',
                                                        height: '560px',       // Fixed height to match container
                                                        objectFit: 'contain',  // Shows full image with bars on sides if too skinny
                                                        display: 'block',
                                                        borderRadius: '8px'
                                                    }}
                                                />
                                            ) : (
                                                <img
                                                    src={items.media}
                                                    style={{
                                                        width: '100%',
                                                        height: '560px',       // Fixed height to match container
                                                        objectFit: 'contain',  // Shows full image with bars on sides if too skinny
                                                        display: 'block'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    }
                                </div>

                                <div className="post-actions">
                                    <button className="action-item">
                                        <span className="icon">👍</span> Like
                                    </button>

                                    {/* Pass the items._id to the toggle function */}
                                    <button className="action-item" onClick={() => toggleComments(items._id)}>
                                        <span className="icon">💬</span> Comment
                                    </button>

                                    <button className="action-item">
                                        <span className="icon">🔁</span> Repost
                                    </button>
                                    <button className="action-item">
                                        <span className="icon">✈️</span> Send
                                    </button>
                                </div>

                                {/* Only show comments if this post's ID matches activePostId */}
                                {activePostId === items._id && (
                                    <div className="comment-section p-3 border-top">
                                        <div className="d-flex align-items-center mb-2">
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Add a comment..."
                                            />
                                        </div>
                                        <ul className="list-unstyled">
                                            <li className="small mb-1"><strong>Jane Doe:</strong> Great workout! Keep it up.</li>
                                        </ul>
                                        <button
                                            className="btn btn-link btn-sm p-0 text-decoration-none"
                                            onClick={() => setActivePostId(null)}
                                        >
                                            Hide comments
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Hero;