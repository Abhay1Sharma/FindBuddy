import React, { useState, useEffect } from 'react'
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Hero() {
    const Id = useParams();
    const [formData, setFormData] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [ready, setReady] = useState(false);
    const userId = userInfo._id;

    const createTimeStamp = userProfile.createdAt;
    const createDate = new Date(createTimeStamp);
    const updateTimeStamp = userProfile.updatedAt;
    const updateDate = new Date(updateTimeStamp);
    const navigate = useNavigate();

    // Get a human-readable Date
    const createAtDate = createDate.toLocaleDateString();
    const updateAtDate = updateDate.toLocaleDateString();
    const [content, setContent] = useState({
        intro: userProfile.introContent,
        profileImage: userProfile.profileImage,
        backgroundImage: userProfile.backgroundImage,
        about: userProfile.aboutContent,
        userId: userId,
    });

    useEffect(() => {
        const userData = async () => {
            try {
                const user = await axios.post("https://findbuddy-back.onrender.com/user", Id);
                const profileId = user.data.profileId;
                const formId = user.data.formId;
                const userProfile = await axios.post("https://findbuddy-back.onrender.com/profile", profileId);
                const userForm = await axios.post("https://findbuddy-back.onrender.com/getUserForm", { Id: formId });
                setUserInfo(user.data);
                setFormData(userForm.data.data);
                setUserProfile(userProfile.data);
                setReady(true);
            } catch (err) {
                console.log(err);
            }
        }
        userData()
    }, []);

    const handleSumbit = async (e) => {
        try {
            // e.preventDefault();
            const data = new FormData();
            data.append("userId", userId);
            data.append("about", content.about);
            data.append("intro", content.introContent);
            data.append("profileImage", content.profileImage);
            data.append("backgroundImage", content.backgroundImage);
            console.log(data);
            const res = await axios.post("https://findbuddy-back.onrender.com/updateIntro", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    const handleChange = (e) => {
        console.log("Handle Change occur", e);
        if (e.target.name === "profileImage" || e.target.name === "backgroundImage") {
            console.log(e.target.files[0]);
            return setContent({ ...content, [e.target.name]: e.target.files[0] });
        }
        return setContent({ ...content, [e.target.name]: e.target.value });
    }

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
                    <div className='row g-3'>
                        <div className='col-lg-12' >
                            <div class="profile-container">
                                <div class="profileCard hero-card">
                                    <div className='backgroundImage'>
                                        <img className='cover-image' aria-label="Profile cover image" src={userProfile.backgroundImage} />
                                    </div>
                                    <div class="profile-info-wrapper">
                                        <div class="profile-avatar-section">
                                            <div class="profileAvatar"><img className='profileImage' src={userProfile.profileImage} />
                                                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                    <i class="fa-solid fa-pen-to-square"></i>
                                                </button>

                                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                    <div class="modal-dialog">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Intro</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">

                                                                <form onSubmit={handleSumbit}>

                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">Choose profile photo</label>
                                                                        <input className="form-control" name="profileImage" type="file" id="hh" accept="image/*" onChange={handleChange} />
                                                                    </div>

                                                                    <div className="mb-3">
                                                                        <label htmlFor="formFile" className="form-label">Choose background photo</label>
                                                                        <input className="form-control" name="backgroundImage" type="file" id="formFile" accept="image/*" onChange={handleChange} />
                                                                    </div>

                                                                    <label htmlFor="headline" className="headline">Headline</label>
                                                                    <textarea name="introContent" id="headline" className="form-control" placeholder="write your headlines..." onChange={handleChange} />

                                                                    <label htmlFor="about" className="about">About Content</label>
                                                                    <textarea name="about" id="about" className="form-control" placeholder="Write about yourself..." onChange={handleChange} />

                                                                    <div class="modal-footer">
                                                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Save changes</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="profile-actions">
                                                <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#F43F5E", border: "none" }} aria-label="Open to Gym"> <i className="fas fa-dumbbell"></i> Open to Gym </button>
                                                <Link to={`/userChats/${userId}`}> <button className="btn" style={{ color: "#F3F4F6", backgroundColor: "#8B5CF6", border: "none" }} aria-label="Send Message" > <i className="fas fa-paper-plane"></i> Message </button> </Link>
                                                <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
                                                    <div class="modal-dialog modal-dialog-centered">
                                                        <div class="modal-content">
                                                            <div class="modal-footer">
                                                                <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About Profile</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
                                                    <div class="modal-dialog modal-dialog-centered">
                                                        <div class="modal-content">
                                                            <div class="modal-header">
                                                                <h1 class="modal-title fs-5" id="exampleModalToggleLabel2">Account Information</h1>
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div class="modal-body">
                                                                <span><b>Profile Created At : </b>{createAtDate}</span>
                                                                <br /><br />
                                                                <span><b>Profile Updated At : </b>{updateAtDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button class="btn" style={{ color: "#F3F4F6", backgroundColor: "#F59E0B", border: "none" }} data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">About Profile</button>
                                            </div>
                                        </div>
                                        <div class="name-title">
                                            <h1>{userInfo.username}</h1>
                                            <div class="headline">{userProfile.introContent}</div>
                                            <div class="location-info">
                                                <span><i class="fas fa-map-marker-alt"></i> {formData.city}, {formData.state} </span>
                                                <span><i class="fas fa-link"></i> {formData.gymname}</span>
                                                <span><i class="fa-solid fa-clock"></i> {formData.shifts}</span>
                                            </div>
                                            <div class="contact-badge">
                                                <a href="#"><i class="fas fa-envelope"></i> {userInfo.email}</a>
                                            </div>
                                        </div>
                                        <div class="stats-row">
                                            <div class="stat-item"><span class="stat-number">5,432</span> followers</div>
                                            <div class="stat-item"><span class="stat-number">1,289</span> connections</div>
                                            <div class="stat-item"><span class="stat-number">12</span> recommendations</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >


                <div className='container'>
                    <div className='row g-3' >
                        <div className='col-lg-12 mt-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className='activitySection'>
                                <h4 style={{ fontWeight: 700 }}>About</h4>
                                <span className="aboutContent">{userProfile.aboutContent}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container'>
                    <div className='row g-3' >
                        <div className='col-lg-12 mt-5' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className='activitySection'>
                                <h4 style={{ fontWeight: 700 }}>Activity</h4>
                                <div className='activityContent text-muted'>
                                    <p> The feed is currently empty. Stay tuned for future updates </p>
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