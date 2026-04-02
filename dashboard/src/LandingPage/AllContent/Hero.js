import React from "react";

function Hero() {

    return (
        <>
            <div className="container mt-4 mb-4">
                <div className="row">
                    <div className="col-lg-12 post">
                        <div class="linkedin-card">
                            <div class="post-header">
                                <img src="https://via.placeholder.com/50" alt="User Avatar" class="avatar" />
                                <div class="user-information">
                                    <h3 class="user-name">Abhay Sharma</h3>
                                    <p class="user-headline">Full Stack Developer | MERN Stack | AI & ML Student</p>
                                    <p class="post-time">1h • <i class="fas fa-globe-americas"></i></p>
                                </div>
                                <button class="options-btn">•••</button>
                            </div>

                            <div class="post-content">
                                <p>
                                    Just finished deploying a new feature on my latest project! 🚀 Building scalable applications with the MERN stack has been an incredible journey. Can't wait to share more updates soon.
                                    <span class="hashtag">#WebDevelopment #CodingLife #MERN</span>
                                </p>
                            </div>

                            <div class="post-actions">
                                <button class="action-item">
                                    <span class="icon">👍</span> Like
                                </button>
                                <button class="action-item">
                                    <span class="icon">💬</span> Comment
                                </button>
                                <button class="action-item">
                                    <span class="icon">🔁</span> Repost
                                </button>
                                <button class="action-item">
                                    <span class="icon">✈️</span> Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Hero;