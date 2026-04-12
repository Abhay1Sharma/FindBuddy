import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import React, { useState, useEffect } from 'react';

function Hero() {
    const Id = useParams();
    const [formData, setFormData] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [activePostId, setActivePostId] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);
    const [allPost, setAllPost] = useState(null);
    const [ready, setReady] = useState(false);
    const [showAllPost, setShowAllPost] = useState(false);
    const [singlePost, setSinglePost] = useState([]);

    useEffect(() => {
        const userData = async () => {
            try {
                const user = await axios.post("http://localhost:3001/user", { id: Id.id });
                const posts = await axios.post("http://localhost:3001/userPosts", { id: Id.id });
                console.log(posts);
                setAllPost(posts.data.userposts);
                setUserInfo(user.data);
                setFormData(user.data.formId);
                setUserProfile(user.data.profileId);
                setSinglePost(posts.data.userposts);

                // FIX: Use user.data.profileId directly here
                const profile = user.data.profileId || {};
                setContent({
                    introContent: profile.introContent || "",
                    aboutContent: profile.aboutContent || "",
                    profileImage: profile.profileImage || null,
                    backgroundImage: profile.backgroundImage || null,
                });

                setReady(true);
            } catch (err) {
                console.log(err);
            }
        }
        userData();
    }, []);

    const tokenId = jwtDecode(localStorage.token).id;
    const userId = userInfo.id;
    console.log();
    console.log(showAllPost);

    const createTimeStamp = userProfile?.createdAt;
    const createDate = new Date(createTimeStamp);
    const updateTimeStamp = userProfile?.updatedAt;
    const updateDate = new Date(updateTimeStamp);
    const navigate = useNavigate();

    // Get a human-readable Date
    const createAtDate = createDate.toLocaleDateString();
    const updateAtDate = updateDate.toLocaleDateString();
    const [content, setContent] = useState({
        introContent: '',
        aboutContent: '',
        userId: userId,
        profileImage: null,
        backgroundImage: null,
    });

    // ... in your return statement, change the textarea values to use 'content'
    // so that you can actually type in them:

    const handleSumbit = async (e) => {
        try {
            e.preventDefault();

            const data = {
                userId: Id.id,
                about: content.aboutContent,
                intro: content.introContent,
            }
            console.log(data);

            if (profileImageFile) {
                const data = {
                    userId: Id.id,
                    about: content.aboutContent,
                    intro: content.introContent,
                    profileImage: profileImageFile
                }
            }
            if (backgroundImageFile) {
                const data = {
                    userId: Id.id,
                    about: content.aboutContent,
                    intro: content.introContent,
                    profileImage: profileImageFile,
                    backgroundImage: backgroundImageFile
                }
            }

            console.log(data);

            const res = await axios.post("http://localhost:3001/updateIntro", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log("Error detail:", error);
            // toast.error("Image not valid");
        }
    }

    const handleChange = (e) => {
        console.log("Handle Change occur", e);
        if (e.target.name === "profileImage") {
            return setProfileImageFile(e.target.files[0]); ''
        } else if (e.target.name === "backgroundImage") {
            return setBackgroundImageFile(e.target.files[0]);
        }
        return setContent({ ...content, [e.target.name]: e.target.value });
    }

    const clickProfileLink = async () => {
        console.log();
        const profileLink = `${window.location.origin}/userProfile/${userInfo._id}`;
        navigator.clipboard.writeText(profileLink)
            .then(() => {
                toast.success("Link copied!");
            })
            .catch((err) => {
                console.error("Failed to copy!", err);
                toast.error("Failed to copy link");
            });
    }

    const handleFollowers = async () => {
        try {
            // userId: token.id is the LOGGED-IN user
            const response = await axios.post("http://localhost:3001/followers", {
                profileId: userProfile._id,
                userId: userInfo._id
            });

            console.log(response);

            // UPDATE LOCAL STATE IMMEDIATELY
            if (response.status === 200) {
                setUserProfile(response.data.data)
            }
        } catch (error) {
            console.log("Like error:", error);
        }
    }

    // if(!showallPost){
    //     setAllPost(singlePost);
    // }

    if (!ready) {
        return (
            <div className='root' >
                <div className="loaderContent">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="allCards">
                <div className='container'>
                    <div className='row g-3 profileSection'>
                        <div className='col-lg-12 ' >
                            <div className="profile-container">
                                <div className="profileCard">
                                    <div className='backgroundImage'>
                                        <img className='cover-image' aria-label="Profile cover image" src={userProfile?.backgroundImage} />
                                    </div>
                                    <div className="profile-info-wrapper">
                                        <div className="profile-avatar-section">
                                            <div className="profileAvatar"><img className='profileImage' src={userProfile?.profileImage} />
                                                {userInfo._id === tokenId && <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>}

                                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Intro</h1>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">

                                                                <form onSubmit={handleSumbit}>

                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">Choose profile photo</label>
                                                                        <input className="form-control" name="profileImage" type="file" id="formFile" accept="image/*" onChange={handleChange} />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">Choose background photo</label>
                                                                        <input className="form-control" name="backgroundImage" type="file" id="formFile" accept="image/*" onChange={handleChange} />
                                                                    </div>

                                                                    <label htmlFor="headline" className="headline">Headline</label>
                                                                    <textarea name="introContent"
                                                                        id="headline"
                                                                        className="form-control"
                                                                        value={content.introContent}
                                                                        onChange={handleChange} />

                                                                    <label htmlFor="about" className="about">About Content</label>
                                                                    <textarea name="aboutContent"
                                                                        id="about"
                                                                        className="form-control"
                                                                        value={content.aboutContent}
                                                                        onChange={handleChange} />

                                                                    <div className="modal-footer">
                                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Save changes</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profile-actions">
                                                {userInfo._id !== tokenId && <button className="btn btn-primary" style={{ color: "#F3F4F6", backgroundColor: "#06A", border: "none", width: "auto" }} aria-label="Open to Gym" onClick={handleFollowers}> <i className="fas fa-dumbbell"></i> {userProfile.followers.includes(Id.id) ? "Unfollow" : "Wants to Follow"} </button>}
                                                {userInfo._id !== tokenId && <Link to={`/userChats/${userInfo._id}`}> <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#8B5CF6", border: "none" }} aria-label="Send Message" > <i className="fas fa-paper-plane"></i> Message </button> </Link>}
                                                <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-footer">
                                                                <button className="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About Profile</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex="-1">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">Account Information</h1>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <span><b>Profile Created At : </b>{createAtDate}</span>
                                                                <br /><br />
                                                                <span><b>Profile Updated At : </b>{updateAtDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#F59E0B", border: "none" }} data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About Profile</button>
                                            </div>
                                        </div>
                                        <div className="name-title">
                                            <h1>{userInfo.username}</h1>
                                            <div className="headline">{userProfile?.introContent}</div>
                                            <div className="location-info">
                                                <span><i className="fas fa-map-marker-alt"></i> {formData.city}, {formData.state} </span>
                                                <span><i className="fas fa-link"></i> {formData?.gymname}</span>
                                                <span><i className="fa-solid fa-clock"></i> {formData.shifts}</span>
                                            </div>
                                            <div className="contact-badge">
                                                <a href="#"><i className="fas fa-envelope"></i> {userInfo?.email}</a>
                                                <button className="shareBtn" onClick={() => { clickProfileLink() }}>Share Profile <i class="fa-regular fa-share-from-square"></i></button>
                                            </div>
                                        </div>
                                        <div className="stats-row">
                                            <div className="stat-item"><span className="stat-number">{userProfile?.followers.length}</span> followers</div>
                                            <div className="stat-item"><span className="stat-number">1,289</span> connections</div>
                                            <div className="stat-item"><span className="stat-number">12</span> recommendations</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >


                <div className='container'>
                    <div className='row g-3 aboutSection' >
                        <div className='col-lg-12' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                            <div className=''>
                                <h4 style={{ fontWeight: 700 }}>About</h4>
                                <span className="aboutContent">{userProfile?.aboutContent}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    <div className='row g-3' >
                        <div className='col-lg-12 mt-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className='activitySection'>
                                <h4 style={{ fontWeight: 700 }}>Activity</h4>
                                <hr />
                                <div className='activityContent text-muted'>
                                    {
                                        allPost.filter((items, idx) => idx === 0 || showAllPost).map((items, idx) => (
                                            <div className="container mb-4" key={items._id} >
                                                <div className="row">
                                                    <div className="col-lg-12 post">
                                                        <div className="linkedin-card mt-4" style={{ width: "80%" }}>
                                                            <Link className="postHeader" to={`http://localhost:3002/userProfile/${items.userId}`}>
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
                                        ))
                                    }
                                    {showAllPost ? <button className="showAllPostBtn" onClick={() => setShowAllPost(!showAllPost)}>Shows Less</button> : <button className="showAllPostBtn" onClick={() => setShowAllPost(!showAllPost)}>Shows All </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Hero;


