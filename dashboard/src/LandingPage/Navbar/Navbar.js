// import axios from 'axios';
// import { useState, useEffect } from 'react';
// import { toast } from "react-toastify";
// import { Link, useNavigate } from 'react-router-dom';
// import { jwtDecode } from "jwt-decode";
// import imageCompression from "browser-image-compression";
// import { io } from "socket.io-client"; // 1. Import Socket.io

// const frontendUrl = "http://localhost:3000";
// const backendUrl = "http://localhost:3001";
// const dashboardUrl = "http://localhost:3002";

// const socket = io(backendUrl);

// const Navbar = ({ setSearch }) => {
//   const [userData, setUserData] = useState(null);
//   const [postData, setPostData] = useState({
//     about: "",
//     media: "",
//     userId: "",
//   });
//   const [file, setFile] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   // const [notifications, setNotifications] = useState([]); // 3. State for notifications
//   const [isNewNotification, setIsNewNotification] = useState(false);
//   const [isFormFilled, setIsFormFilled] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (userData?._id) {
//       // 1. Register
//       socket.emit("register_user", userData._id);
//       console.log("Sent register_user for:", userData._id);
//     }

//     // 2. Define the listener function
//     const handleNewNotif = (notif) => {
//       console.log("!!! NOTIFICATION RECEIVED IN NAVBAR !!!", notif);

//       const audio = new Audio("https://res.cloudinary.com/duogcdkyj/video/upload/v1776371696/universfield-new-notification-040-493469_di5zxj.mp3");
//       audio.volume = 0.7; // Keep it subtle (40% volume)
//       audio.play().catch(err => console.log("User interaction required for audio."));

//       // setNotifications((prev) => [notif, ...prev]);
//       toast(`🔔 ${notif.content}`, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: false,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//         theme: "light",
//       });
//       // toast.info(`🔔 ${notif.content}`);
//       setIsNewNotification(true);
//     };

//     // 3. Attach listener
//     socket.on("new_notification", handleNewNotif);

//     // 4. Cleanup
//     return () => {
//       socket.off("new_notification", handleNewNotif);
//     };
//   }, [userData?._id]); // Only reset if the user changes

//   console.log(userData);

//   // STEP 1: Catch and Save the Token
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const tokenFromUrl = urlParams.get('token');

//     if (tokenFromUrl) {
//       localStorage.setItem('token', tokenFromUrl);
//       // Clean the URL
//       window.history.replaceState({}, document.title, "/");

//       // Manually trigger fetchUser once we know we have the token!
//       fetchUser(tokenFromUrl);
//     } else {
//       // If no token in URL, check if one already exists in localStorage
//       const existingToken = localStorage.getItem('token');
//       if (existingToken) {
//         fetchUser(existingToken);
//       }
//     }
//   }, []); // Empty array means this runs ONCE when the page loads

//   console.log(isFormFilled);

//   const fetchUser = async (tokenToUse) => {
//     // Use the token passed in, or grab from storage
//     const token = tokenToUse || localStorage.getItem('token');

//     // Safety check: don't call backend if token is empty/null/undefined
//     if (!token || token === "undefined" || token === "null") {
//       return;
//     }

//     try {
//       const res = await axios.get(`${backendUrl}/user/me`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserData(res.data);
//       setIsFormFilled(res.data.hasCompleteProfile);
//       // postData.userId = res.data._id;
//       // setPostData({ ...postData, ["userId"]: res.data._id });
//       // setPostData({ ...postData, ["profileId"]: res.data.profileId });
//       setPostData(prev => ({
//         ...prev,
//         userId: res.data._id,
//         profileId: res.data.profileId
//       }));
//     } catch (err) {
//       console.error("Fetch User Error:", err);
//       localStorage.removeItem('token');
//       window.location.href = `${frontendUrl}/login`;
//     }
//   };

//   const handlelogout = () => {
//     localStorage.clear();
//     setUserData(null); // Clear state
//     // Bounce to 3000 to clear it, which then stops at 3000/login
//     window.location.href = `${frontendUrl}/logout-sync`;
//   };

//   // const handleSumbit = async (e) => {
//   //   e.preventDefault();
//   //   if (!selectedFile && !postData.about) {
//   //     e.preventDefault();
//   //     return toast.info("Cannot create empty Post");
//   //   }

