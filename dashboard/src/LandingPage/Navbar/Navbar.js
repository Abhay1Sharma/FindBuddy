import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const frontendUrl = "http://localhost:3000";
const backendUrl = "http://localhost:3001";

const Navbar = ({ setSearch }) => {
  const [userData, setUserData] = useState();
  const [postData, setPostData] = useState({
    about: "",
    media: ""
  });
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // STEP 1: Catch and Save the Token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      // Clean the URL
      window.history.replaceState({}, document.title, "/");

      // Manually trigger fetchUser once we know we have the token!
      fetchUser(tokenFromUrl);
    } else {
      // If no token in URL, check if one already exists in localStorage
      const existingToken = localStorage.getItem('token');
      if (existingToken) {
        fetchUser(existingToken);
      }
    }
  }, []); // Empty array means this runs ONCE when the page loads

  const fetchUser = async (tokenToUse) => {
    // Use the token passed in, or grab from storage
    const token = tokenToUse || localStorage.getItem('token');

    // Safety check: don't call backend if token is empty/null/undefined
    if (!token || token === "undefined" || token === "null") {
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.username);
    } catch (err) {
      console.error("Fetch User Error:", err);
      localStorage.removeItem('token');
      window.location.href = `${frontendUrl}/login`;
    }
  };

  const handlelogout = () => {
    localStorage.clear();
    setUserData(null); // Clear state
    // Bounce to 3000 to clear it, which then stops at 3000/login
    window.location.href = `${frontendUrl}/logout-sync`;
  };

  const handleSumbit = async () => {
    try {
      console.log(postData);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = async (e) => {
    if (e.target.name === "media") {
      console.log(URL.createObjectURL(e.target.files[0]));
      // <img />
      setFile(URL.createObjectURL(e.target.files[0]));
      return setPostData({ ...postData, [e.target.name]: e.target.files[0] });
    }
    console.log(e.target.value);
    return setPostData({ ...postData, [e.target.name]: e.target.value });
  }

  useEffect(() => { fetchUser() }, []);

  return (
    <>


      < nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "white", height: "4rem", border: "none", boxShadow: "none" }
      }>
        <div className="container-fluid" >
          <Link className="navbar-brand" to={"/form"} style={{ width: "30%", }}><i className="fa-solid fa-dumbbell" style={{ color: "red", height: "2rem", width: "2rem" }}> < span style={{ color: "#848080ff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></i> </Link>
          <input placeholder='Enter your Interset' className="searchbar" onChange={(e) => setSearch(e.target.value)} />
          <button className="navbar-toggler" type="button" style={{ border: "none", color: "white" }} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span style={{ border: "none", color: "white" }} className="navbar-toggler-icon"></span>
          </button>
          <div style={{ backgroundColor: 'white', border: "none" }} className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mb-2 mb-lg-0" style={{ margin: "0 auto", backgroundColor: "white" }}>
              <li className="nav-item">
                <Link className="nav-link active m-1.5" aria-current="page" to={frontendUrl}>Home</Link >
              </li>

              <li className="nav-item">
                <Link className="nav-link active m-1.5" to={"/update-profile"}>Update Your Routine</Link >
              </li>

              <li className="nav-item" >
                <Link type="button" className='nav-link active m-1.5' data-bs-toggle="modal" data-bs-target="#exampleModalCenter"> Create a Post </Link>
              </li>

              {userData && <li className="nav-item">
                <Link className="nav-link active m-1.5" onClick={handlelogout}>Logout</Link >
              </li>}

              {userData && <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">{userData}</span>
                  <span className="user-role"></span>
                </div>
                <img data-bs-toggle="tooltip" data-bs-placement="bottom" title={`Hello, ${userData}`}
                  className="avatar"
                  src={`https://ui-avatars.com/api/?name=${userData}&background=random&color=fff&rounded=true`}
                  alt="Avatar"
                />
              </div>}
            </ul>
          </div>
        </div>
      </nav >

      <div class="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header modalHeader">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" className='closeBtn'>X</span>
              </button>
            </div>
            <div class="modal-body">
              <form onSubmit={handleSumbit}>

                <label htmlFor="about" className="about">About Content</label>
                <textarea name="about" id="about" className="form-control mt-2" placeholder="Write about yourself..." onChange={handleChange} />

                <div class="media-uploader mt-4">
                  <label htmlFor="media-input" class="custom-button">
                    <input type="file" id="media-input" accept="image/*,video/*" name="media" hidden onChange={handleChange} />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"></path>
                    </svg>

                    { file && <img src={file} alt="Selected content" style={{ width: '100%', borderRadius: '8px' }} /> }

                  </label>

                  <div id="preview-container"></div>
                </div>

              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;