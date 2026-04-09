import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import React, { useState, useEffect } from "react";

function Hero() {
    const [postId, setPostId] = useState();
    const [ready, setReady] = useState(false);
    const [comment, setComment] = useState("");
    const token = jwtDecode(localStorage.token);
    const [postUser, setPostUser] = useState([]);
    const [allPost, setAllPost] = useState(null);
    const [allComment, setAllComment] = useState();
    const [commentUser, setCommentUser] = useState();
    const [activePostId, setActivePostId] = useState(null);
    const [commentId, setCommentId] = useState();

    console.log(allPost);
    console.log(allComment);
    console.log(comment, postId);

    const toggleComments = async (postId) => {
        setActivePostId(prevId => (prevId === postId ? null : postId));
        const postComments = await axios.post("http://localhost:3001/userPostComments", { postId: postId });
        const response = await axios.post("http://localhost:3001/user", { id: token.id });
        console.log(response);
        setCommentUser(response.data)
        setAllComment(postComments.data.allComments);
        console.log(postComments);
    };

    const fetchAllPost = async () => {
        try {
            const response = await axios.get("http://localhost:3001/allPost");
            const sortedArray = response.data.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : 0;
                const dateB = b.createdAt ? new Date(b.createdAt) : 0;
                return dateB - dateA;
            });

            console.log(sortedArray);
            setAllPost(sortedArray);
            setReady(true);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // const fetchUser = async () => {
    //     try {
    //         const response = await axios.post("http://localhost:3001/user", { id: token.id });
    //         console.log(response);
    //         // setPostUser(response.data);
    //     } catch (error) {
    //         console.error("Error fetching posts:", error);
    //     }
    // };

    // useEffect(() => { fetchUser() }, []);

    const goToProfile = () => {
        try {
            window.location.redirect = "http://localhost:3002/userProfile"
        } catch (error) {
            console.log(error);
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
            console.log(data);
            const res = await axios.post("http://localhost:3001/comment", data);
            console.log(res);
            window.location.reload();
            setComment(null);
        } catch (error) {
            console.log(error);
        }
    }

    const postsId = async (items) => {
        return setPostId(items);
    }

    const handleChange = async (e) => {
        e.preventDefault();
        return setComment(e.target.value);
    }

    const editComments = async (items) => {
        try {
            console.log("EditComment ", comment);
            const id = items._id;
            const data = {
                "editComment": comment,
                "commentId": id,
            };
            console.log(data);
            const res = await axios.post("http://localhost:3001/editComment", data);
            console.log(res);
        } catch (error) {
            e.preventDefault();
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllPost();
    }, []);

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
            {allPost.map((items) => (
                <div className="container mt-4 mb-4" key={items._id} >
                    <div className="row">
                        <div className="col-lg-12 post">
                            <div className="linkedin-card mt-4">
                                <Link className="postHeader" to={`http://localhost:3002/userProfile/${items.userId._id}`}>
                                    <div className="post-header">
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
                                                            <Link className="commentHeader" style={{ textDecoration: "none" }} to={`http://localhost:3002/userProfile/${items.userId._id}`}>
                                                                {items.profileId &&
                                                                    <img src={items.profileId.profileImage} alt="User Avatar" className="commentAvatar" />
                                                                }
                                                                {items.profileId && <div className="commentuserInfo">
                                                                    <h3 className="commentUserName" style={{ fontWeight: '700', fontSize: "14px" }}>{items.userId && items.userId.username}</h3>
                                                                    <h6 className="text-muted" style={{ fontSize: '11px', marginLeft: "10px", marginBottom: "0px" }}>{items.profileId.introContent}</h6>
                                                                    <span className="text-muted" style={{ marginLeft: "11px", fontSize: '11px' }}>{items.createdAt ?
                                                                        formatDistanceToNow(new Date(items.createdAt), { addSuffix: true }).replace('about ', '')
                                                                        : "Just now"} • <i className="fas fa-globe-americas"></i></span>
                                                                </div>}
                                                            </Link>
                                                            <button type="button" class="options-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style={{ fontSize: "14px" }} onClick={() => { setComment(items.comment) }} >
                                                                Edit
                                                            </button>
                                                        </div>

                                                        <div className="commentContent">
                                                            {items.profileId && items.profileId.username}
                                                            {items.comment}
                                                        </div>
                                                    </div>
                                                    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                        <div class="modal-dialog modal-dialog modal-dialog-centered">
                                                            <div class="modal-content">
                                                                <div class="modal-header">
                                                                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                                </div>
                                                                <form onSubmit={() => { editComments(items) }}>
                                                                    <div class="modal-body ">
                                                                        <input type="text" className="form-control form-control-sm comment" name="comment" onChange={handleChange} value={`${comment}`} />
                                                                    </div>
                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" >Close</button>
                                                                        <button type="sumbit" class="btn btn-primary"> Edit </button>
                                                                    </div>
                                                                </form>
                                                            </div>
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
        </>
    );
}

export default Hero;