//   //   try {
//   //     let fileUpload = selectedFile;

//   //     if (selectedFile) {
//   //       // 1. Logic for IMAGES (Compress them)
//   //       if (selectedFile.type.startsWith('image/')) {
//   //         const option = {
//   //           maxSizeMb: 1,
//   //           maxWidthOrHeight: 1024,
//   //           useWebWorker: true
//   //         };
//   //         toast.info("Compressing Image...");
//   //         fileUpload = await imageCompression(selectedFile, option);
//   //       }

//   //       // 2. Logic for VIDEOS (Don't compress, just validate size)
//   //       else if (selectedFile.type.startsWith('video/')) {
//   //         if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
//   //           return toast.error("Video is too large! Max 50MB.");
//   //         }
//   //         fileUpload = selectedFile; // Send the original video file
//   //       }
//   //     }

//   //     const formData = new FormData();

//   //     formData.append("about", postData.about);
//   //     formData.append("userId", postData.userId);
//   //     formData.append("profileId", postData.profileId);

//   //     if (fileUpload) {
//   //       formData.append("media", fileUpload); // ✅ IMPORTANT
//   //     }

//   //     console.log(formData);
//   //     toast.info("Ruko post create ho raha hai...");

//   //     const res = await axios.post(`${backendUrl}/postContent`, formData, {
//   //       timeout: 60000, // 60s (your comment said 60 but you used 6000)
//   //       headers: {
//   //         "Content-Type": "multipart/form-data"
//   //       }
//   //     });

//   //     console.log(res);

//   //     // Reset form
//   //     setFile(null);
//   //     setSelectedFile(null);
//   //     setPostData({ ...postData, about: "" });
//   //     window.location.reload();
//   //     toast.success("Post Created");

//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error(error.response?.status === 400 ? "Empty post not allowed" : "Post Not Created");
//   //   }
//   // };


//   const uploadToCloudinary = async (file) => {
//     const sigRes = await axios.get(`${backendUrl}/cloudinary-signature`);

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("api_key", sigRes.data.apiKey);
//     formData.append("timestamp", sigRes.data.timestamp);
//     formData.append("signature", sigRes.data.signature);

//     return axios.post(
//       `https://api.cloudinary.com/v1_1/${sigRes.data.cloudName}/auto/upload`,
//       formData,
//       {
//         onUploadProgress: (e) => {
//           const percent = Math.round((e.loaded * 100) / e.total);
//           setUploadProgress(percent);
//         }
//       }
//     );
//   };

//   const handleSumbit = async (e) => {
//     e.preventDefault();

//     if (!selectedFile && !postData.about) {
//       return toast.info("Cannot create empty Post");
//     }

//     try {
//       let mediaUrl = "";

//       if (selectedFile) {
//         if (selectedFile.size > 20 * 1024 * 1024) {
//           return toast.error("Max 20MB allowed");
//         }

//         toast.info("Uploading... ⏳");

//         const uploadRes = await uploadToCloudinary(selectedFile);
//         mediaUrl = uploadRes.data.secure_url;
//       }

//       await axios.post(`${backendUrl}/postContent`, {
//         about: postData.about,
//         userId: postData.userId,
//         profileId: postData.profileId,
//         media: mediaUrl
//       });

//       setUploadProgress(0);
//       setFile(null);
//       setSelectedFile(null);
//       setPostData({ ...postData, about: "" });

//       toast.success("Post Created 🚀");

//     } catch (err) {
//       console.log(err);
//       toast.error("Upload failed");
//     }
//   };


//   const giveWarning = async (e) => {
//     try {
//       console.log(e);
//       if (e.type === 'click' && isFormFilled === false) {
//         window.alert("Hold On! 🏋️‍♂️ It looks like you're trying to jump ahead, but your Gym Routine is still empty. To give you the best experience and unlock the full potential of our features, please take a moment to fill out your routine first.It only takes a minute, and it ensures everything else on the site works perfectly for your goals!");
//         // setTimeout(() => { navigate("/complete-profile") }, 3000);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     if (name === "media" && files[0]) {
//       setFile(URL.createObjectURL(files[0])); // For the preview
//       setSelectedFile(files[0]); // Save raw file for compression later
//       return;
//     }

//     setPostData((prev) => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => { fetchUser() }, []);

