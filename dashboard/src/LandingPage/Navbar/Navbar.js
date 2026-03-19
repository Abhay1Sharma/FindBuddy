import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const Navbar = ({ setSearch }) => {
  const [userData, setUserData] = useState();
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
      const res = await axios.get('http://localhost:3001/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(res.data.username);
    } catch (err) {
      console.error("Fetch User Error:", err);
      localStorage.removeItem('token');
      window.location.href = "http://localhost:3000/login";
    }
  };

  // const handlelogout = async () => {
  //   try {
  //     // 1. Call backend (optional for JWT, but good for session cleanup)
  //     localStorage.removeItem('token');
  //     // console.log(localStorage.key("token"));
  //     toast.success("Logout Succesfully");
  //     setUser(null);
  //     window.location.href = "http://localhost:3001/login"; // Send back to main login


  //     // 4. Optionally redirect
  //     // navigate("/login"); 
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  // };

  const handlelogout = () => {
    localStorage.clear();
    setUserData(null); // Clear state
    // Bounce to 3000 to clear it, which then stops at 3000/login
    window.location.href = "http://localhost:3000/logout-sync";
  };


  useEffect(() => { fetchUser() }, []);


  return (
    < nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "white", height: "4rem", border: "none", boxShadow: "none" }
    }>
      <div className="container-fluid" >
        <Link className="navbar-brand" to={"/form"} style={{ width: "30%", }}><i className="fa-solid fa-dumbbell" style={{ color: "red", height: "2rem", width: "2rem" }}> < span style={{ color: "#848080ff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></i> </Link>
        <input placeholder='Enter your Interset' className="searchbar" onChange={ (e) => setSearch(e.target.value)} />
        <button className="navbar-toggler" type="button" style={{ border: "none", color: "white" }} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span style={{ border: "none", color: "white" }} className="navbar-toggler-icon"></span>
        </button>
        <div style={{ backgroundColor: 'white', border: "none" }} className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0" style={{ margin: "0 auto", backgroundColor: "white" }}>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" aria-current="page" to={"http://localhost:3000"}>Home</Link >
            </li>

            <li className="nav-item">
              <Link className="nav-link active m-1.5" to={"/update-profile"}>Update Your Routine</Link >
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
  );
}

export default Navbar;