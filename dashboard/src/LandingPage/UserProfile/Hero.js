import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Button } from "@mui/material";

function Hero() {
    const Id = useParams();
    const [file, setFile] = useState(null);
    const [postId, setPostId] = useState();
    const [ready, setReady] = useState(false);
    const [wait, setWait] = useState(false);
    const [comment, setComment] = useState("");
    const [request, setRequest] = useState([]);
    const token = jwtDecode(localStorage.token);
    const [formData, setFormData] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [postUser, setPostUser] = useState([]);
    const [allPost, setAllPost] = useState(null);
    const [commentId, setCommentId] = useState();
    const [success, setSuccess] = useState(false);
    const [allComment, setAllComment] = useState();
    const [singlePost, setSinglePost] = useState([]);
    const [postAbout, setPostAbout] = useState(null);
    const [commentUser, setCommentUser] = useState();
    const [loggedUser, setLoggedUser] = useState(null);
    const [userProfile, setUserProfile] = useState({});
    const [checkRequest, setCheckRequest] = useState([]);
    const [showWarning, setShowWarning] = useState(false);
    const [allFollowers, setAllFollowers] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const [showAllPost, setShowAllPost] = useState(false);
    const [activePostId, setActivePostId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [allFollowings, setAllFollowings] = useState([]);
    const [checkConnection, setCheckConnection] = useState(null);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [connectionProfile, setConnectionProfile] = useState([]);
    const [backgroundImageFile, setBackgroundImageFile] = useState(null);

    const backendUrl = "https://findbuddy-back.onrender.com";
    const dashboardUrl = "https://findbuddy-dash.onrender.com";

    const toggleComments = async (postId) => {
        setActivePostId(prevId => (prevId === postId ? null : postId));
        const postComments = await axios.post(`${backendUrl}/userPostComments`, { postId: postId });
        const response = await axios.post(`${backendUrl}/user`, { id: token.id });
        setCommentUser(response.data)
        setAllComment(postComments.data.allComments);
    };

    const fetchAllPost = async () => {
        try {
            const response = await axios.get(`${backendUrl}/allPost`);
            const sortedArray = response.data.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            });

            setAllPost(sortedArray);
            setReady(true);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleLike = async (items) => {
        try {
            const response = await axios.post(`${backendUrl}/like`, {
                postId: items._id,
                userId: token.id
            });

            if (response.status === 200) {
                setAllPost(prevPosts =>
                    prevPosts.map(post =>
                        post._id === items._id ? response.data.updatedPost : post
                    )
                );
            }
        } catch (error) {
            console.log("Like error:", error);
        }
    }

    const handleComment = async (e) => {
        e.preventDefault();
        try {
            if (comment.trim() === '') {
                toast.info("Can't post an empty comment");
                return;
            }
            const data = {
                "comment": comment,
                "postId": postId._id,
                "userId": commentUser._id,
                "profileId": commentUser.profileId._id
            };
            const res = await axios.post(`${backendUrl}/comment`, data);
            window.location.reload();
            setComment(null);
        } catch (error) {
            console.log(error);
        }
    }

    const postsId = async (items) => {
        return setPostId(items);
    }

    const editComments = async (e) => {
        try {
            e.preventDefault();
            const data = {
                "editComment": comment,
                "commentId": commentId._id,
            };
            const res = await axios.post(`${backendUrl}/editComment`, data);
            console.log("Server Response:", res.data);
            if (res.status === 200) {
                setAllComment(prevComments =>
                    prevComments.map(item =>
                        item._id === commentId._id ? { ...item, comment: comment } : item
                    )
                );
            }
        } catch (error) {
            console.error("Failed to update comment:", error.response?.data || error.message);
        }
    };


    useEffect(() => {
        const userData = async () => {
            try {
                const user = await axios.post(`${backendUrl}/user`, { id: Id.id });
                const posts = await axios.post(`${backendUrl}/userPosts`, { id: Id.id });
                const loggedUser = await axios.post("https://findbuddy-back.onrender.com/user", { id: token.id });
                const connection = await axios.post("https://findbuddy-back.onrender.com/connectionsProfile", { connectionId: user.data.connectionId });
                const loggedConnection = await axios.post("https://findbuddy-back.onrender.com/connectionsProfile", { connectionId: loggedUser.data.connectionId });
                const userConnection = await axios.post("https://findbuddy-back.onrender.com/fetchUserConnections", { connectionId: loggedUser.data.connectionId });
                console.log(userConnection);
                setCheckRequest(loggedConnection.data.userConnection);
                setRequest(userConnection.data.fetchConnection);
                setConnectionProfile(connection.data.userConnection);
                setLoggedUser(loggedUser.data);
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
    const userId = userInfo.id || userInfo._id;
    console.log(userInfo);
    console.log(loggedUser);

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
            console.log("Click Sumbit....", Id);

            const data = {
                userId: Id.id,
                about: content.aboutContent,
                intro: content.introContent,
            }
            console.log(data);
            if (profileImageFile) {
                data.profileImage = profileImageFile;
                console.log(data);
            }
            if (backgroundImageFile) {
                data.backgroundImage = backgroundImageFile;
            }

            console.log(data);

            toast.info("Wait for a minute..");

            const res = await axios.post(`${backendUrl}/updateIntro`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.status === 200) {
                window.location.reload();
            }
        } catch (error) {
            console.log("Error detail:", error);
            toast.error("Try again, Something went wrong");
        }
    }

    const handleChange = (e) => {
        console.log("Handle Change occur", e);
        const { name, value, files } = e.target;
        if (e.target.name === "profileImage") {
            return setProfileImageFile(e.target.files[0]); ''
        } if (e.target.name === "backgroundImage") {
            return setBackgroundImageFile(e.target.files[0]);
        }

        console.log(name, value);
        if (name === "postAbout") {
            setPostAbout(value);
        } else if (name === "editMedia" && files[0]) {
            console.log(files);
            const selected = files[0];
            setFile(URL.createObjectURL(selected));
            setSelectedFile(selected);
        } else if (name === "comment") {
            setComment(value);
        }
        return setContent({ ...content, [e.target.name]: e.target.value });
    }

    const giveNotification = async (userId, ownerid) => {
        try {
            console.log(userId, ownerid);
            const data = {
                senderId: userId,
                ownerId: ownerid
            }
            const sendIds = await axios.post(`${backendUrl}/messageIds`, data);
            console.log(sendIds)
        } catch (error) {
            console.log(error);
        }
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

    console.log(allFollowers);

    const showFollowers = async (userProfileId) => {
        try {
            console.log(userProfileId);
            const allFollowers = await axios.post("https://findbuddy-back.onrender.com/allUserFollowers", { userProfileId });
            console.log(allFollowers);
            setAllFollowers(allFollowers.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(connectionProfile);

    const showFollowings = async (userProfileId) => {
        try {
            console.log(userProfileId);
            const allFollowers = await axios.post("https://findbuddy-back.onrender.com/allUserFollowings", { userProfileId });
            console.log(allFollowers);
            setAllFollowings(allFollowers.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    console.log(checkConnection);

    const handleFollowers = async () => {
        try {
            // userId: token.id is the LOGGED-IN user
            const response = await axios.post(`${backendUrl}/followers`, {
                profileId: userProfile._id,
                userId: token.id
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

    const savePost = async (items) => {
        try {
            console.log(items);
            const postIds = {
                UserId: token.id,
                PostId: items._id,
                PostUserId: items.userId._id,
                ProfileId: items.profileId._id,
                isPostSave: true,
            }
            const sendPost = await axios.post(`${backendUrl}/savePost`, postIds);
            console.log(sendPost);
            setAllPost(prevPost =>
                prevPost.map(item =>
                    item._id === items._id ? { ...item, isPostSave: true } : item
                )
            );

            console.log(sendPost);
        } catch (error) {
            console.log(error);
        }
    }

    const editPost = (items) => {
        setEditingPost(items);
        setPostAbout(items.about);
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();

        if (!selectedFile && !postAbout) {
            return toast.info("Cannot update to an empty post");
        }

        try {
            // Use FormData for file uploads
            let formData = {
                postId: editingPost._id,
                postAbout: postAbout
            }

            if (selectedFile) {
                let fileToUpload = selectedFile;

                if (selectedFile.type.startsWith('image/')) {
                    const options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1024,
                        useWebWorker: true
                    };
                    toast.info("Compressing Image...");
                    fileToUpload = await imageCompression(selectedFile, options);
                }
                // Video size check
                else if (selectedFile.type.startsWith('video/')) {
                    if (selectedFile.size > 50 * 1024 * 1024) {
                        return toast.error("Video too large! Max 50MB.");
                    }
                }
                formData = {
                    postId: editingPost._id,
                    postAbout: postAbout,
                    editMedia: fileToUpload,
                }
            }

            const res = await axios.post(`${backendUrl}/editPost`, formData, {
                timeout: 60000,
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success("Post updated!");
            setFile(null);
            setSelectedFile(null);
            setEditingPost(null);
            fetchAllPost();
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Failed to update post");
        }
    };

    console.log(loggedUser);

    const UnsavePost = async (items) => {
        try {
            console.log(items);
            const postIds = {
                UserId: token.id,
                postId: items._id,
            }

            console.log(postIds);
            const sendPost = await axios.post(`${backendUrl}/UnSavePostfromHome`, postIds);
            console.log(sendPost);
            setAllPost(prevPost =>
                prevPost.map(item =>
                    item._id === items._id ? { ...item, isPostSave: false } : item
                )
            );
        } catch (error) {
            console.log(error);
        }
    }

    const deletePost = async (items) => {
        try {
            console.log(items);
            if (window.confirm("Are you want to delete this post...."));
            const res = await axios.delete(`${backendUrl}/deletePost/${items._id}`);
            console.log(res);
            toast.success("Post Deleted Successfully");
            setTimeout(() => { window.location.reload() }, 3000);
        } catch (error) {
            console.log(error);
            toast.error("Some Error Occurred");
        }
    }

    const copyPostLink = (postId) => {
        const postUrl = `${window.location.origin}/allContent`;

        navigator.clipboard.writeText(postUrl)
            .then(() => {
                toast.success("Link copied!");
            })
            .catch((err) => {
                console.error("Failed to copy!", err);
                toast.error("Failed to copy link");
            });
    };

    // useEffect( () => {
    //     const fetchConnection = async () => {
    //         try {

    //             console.log(userInfo);
    //             // setRequest(connection.data.userConnection)
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     fetchConnection()
    // }, []);

    const connectWithMe = async () => {
        try {
            const user = await axios.post(`${backendUrl}/user`, { id: Id.id });
            const connection = await axios.post("https://findbuddy-back.onrender.com/makeConnection", { ownerId: userInfo._id, loggedUserId: loggedUser._id });
            const connectionProfile = await axios.post("https://findbuddy-back.onrender.com/connectionsProfile", { connectionId: user.data.connectionId });
            setConnectionProfile(connectionProfile.data.userConnection);
            setRequest(connection.data.makeRequest);
        } catch (error) {
            console.log(error);
        }
    }

    const goToProfile = async () => {
        try {
            navigate(`/userProfile/${connectionProfile.connectedTo.userId}`);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const leaveConnection = async () => {
        try {
            const connectionsIds = { userInfos: userInfo, loggedUsers: loggedUser };
            const deleteConnection = await axios.post("https://findbuddy-back.onrender.com/leaveConnection", connectionsIds);
            console.log(deleteConnection);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const rejectRequest = async () => {
        try {
            console.log("Connection Rejected by users");
            const connectionsIds = { loggedUsersConnectionId: loggedUser.connectionId };
            const deleteConnection = await axios.post("https://findbuddy-back.onrender.com/rejectRequest", connectionsIds);
            console.log(deleteConnection);
        } catch (error) {
            console.log(error);
        }
    }

    const connectUser = async () => {
        try {
            setWait(true);
            console.log("Connect User");
            const data = {
                userId: userInfo?._id,
                loggedUserId: loggedUser?._id,
                userConnectionId: userInfo?.connectionId,
                loggedUserConnectionId: loggedUser?.connectionId,
            }

            console.log(data);
            const res = await axios.post("https://findbuddy-back.onrender.com/acceptConnection", data);
            setCheckConnection(prev => ({
                ...prev,
                isAnyRequest: false
            }));

            setTimeout(() => { setWait(false) }, 4000);
            setSuccess(true)
            setTimeout(() => { setSuccess(false); navigate("/"); }, 5000);
        } catch (error) {
            console.log(error);
        }
    }

    const goToFollowersProfile = async (url) => {
        try {
            navigate(`/userProfile/${url}`);
            window.location.reload();
        } catch (error) {
            console.log(error);
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

                                                                <form onSubmit={(e) => { handleSumbit(e) }}>

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
                                                {userInfo._id !== tokenId && <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#06A", border: "none", width: "max-content" }} aria-label="Open to Gym" onClick={handleFollowers}> {userProfile.followers.includes(loggedUser?.profileId._id) ? "Unfollow" : "Follow"} </button>}
                                                {userInfo._id !== tokenId && <Link to={`/userChats/${userInfo._id}`}> <button onClick={() => { giveNotification(userInfo._id, tokenId) }} className="btn" style={{ color: "#F3F4F6", backgroundColor: "#8B5CF6", border: "none" }} aria-label="Send Message" >Message </button> </Link>}
                                                <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-footer">
                                                                <button className="btn btn-primary" style={{ width: "max-content" }} data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About Profile</button>
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
                                                <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#F59E0B", border: "none" }} data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About</button>
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
                                            <div className="stat-item" data-bs-toggle="modal" style={{ width: "auto", height: "max-content" }} data-bs-target="#staticBackdrop" onClick={() => showFollowers(userProfile._id)}><span className="stat-number">{userProfile?.followers.length}</span> followers</div>
                                            <div className="stat-item" data-bs-toggle="modal" style={{ width: "auto", height: "max-content" }} data-bs-target="#staticBackdropFollowings" onClick={() => showFollowings(userProfile._id)}><span className="stat-number">{userProfile?.following.length}</span> followings </div>

                                            {connectionProfile.connectedTo && <div className="conection-box">
                                                {loggedUser?.profileId._id === userInfo.profileId._id ?
                                                    <button className="connection-leave-btn" data-bs-toggle="modal" data-bs-target="#leaveConnectionConfirmModal" >
                                                        <img src={connectionProfile?.connectedTo?.profileImage} alt="Avatar leaves" style={{ width: "51px", height: "51px", borderRadius: "50%", marginRight: "1rem" }} />
                                                        {/* Wants to leave */}
                                                    </button> :
                                                    <Link onClick={() => { goToProfile(); }} style={{ cursor: "pointer", textDecoration: "none" }} >
                                                        <button className="connection-profile" >
                                                            <img src={connectionProfile?.connectedTo?.profileImage} alt="Avatar" style={{ width: "51px", height: "51px", borderRadius: "50%", backgroundColor: "#f8f9fa", marginRight: "1rem" }} />
                                                            {/* Already have a buddy */}
                                                        </button>
                                                    </Link>
                                                }
                                            </div>}

                                            {connectionProfile.isConnected === false && checkRequest?.requestFrom?.includes(userInfo?._id) &&
                                                <button onClick={() => { connectUser() }} className="btn btn-info cancel-button" style={{ width: "auto", height: "max-content", backgroundColor: "#3ce070", color: "white" }} > Accept </button>
                                            }

                                            {checkRequest.isConnected === false && userInfo.formId.city === loggedUser.formId.city && userInfo.formId.gymname === loggedUser.formId.gymname && userInfo._id !== loggedUser._id && connectionProfile.isConnected === false && !checkRequest?.requestFrom?.includes(userInfo?._id) ? <div>
                                                {connectionProfile?.requestFrom?.includes(loggedUser?._id) ?
                                                    <button className="btn btn-info cancel-button" style={{ width: "auto", height: "max-content", backgroundColor: "#fa5151cd", color: "white" }} onClick={() => connectWithMe()}> Cancel request </button> :
                                                    <button className="btn btn-success connect-button" style={{ width: "auto", height: "max-content", }} onClick={() => connectWithMe()}> Connect </button>
                                                }
                                            </div> :

                                                <div>
                                                    {connectionProfile.isConnected === false && checkRequest.isAnyRequest === false && userInfo._id !== loggedUser._id &&
                                                        <button className="btn" style={{ width: "auto", height: "max-content", backgroundColor: "#eef452fe", color: "white" }} onClick={() => setShowWarning(!showWarning)}> Accompanied </button>
                                                    }
                                                </div>
                                            }
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
                                    {allPost.map((items) => (
                                        <div className="container mt-4 mb-4" key={items._id} >
                                            <div className="row">
                                                <div className="col-lg-12 post">
                                                    <div className="linkedin-card mt-4">
                                                        <div className="post-header">
                                                            <Link className="postHeader" to={`${dashboardUrl}/userProfile/${items.userId._id}`}>
                                                                {items.profileId &&
                                                                    <img src={items?.profileId?.profileImage} alt="User Avatar" className="avatar" />
                                                                }
                                                                {items.profileId && <div className="user-information">
                                                                    <h3 className="user-name">{items.userId && items.userId.username}</h3>
                                                                    <p className="user-headline">{items.profileId.introContent}</p>
                                                                    <p className="post-time">{items.createdAt ?
                                                                        formatDistanceToNow(new Date(items.createdAt), { addSuffix: true }).replace('about ', '')
                                                                        : "Just now"} • <i className="fas fa-globe-americas"></i></p>
                                                                </div>}
                                                            </Link>
                                                            <div className="dropdown-container">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`dropdown-${items._id}`}
                                                                    className="dropdown-toggle"
                                                                />

                                                                <label htmlFor={`dropdown-${items._id}`} className="options-btn">
                                                                    •••
                                                                </label>

                                                                {/* The menu list defined in your CSS */}
                                                                <ul className="dropdown-menu-list">
                                                                    {
                                                                        items.isPostSave ?
                                                                            <li onClick={() => { UnsavePost(items) }}>
                                                                                <i className="fas fa-bookmark"></i> Remove from saved
                                                                            </li>
                                                                            :
                                                                            <li onClick={() => { savePost(items) }}>
                                                                                <i className="fas fa-bookmark"></i> Save for later
                                                                            </li>
                                                                    }

                                                                    <li onClick={() => { copyPostLink(items._id) }}>
                                                                        <i className="fas fa-link"></i> Copy link
                                                                    </li>
                                                                    {items.userId._id === token.id && (
                                                                        <>
                                                                            <li onClick={() => editPost(items)} data-bs-toggle="modal" data-bs-target="#modalEditPost">
                                                                                <i className="fas fa-edit"></i> Edit Post
                                                                            </li>
                                                                            <li className="delete-opt" onClick={() => { deletePost(items) }} ><i className="fas fa-trash"></i> Delete Post</li>
                                                                        </>
                                                                    )}
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                                <div className="modal-content">
                                                                    <div className="modal-header modalHeader">
                                                                        <h5 className="modal-title" id="exampleModalLongTitle">Make a Post </h5>
                                                                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                                                            <span aria-hidden="true" className='closeBtn'>X</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        {postAbout}
                                                                        <form onSubmit={handleSumbit}>

                                                                            <label htmlFor="about" className="about">About Content</label>
                                                                            <textarea name="postAbout" id="about" className="form-control mt-2" placeholder="Write about yourself..." onChange={handleChange} value={items.about} />

                                                                            <div className="media-uploader mt-4">
                                                                                <label htmlFor="media-input" className="custom-button">
                                                                                    <input type="file" id="media-input" accept="image/*,video/*" name="media" hidden onChange={handleChange} />
                                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                                        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
                                                                                    </svg>

                                                                                    {file && (
                                                                                        selectedFile?.type.startsWith('video/') ? (
                                                                                            <video src={file} controls style={{ width: '100%', borderRadius: '8px' }} />
                                                                                        ) : (
                                                                                            <img src={file} alt="Selected content" style={{ width: '100%', borderRadius: '8px' }} />
                                                                                        )
                                                                                    )}

                                                                                </label>

                                                                                <div id="preview-container"></div>
                                                                            </div>

                                                                            <div className="modal-footer">
                                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                                <button type="sumbit" className="btn btn-primary">Save changes</button>
                                                                            </div>

                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>


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
                                                                                height: '560px',
                                                                                objectFit: 'contain',
                                                                                display: 'block',
                                                                                borderRadius: '8px'
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        <img
                                                                            src={items.media}
                                                                            style={{
                                                                                width: '100%',
                                                                                height: '560px',
                                                                                objectFit: 'contain',
                                                                                display: 'block'
                                                                            }}
                                                                        />
                                                                    )}
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="post-actions">
                                                            <button className="action-item" onClick={() => handleLike(items)}>
                                                                {items.likes.includes(token.id) ?
                                                                    <span className="icon"> <span style={{ color: "red" }}>❤️</span> {items.likes.length} likes</span> :
                                                                    <span className="icon"><span style={{ color: "white" }}>🤍</span> {items.likes.length} likes</span>
                                                                }
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
                                                                <form onSubmit={handleComment}>
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm comment"
                                                                            placeholder="Add a comment..."
                                                                            name="comment" onChange={handleChange} required
                                                                        />
                                                                        <button onClick={() => postsId(items)} className="commentBtn" type="sumbit"> Add </button>
                                                                    </div>
                                                                </form>
                                                                <ul className="list-unstyled">
                                                                    {allComment && allComment.map((items) => (
                                                                        <li className="small mb-1 comment" key={items._id || key.id}>
                                                                            <div className="commentBox">
                                                                                <div className="commentHeader">
                                                                                    <Link className="commentHeader" style={{ textDecoration: "none" }} to={`${dashboardUrl}/userProfile/${items.userId._id}`}>
                                                                                        {items.profileId &&
                                                                                            <img src={items.profileId.profileImage} alt="User Avatar" className="commentAvatar" />
                                                                                        }
                                                                                        {items.profileId && <div className="commentuserInfo">
                                                                                            <h3 className="commentUserName" style={{ fontWeight: '700', fontSize: "14px" }}>{items.userId && items.userId.username}</h3>
                                                                                            <h6 className="text-muted" style={{ fontSize: '11px', marginLeft: "10px", marginBottom: "0px" }}>{items.profileId.introContent}</h6>
                                                                                            <span className="text-muted" style={{ marginLeft: "11px", fontSize: '11px' }}>{items.createdAt ?
                                                                                                formatDistanceToNow(new Date(items.createdAt), { addSuffix: true }).replace('about ', '')
                                                                                                : "Just now"}  {items.edit && "• Edited"}</span>
                                                                                        </div>}
                                                                                    </Link>
                                                                                    <button type="button" className="options-btn" data-bs-toggle="modal" data-bs-target="#editComment" style={{ fontSize: "14px" }} onClick={() => { setCommentId(items); setComment(items.comment) }} >
                                                                                        Edit
                                                                                    </button>
                                                                                </div>

                                                                                <div className="commentContent">
                                                                                    {items.profileId && items.profileId.username}
                                                                                    {items.comment}
                                                                                </div>
                                                                            </div>
                                                                        </li>

                                                                    ))}
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
                                        </div >
                                    ))}
                                    {/* EDIT POST MODAL - OUTSIDE THE MAP */}
                                    <div className="modal fade" id="modalEditPost" tabIndex="-1" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit your Post</h5>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <form onSubmit={handleUpdatePost}>
                                                    <div className="modal-body">
                                                        <label htmlFor="editAbout" className="form-label">About Content</label>
                                                        <textarea
                                                            id="editAbout"
                                                            name="postAbout"
                                                            className="form-control"
                                                            rows="4"
                                                            onChange={handleChange}
                                                            value={postAbout || ""}
                                                        />

                                                        <div className="media-uploader mt-4">
                                                            <label htmlFor="editMedia" className="custom-button">
                                                                <input type="file" id="editMedia" accept="image/*,video/*" name="editMedia" hidden onChange={handleChange} />
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
                                                                </svg>

                                                                {file && (
                                                                    selectedFile?.type.startsWith('video/') ? (
                                                                        <video src={file} controls style={{ width: '100%', borderRadius: '8px' }} />
                                                                    ) : (
                                                                        <img src={file} alt="Selected content" style={{ width: '100%', borderRadius: '8px' }} />
                                                                    )
                                                                )}

                                                            </label>

                                                            <div id="preview-container"></div>
                                                        </div>
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal fade" id="editComment" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="editComment">Edit your Post</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <form onSubmit={(e) => { editComments(e) }}>
                                                    <div className="modal-body ">
                                                        <textarea type="text" className="form-control form-control-sm comment" name="comment" onChange={handleChange} value={`${comment}`} />
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                                                        <button type="sumbit" className="btn btn-primary"> Edit </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {allPost.length === 0 ? "There are no public posts to display at the moment." : showAllPost ? <button className="showAllPostBtn" onClick={() => setShowAllPost(!showAllPost)}>Shows Less</button> : <button className="showAllPostBtn" onClick={() => setShowAllPost(!showAllPost)}>Shows All </button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Followers Modal */}
            <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h5 class="modal-title" id="staticBackdropLabel">Showing Followers</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">X</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="followers-list-container" style={{ padding: '20px', maxWidth: '500px' }}>
                                {allFollowers && allFollowers.length > 0 ? (
                                    allFollowers.map((followerProfile) => (
                                        <Link onClick={() => goToFollowersProfile(followerProfile.userId._id)} style={{ textDecoration: "none" }} >
                                            <div className="follower-bar" key={followerProfile._id}>
                                                <img
                                                    className="bar-image"
                                                    src={followerProfile.profileImage}
                                                    alt="Profile"
                                                />

                                                <div className="bar-info">
                                                    <h3 className="bar-username">
                                                        {followerProfile.userId?.username || "Gym Member"}
                                                    </h3>

                                                    <p className="bar-headline">
                                                        {followerProfile.introContent || "No bio available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>No followers yet. Time to hit the gym!</p>
                                )}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Followings Modals */}

            <div class="modal fade" id="staticBackdropFollowings" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h5 class="modal-title" id="staticBackdropLabelFollowings">Showing Followers</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">X</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div className="followers-list-container" style={{ padding: '20px', maxWidth: '500px' }}>
                                {allFollowings && allFollowings.length > 0 ? (
                                    allFollowings.map((followerProfile) => (
                                        <Link onClick={() => goToFollowersProfile(followerProfile.userId._id)} style={{ textDecoration: "none" }}>
                                            <div className="follower-bar" key={followerProfile._id}>
                                                <img
                                                    className="bar-image"
                                                    src={followerProfile.profileImage}
                                                    alt="Profile"
                                                />

                                                <div className="bar-info">
                                                    <h3 className="bar-username">
                                                        {followerProfile.userId?.username || "Gym Member"}
                                                    </h3>

                                                    <p className="bar-headline">
                                                        {followerProfile.introContent || "No bio available"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p>No followings yet. Time to hit the gym!</p>
                                )}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <div className="modal fade" id="leaveConnectionConfirmModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    {/* Soft Red Background and Border */}
                    <div className="modal-content" style={{ width: "50vh", backgroundColor: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "12px" }}>

                        <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "none", padding: "20px 20px 10px" }}>
                            {/* Deep Red Title */}
                            <h5 className="modal-title" id="exampleModalLongTitle" style={{ color: "#c53030", fontWeight: "bold" }}>
                                Leave Connection?
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" style={{ fontSize: "0.8rem" }}></button>
                        </div>

                        <div className="modal-body" style={{ textAlign: "center", paddingBottom: "0px" }}>
                            <img
                                src={`${connectionProfile?.connectedTo?.profileImage}`}
                                alt="Avatar"
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    borderRadius: "50%",
                                    backgroundColor: "#f8f9fa",
                                    marginBottom: "16px",
                                    border: "3px solid #fc8181" // Red ring around profile
                                }}
                            />
                            <p style={{ color: "#742a2a", fontSize: "0.95rem" }}>
                                Are you sure you want to end this connection? This action is permanent.
                            </p>
                        </div>

                        <div className="modal-footer" style={{ borderTop: "none", justifyContent: "center", padding: "20px" }}>
                            {/* Cancel Button */}
                            <button
                                type="button"
                                className="btn"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                style={{ backgroundColor: "#edf2f7", color: "#4a5568", fontWeight: "600", marginRight: "10px" }}
                            >
                                Cancel
                            </button>

                            {/* Confirm Action Button */}
                            <button
                                type="button"
                                className="btn confirmBtn"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => { leaveConnection() }}
                                style={{ backgroundColor: "#e53e3e", color: "white", fontWeight: "600", padding: "8px 24px" }}
                            >
                                Yes, Leave
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {wait && <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "340px" }}>
                    <div className="modal-content" style={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}>

                        <div className="modal-body text-center p-4">
                            {/* Simple Centered Avatar */}
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                className="empty-state-video"
                                style={{
                                    maxWidth: "25vh",
                                    mixBlendMode: "multiply",
                                    filter: "grayscale(20%)"
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/circle-loader-animation-gif-download-4603867.mp4'}
                            />
                            <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                                <h6><b>Syncing Your Goals...</b></h6><i class="fa-regular fa-handshake fa-bounce" style={{ color: "#10b981" }}></i>
                                <p style={{
                                    color: "#475569",
                                    fontSize: "0.95rem",
                                    lineHeight: "1.5",
                                    fontWeight: "500",
                                    margin: "0",
                                    fontStyle: "italic"
                                }}>
                                    "Sophisticated and clean. It sounds like a secure handshake is happening in the background.."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}


            {success && <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "340px" }}>
                    <div className="modal-content" style={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}>

                        <div className="modal-body text-center p-4">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                className="empty-state-video"
                                style={{
                                    maxWidth: "25vh",
                                    mixBlendMode: "multiply",
                                    filter: "grayscale(20%)"
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/success-animation-gif-download-7271807.mp4'}
                            />
                            <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                                <h6><b>Congratulations</b></h6><i class="fa-regular fa-handshake fa-bounce" style={{ color: "#10b981" }}></i>
                                <p style={{
                                    color: "#475569",
                                    fontSize: "0.95rem",
                                    lineHeight: "1.5",
                                    fontWeight: "500",
                                    margin: "0",
                                    fontStyle: "italic"
                                }}>
                                    "Shared vision. Accelerated progress. <br /> Your journey just gained a partner."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}

            {showWarning && <div class="modal-backdrop">
                <div class="warning-modal">
                    <div class="warning-icon">⚠️</div>

                    <div class="message-primary btn-warning">Caution: Your Gym-Buddy Already Exist!!!</div>
                    <div class="message-secondary">If you want to connect first leave your current gym buddy</div>

                    <div class="button-group mt-4">
                        <button class="btn-cancel buttons" onClick={() => { setShowWarning(!showWarning) }} >Cancel</button>
                    </div>
                </div>
            </div>}
        </>
    );
}

export default Hero;