//   return (
//     <>
//       < nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "white", height: "4rem", border: "none", boxShadow: "none" }}>
//         <div className="container-fluid" >
//           <div className="navbar-logo-input">
//             <Link className="navbar-brand" to={"http://localhost:3000"}><i className="fa-solid fa-dumbbell" style={{ color: "red", height: "2rem", width: "2rem" }}> < span style={{ color: "#848080ff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></i> </Link>
//             <input placeholder='Enter your Interset' className="searchbar" onChange={(e) => setSearch(e.target.value)} />
//           </div>
//           <button className="navbar-toggler" type="button" style={{ border: "none", color: "white" }} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//             <span style={{ border: "none", color: "white" }} className="navbar-toggler-icon"></span>
//           </button>
//           <div style={{ backgroundColor: 'white', border: "none" }} className="collapse navbar-collapse" id="navbarSupportedContent">
//             <ul className="navbar-nav mb-2 mb-lg-0" style={{ margin: "0 auto", backgroundColor: "white" }}>
//               <li className="nav-item" onClick={(e) => { giveWarning(e) }}>
//                 <Link className="nav-link active m-1.5" aria-current="page" to={isFormFilled && "/"}>Home</Link >
//               </li>

//               <li className="nav-item" onClick={(e) => { giveWarning(e) }}>
//                 <Link className="nav-link active m-1.5" aria-current="page" to={isFormFilled && "/allContent"}>All Users</Link >
//               </li>

//               <li className="nav-item" onClick={(e) => { giveWarning(e) }}>
//                 <Link className="nav-link active m-1.5" to={isFormFilled && "/update-profile"}>Update Your Routine</Link >
//               </li>

//               <li className="nav-item" onClick={(e) => { giveWarning(e) }}>
//                 {
//                   isFormFilled ? <Link type="button" className='nav-link active m-1.5' data-bs-toggle="modal" data-bs-target="#exampleModalCenter"> Create a Post </Link>
//                     :
//                     <Link type="button" className='nav-link active m-1.5'> Create a Post </Link>
//                 }
//               </li>

//               {userData && (
//                 <div className="dropdown user-profile">
//                   {/* The clickable area (Trigger) */}
//                   <div
//                     className="d-flex align-items-center dropdown-toggle"
//                     id="userDropdown"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                     style={{ cursor: 'pointer' }}
//                   >
//                     <div className="user-info me-2 d-none d-sm-block text-end">
//                       <div className="user-name fw-bold" style={{ fontSize: '0.9rem' }}>
//                         {/* {userData.username} */}
//                       </div>
//                     </div>

//                     <img
//                       className="avatar rounded-circle"
//                       src={`https://ui-avatars.com/api/?name=${userData.username}&background=random&color=fff`}
//                       alt="Avatar"
//                       width="40"
//                       height="40"
//                     />
//                   </div>

//                   {/* The Menu */}
//                   <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
//                     <li>
//                       <h6 className="dropdown-header">Signed in as {userData.email}</h6>
//                     </li>
//                     <li><a className="dropdown-item" href={`${dashboardUrl}/userProfile/${userData._id}`}>My Profile</a></li>
//                     <li><a className="dropdown-item" href='/savedPosts'>Saved Posts</a></li>
//                     {/* 6. Rendering Notifications in the list */}

//                     {isNewNotification ?
//                       <li><Link to={`/notifications/${userData._id}`} style={{ textDecoration: "none" }}><span className="dropdown-item-text small" style={{ color: "red" }}> New Notification 🔔</span></Link></li> :
//                       <li><Link to={`/notifications/${userData._id}`} style={{ textDecoration: "none" }}><span className="dropdown-item-text small text-muted">No new notifications</span></Link></li>
//                     }

//                     {/* {notifications.length === 0 ? (
//                       <li><span className="dropdown-item-text small text-muted">No new notifications</span></li>
//                     ) : (
//                       notifications.slice(0, 5).map((n, i) => (
//                         <li key={i}><span className="dropdown-item small border-bottom">{n.content}</span></li>
//                       ))
//                     )}; */}
//                     <li><hr className="dropdown-divider" /></li>
//                     <button
//                       className="dropdown-item text-danger"
//                       onClick={() => { handlelogout() }}
//                     >
//                       Logout
//                     </button>
//                   </ul>
//                 </div>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav >

