import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from 'date-fns';
import React, { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

function Hero() {
    const [ready, setReady] = useState(false);
    const [postId, setPostId] = useState();
    const [comment, setComment] = useState("");
    const token = jwtDecode(localStorage.token);
    const [postUser, setPostUser] = useState([]);
    const [allPost, setAllPost] = useState(null);
    const [allComment, setAllComment] = useState();
    const [commentUser, setCommentUser] = useState();
    const [activePostId, setActivePostId] = useState(null);
    const [commentId, setCommentId] = useState();
    const [postAbout, setPostAbout] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingPost, setEditingPost] = useState(null);

    const dashboardUrl = "http://localhost:3002";
    const backendUrl = "http://localhost:3001";

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

    const handleSumbit = async () => {
        try {
            console.log(items);
        } catch (error) {
            console.log(error);
        }
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

    const handleChange = (e) => {
        const { name, value, files } = e.target;

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
    };

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

    const deleteComment = async (id) => {
        try {
            const deletedComment = await axios.post("http://localhost:3001/deletePostComment", { id: id });
            console.log(deletedComment);
            setAllComment(deletedComment.data.allComment);
        } catch (error) {
            console.log(error);
        }
    }

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

    const repostContent = async (post) => {
        try {
            console.log(post);
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

    if (allPost.length === 0) {
        return (
            <>
                {/* <div className="container NotFound" style={{ userSelect: "none" }}>

                    <div className="row">

                        <div className="col-lg-12 col-md-12" style={{ display: "flex", justifyContent: "center" }}>
                            <img className="notFoundImage" src="https://img.freepik.com/premium-vector/empty-cart-illustration-perfect-user-interface-uiux-projects_854078-2080.jpg?w=1480" alt="EmptyCart" />
                        </div>

                        <div className="colo-lg-6" style={{ textAlign: "center" }}>
                            <h2>No posts to show</h2>
                            <p>Discover new connections to fill this space with industry news and updates</p>
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
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/empty-cart-animation-gif-download-8514509.mp4'}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="col-lg-6 text-center">
                            <h2 style={{ fontWeight: "600", letterSpacing: "-0.02em", color: "#111" }}>
                                No posts to show
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                                Discover new connections to fill this space with industry news and updates
                            </p>
                        </div>

                    </div>
                </div>
            </>
        )
    };

    return (
        <>
            {allPost.map((items) => (
                <div className="container" key={items._id} >
                    <div className="row mt-4">
                        <div className="col-lg-12 post">
                            <div className="linkedin-card">
                                <div className="post-header">
                                    <Link className="postHeader" to={`${dashboardUrl}/userProfile/${items.userId._id}`}>
                                        {items.profileId &&
                                            <img src={items.profileId?.profileImage} alt="User Avatar" className="avatar" />
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

                                    <button className="action-item" onClick={() => { repostContent(items) }}>
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
                                                            <div className="userInfo">
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
                                                            </div>

                                                            <div className="EditDelete-btn">
                                                                <div className="edit">
                                                                    <button type="button" className="options-btn" data-bs-toggle="modal" data-bs-target="#editComment" style={{ fontSize: "14px" }} onClick={() => { setCommentId(items); setComment(items.comment) }} >
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                                <br />
                                                                <div className="delete">
                                                                    <button type="button" className="options-btn" style={{ fontSize: "14px", color: '#d72929' }} onClick={() => { deleteComment(items._id) }}>
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </div>

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
                    <div className="mb-4"></div>
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
        </>
    );
}

export default Hero;