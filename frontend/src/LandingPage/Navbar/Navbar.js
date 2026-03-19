import { toast } from "react-toastify";
import { useAuth } from '../../AuthjsContext';
import { Link } from 'react-router-dom';

const Navbar = () => {

  // const handlelogout = async () => {
  //   try {
  //     // 1. Call backend (optional for JWT, but good for session cleanup)
  //     localStorage.removeItem('token');
  //     localStorage.clear();
  //     // console.log(localStorage.key("token"));
  //     toast.success("Logout Succesfully");
  //     setUser(null);

  //     window.location.href = "http://localhost:3002/logout-sync";
  //     // 4. Optionally redirect
  //     // navigate("/login"); 
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   }
  // };

const handlelogout = () => {
  localStorage.clear();
  setUser(null); // Clear context
  // Bounce to 3002 to clear it, which then redirects back to 3000/login
  window.location.href = "http://localhost:3002/logout-sync";
};

  // const onLoginSuccess = (responseData) => {
  //   localStorage.setItem('token', responseData.token);
  //   // This line is what makes the Navbar name appear instantly!
  //   setUser(responseData.user);
  //   navigate("/");
  // };
  const { user, setUser } = useAuth(); // Destructure setUser from your context
  // console.log("user", user);

  // const navigate = useNavigate();

  return (

    < nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "white", height: "4rem", border: "none", boxShadow: "none" }
    }>
      <div className="container-fluid" style={{}}>
        <Link className="navbar-brand" to={"/"} style={{ width: "30%", }}><i className="fa-solid fa-dumbbell" style={{ color: "red", height: "2rem", width: "2rem" }}> < span style={{ color: "#848080ff" }}>Find</span><span style={{ color: "#FF3D00" }}>Buddy</span></i> </Link>
        <button className="navbar-toggler" type="button" style={{ border: "none", color: "white" }} data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span style={{ border: "none", color: "white" }} className="navbar-toggler-icon"></span>
        </button>
        <div style={{ backgroundColor: 'white', border: "none" }} className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0" style={{ margin: "0 auto", backgroundColor: "white" }}>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" aria-current="page" to={"/"}>Home</Link >
            </li>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" to={"/feature"}>Feature</Link >
            </li>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" to={"/membership"}>Membership</Link >
            </li>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" to={"/trainers"}>Trainers</Link >
            </li>
            <li className="nav-item">
              <Link className="nav-link active m-1.5" to={"/contact"}>Contact</Link >
            </li>
            {user ? (
              /* LOGGED IN */
              <li className="nav-item">
                <Link onClick={handlelogout} className="nav-link active m-1.5" to="/">Logout</Link>
              </li>
            ) : (
              /* NOT LOGGED IN - Show Login OR Signup */
              <>
                <li className="nav-item">
                  <Link className="nav-link active m-1.5" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active m-1.5" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>

          {user && <div className="user-profile">
            <div className="user-info">
              <span className="user-name">Hello, {user.username}</span>
              <span className="user-role"></span>
            </div>
            <img data-bs-toggle="tooltip" data-bs-placement="bottom" title={`Hello, ${user.username}`}
              className="avatar"
              src={`https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&rounded=true`}
              alt="Avatar"

            />
          </div>}
        </div>
      </div>
    </nav >
  );
}

export default Navbar;