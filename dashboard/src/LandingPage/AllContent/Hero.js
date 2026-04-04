import axios from "axios";
import React, { useState, useEffect } from "react";

function Hero() {
    // 1. Initialize as empty array to prevent "undefined" map error
    const [allPost, setAllPost] = useState([]);
    // 2. Track the ID of the open comment section instead of a boolean
    const [activePostId, setActivePostId] = useState(null);

    const toggleComments = (postId) => {
        setActivePostId(prevId => (prevId === postId ? null : postId));
    };

    const fetchAllPost = async () => {
        try {
            const response = await axios.get("http://localhost:3001/allPost");
            setAllPost(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchUser = async () => {
        try {
            const response = await axios.get("http://localhost:3001/userProfile");
            setAllPost(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchAllPost();
    }, []);

    return (
        <>
            {allPost.map((items) => (
                <div className="container mt-4 mb-4" key={items._id}>
                    <div className="row">
                        <div className="col-lg-12 post">
                            <div className="linkedin-card">
                                <div className="post-header">
                                    <img src="https://via.placeholder.com/50" alt="User Avatar" className="avatar" />
                                    <div className="user-information">
                                        <h3 className="user-name">Abhay Sharma</h3>
                                        <p className="user-headline">Full Stack Developer | MERN Stack | AI & ML Student</p>
                                        <p className="post-time">1h • <i className="fas fa-globe-americas"></i></p>
                                    </div>
                                    <button className="options-btn">•••</button>
                                </div>

                                <div className="post-content">
                                    <p>
                                        {items.about}
                                        <span className="hashtag"> #Fitness #CodingLife #GymMotivation</span>
                                    </p>
                                    <div className="postMedia" style={{
                                        backgroundColor: '#f3f2ef', // LinkedIn's neutral background for image gaps
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: '100%',
                                        maxHeight: '560px',        // Standard LinkedIn max-height
                                        overflow: 'hidden'
                                    }}>
                                        {/* {<img
                                            className="postContent"
                                            src={items.media}
                                            alt='media'
                                            style={{
                                                width: '100%',
                                                height: '560px',       // Fixed height to match container
                                                objectFit: 'contain',  // Shows full image with bars on sides if too skinny
                                                display: 'block'
                                            }}
                                        /> || <video src={"http://localhost:3001/uploads/1775233617125-05. Tools to Install.mp4"} controls style={{ width: '100%', borderRadius: '8px' }} /> } */}
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