//       <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
//         <div className="modal-dialog modal-dialog-centered" role="document">
//           <div className="modal-content">
//             <div className="modal-header modalHeader">
//               <h5 className="modal-title" id="exampleModalLongTitle">Make a Post</h5>
//               <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
//                 <span aria-hidden="true" className='closeBtn'>X</span>
//               </button>
//             </div>
//             <div className="modal-body">
//               <form onSubmit={handleSumbit}>

//                 <label htmlFor="about" className="about">About Content</label>
//                 <textarea name="about" id="about" className="form-control mt-2" placeholder="Write about yourself..." onChange={handleChange} />

//                 <div className="media-uploader mt-3 mb-2">
//                   <label htmlFor="media-input" className="custom-button">
//                     <input type="file" id="media-input" accept="image/*,video/*" name="media" hidden onChange={handleChange} />
//                     <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//                       <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
//                     </svg>

//                     {file && (
//                       selectedFile?.type.startsWith('video/') ? (
//                         <video src={file} controls style={{ width: '100%', borderRadius: '8px' }} />
//                       ) : (
//                         <img src={file} alt="Selected content" style={{ width: '100%', borderRadius: '8px' }} />
//                       )
//                     )}

//                   </label>

//                   <div id="preview-container"></div>
//                 </div>

//                 <div className="modal-footer">
//                   <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
//                   <button type="submit" className="btn btn-primary">Save changes</button>
//                 </div>
//               </form>
//               {uploadProgress > 0 && (
//                 <div className="progress mt-2">
//                   <div
//                     className="progress-bar"
//                     style={{ width: `${uploadProgress}%` }}
//                   >
//                     {uploadProgress}%
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Navbar;

import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import { jwtDecode } from 'jwt-decode';

const frontendUrl = "https://findbuddy-lsdc.onrender.com";
const backendUrl = "https://findbuddy-back.onrender.com";
const dashboardUrl = "https://findbuddy-dash.onrender.com";

// Initialize socket outside or in a useMemo to prevent multiple instances
const socket = io(backendUrl, { autoConnect: false });

const Navbar = ({ setSearch }) => {
  const [userData, setUserData] = useState(null);
  const [isPostUploaded, setIsPostUploaded] = useState(false);
  const [postData, setPostData] = useState({ about: "", media: "", userId: "", profileId: "" });
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isNewNotification, setIsNewNotification] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [checkConnection, setCheckConnection] = useState([]);
  const [requestFromArr, setRequestFromArr] = useState([]);
  const [success, setSuccess] = useState(false);
  const [wait, setWait] = useState(false);
  const [isRequest, setIsRequest] = useState([]);
  const navigate = useNavigate();

  // Optimized Fetch User function
  const fetchUser = useCallback(async (tokenToUse) => {
    const token = tokenToUse || localStorage.getItem('token');

    if (!token || token === "undefined" || token === "null") return;

    try {
      const res = await axios.get(`${backendUrl}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const decode = jwtDecode(token).id;

      setUserData(res.data);
      if (res.data.connectionId) {
        const connection = await axios.post("https://findbuddy-back.onrender.com/checkConnections", { connectionId: res.data.connectionId });
        setCheckConnection(connection.data.userConnection);
        setRequestFromArr(connection.data.userConnection.requestFrom);
      }
      setIsFormFilled(res.data.hasCompleteProfile);

      // Update state correctly (avoiding direct mutation)
      setPostData(prev => ({
        ...prev,
        userId: res.data._id,
        profileId: res.data.profileId
      }));

    } catch (err) {
      console.error("Fetch User Error:", err);
      localStorage.removeItem('token');
      window.location.href = `${frontendUrl}/login`;
    }
  }, []);

  // Handle Token from URL and Initialization
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, "/");
      fetchUser(tokenFromUrl);
    } else {
      fetchUser();
    }
  }, [fetchUser]);

  // Socket.io Lifecycle
  useEffect(() => {
    if (userData?._id) {
      socket.connect();
      socket.emit("register_user", userData._id);

      const handleNewNotif = (notif) => {
        const audio = new Audio("https://res.cloudinary.com/duogcdkyj/video/upload/v1776371696/universfield-new-notification-040-493469_di5zxj.mp3");
        audio.volume = 0.7;
        audio.play().catch(() => console.log("Interaction required for audio"));

        toast(`🔔 ${notif.content}`);
        setIsNewNotification(true);
      };

      socket.on("new_notification", handleNewNotif);

      return () => {
        socket.off("new_notification", handleNewNotif);
        socket.disconnect();
      };
    }
  }, [userData?._id]);

  const handlelogout = () => {
    localStorage.clear();
    setUserData(null);
    socket.disconnect();
    window.location.href = `${frontendUrl}/logout-sync`;
  };

  const uploadToCloudinary = async (file) => {
    const sigRes = await axios.get(`${backendUrl}/cloudinary-signature`);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sigRes.data.apiKey);
    formData.append("timestamp", sigRes.data.timestamp);
    formData.append("signature", sigRes.data.signature);

    return axios.post(
      `https://api.cloudinary.com/v1_1/${sigRes.data.cloudName}/auto/upload`,
      formData,
      {
        onUploadProgress: (e) => {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
        }
      }
    );
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    if (!selectedFile && !postData.about) return toast.info("Cannot create empty Post");

    try {
      let mediaUrl = "";
      if (selectedFile) {
        if (selectedFile.size > 20 * 1024 * 1024) return toast.error("Max 20MB allowed");
        toast.info("Uploading... ⏳");
        const uploadRes = await uploadToCloudinary(selectedFile);
        mediaUrl = uploadRes.data.secure_url;
      }

      await axios.post(`${backendUrl}/postContent`, {
        ...postData,
        media: mediaUrl
      });

      // Cleanup post UI
      setUploadProgress(0);
      setFile(null);
      setSelectedFile(null);
      setPostData(prev => ({ ...prev, about: "" }));
      toast.success("Post Created 🚀");
      setTimeout(() => { window.location.reload() }, 3000);
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  // const giveWarning = (e) => {
  //   if (!isFormFilled) {
  //     e.preventDefault(); // Prevents <Link> navigation
  //     toast.warn("Hold On! 🏋️‍♂️ Please complete your Gym Routine first to unlock all features.");
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "media" && files[0]) {
      setFile(URL.createObjectURL(files[0]));
      setSelectedFile(files[0]);
      return;
    }
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const connectUser = async () => {
    try {
      setWait(true);
      const data = {
        loggedUserId: userData._id,
        userId: checkConnection.requestFrom[0]._id,
        loggedUserConnectionId: userData.connectionId,
        userConnectionId: checkConnection.requestFrom[0].connectionId,
      }

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

  const rejectRequest = async () => {
    try {
      const connectionsIds = { connectionId: userData.connectionId };
      const deleteConnection = await axios.post("https://findbuddy-back.onrender.com/rejectRequest", connectionsIds);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "white", height: "4rem", border: "none", boxShadow: "none" }}>
        <div className="container-fluid">
          <div className="navbar-logo-input">
            <Link className="navbar-brand" to="/"><i className="fa-solid fa-dumbbell" style={{ color: "red", height: "2rem", width: "2rem" }}> <span style={{ color: "#848080ff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></i> </Link>
            <input placeholder='Enter your Interest' className="searchbar" onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ backgroundColor: 'white' }}>
            <ul className="navbar-nav mb-2 mb-lg-0" style={{ margin: "0 auto", alignItems: "inherit" }}>
              <li className="nav-item" style={{ marginRight: "2.5px" }} >
                <Link className="nav-link active m-1.5" to="/" >Home</Link>
              </li>
              <li className="nav-item" style={{ marginRight: "2.5px" }} >
                <Link className="nav-link active m-1.5" to="/allContent" >All Users</Link>
              </li>
              <li className="nav-item" style={{ marginRight: "7px" }} >
                <Link
                  className='nav-link active m-1.5'
                  to="#"
                  data-bs-toggle={isFormFilled ? "modal" : ""}
                  data-bs-target={isFormFilled ? "#exampleModalCenter" : ""}
                >
                  Create a Post
                </Link>
              </li>
              <li className="nav-item" style={{ marginRight: "2.5px" }} >
                <Link className="nav-link active m-1.5" to="/update-profile" >Update Your Routine</Link>
              </li>

              {userData && (
                <div className="dropdown user-profile">
                  <div className="d-flex align-items-center dropdown-toggle" id="userDropdown" data-bs-toggle="dropdown" style={{ cursor: 'pointer' }}>
                    <img
                      className="avatar rounded-circle"
                      src={`https://ui-avatars.com/api/?name=${userData.username}&background=random&color=fff`}
                      alt="Avatar" width="40" height="40"
                    />
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                    <li><h6 className="dropdown-header">Signed in as {userData.email}</h6></li>
                    <li><a className="dropdown-item" href={`${dashboardUrl}/userProfile/${userData._id}`}>My Profile</a></li>
                    <li><Link className="dropdown-item" to='/savedPosts'>Saved Posts</Link></li>
                    <li>
                      <Link to={`/notifications/${userData._id}`} className="dropdown-item">
                        {isNewNotification ?
                          <span style={{ color: "red" }}>New Notification 🔔</span> :
                          <span className="text-muted">Notifications</span>
                        }
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handlelogout}>Logout</button></li>
                  </ul>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal for Post Creation */}
      <div className="modal fade" id="exampleModalCenter" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header modalHeader">
              <h5 className="modal-title">Make a Post</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSumbit}>
                <label htmlFor="about" className="about">Content Description</label>
                <textarea
                  name="about"
                  id="about"
                  value={postData.about}
                  className="form-control mt-2"
                  placeholder="What's on your mind?"
                  onChange={handleChange}
                />

                <div className="media-uploader mt-3 mb-2">
                  <label htmlFor="media-input" className="custom-button" style={{ cursor: 'pointer' }}>
                    <input type="file" id="media-input" accept="image/*,video/*" name="media" hidden onChange={handleChange} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
                    </svg>
                    <span> {selectedFile ? "Change Media" : "Add Media"}</span>
                  </label>

                  {file && (
                    <div className="mt-2">
                      {selectedFile?.type.startsWith('video/') ?
                        <video src={file} controls style={{ width: '100%', borderRadius: '8px' }} /> :
                        <img src={file} alt="Preview" style={{ width: '100%', borderRadius: '8px' }} />
                      }
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary">Post</button>
                </div>
              </form>
              {uploadProgress > 0 && (
                <div className="progress mt-2">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${uploadProgress}%` }}>
                    {uploadProgress}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {checkConnection.isAnyRequest && (
        <div className="modal show" style={{ display: "block", background: "rgba(0, 0, 0, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "340px" }}>
            <div className="modal-content" style={{
              borderRadius: "16px",
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
            }}>

              <div className="modal-body text-center p-4">
                <img
                  src={`${checkConnection.requestFrom[0]?.profileId?.profileImage}`}
                  alt="Avatar"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#f8f9fa",
                    marginBottom: "16px"
                  }}
                />

                <Link to={`/userprofile/${checkConnection?.requestFrom[0]?._id}`} style={{ textDecoration: "none" }} ><h5 style={{ fontWeight: "600", color: "#111", marginBottom: "4px" }}>
                  {checkConnection?.requestFrom[0]?.username}
                </h5></Link>
                <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                  <p style={{
                    color: "#475569",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                    fontWeight: "500",
                    margin: "0",
                    fontStyle: "italic"
                  }}>
                    "Twin goals, one grind. <br /> Let’s do this journey together."
                  </p>
                </div>

                <div className="d-flex" style={{ gap: "12px" }}>
                  <button
                    type="button"
                    className="btn w-100"
                    style={{
                      borderRadius: "16px",
                      padding: "14px",
                      backgroundColor: wait ? "#4e9b81" : "#10b981",
                      color: "#ffffff",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                      border: "none",
                      boxShadow: wait ? "0 10px 20px -5px rgba(72, 180, 144, 0.39)" : "0 10px 20px -5px rgba(16, 185, 129, 0.4)"
                    }} onClick={() => connectUser()}
                  >
                    {wait ? "Please Wait" : "Connect"}
                  </button>
                  <button
                    type="button"
                    className="btn w-100"
                    style={{
                      borderRadius: "16px",
                      padding: "14px",
                      backgroundColor: "#fef2f2",
                      color: "#ef4444",
                      border: "1px solid #fee2e2",
                      fontWeight: "700",
                      fontSize: "0.9rem",
                      transition: "all 0.2s"
                    }}
                    onClick={() => { rejectRequest(); window.location.reload(); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )} */}
    </>
  );
}

export default Navbar;