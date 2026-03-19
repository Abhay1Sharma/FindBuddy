import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function Hero() {
    const navigate = useNavigate();
    const storedToken = localStorage.token;
    const decode = jwtDecode(storedToken);

    const locationData = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
        "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Roing"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar"],
        "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad"],
        "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Senapati"],
        "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh"],
        "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur"],
        "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
        "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Noida"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rishikesh"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
        "Andaman and Nicobar": ["Port Blair"],
        "Chandigarh": ["Chandigarh"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
        "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
        "Ladakh": ["Leh", "Kargil"],
        "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam"]
    };

    const [image, setImage] = useState([]);
    const [formData, setformData] = useState();
    console.log("Your Form Data ", formData);

    const fetchUser = async () => {
        try {
            const response = await axios.post("http://localhost:3001/loggedUser", decode);
            const Id = response.data.formId;
            const getForm = await axios.post("http://localhost:3001/getUserForm", { Id });
            setformData(getForm.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { fetchUser() }, []);

    const handleChange = (e) => {
        if (e.target.name === "profilePicture") {
            return setformData({ ...formData, "profilePicture": e.target.files[0] });
        }
        return setformData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSumbit = async (e) => {
        e.preventDefault();

        try {
            // 1. You MUST create this instance
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
                console.log(formData[key]);
            });

            // 3. Send 'data' (the FormData), NOT 'formData' (your state object)
            const res = await axios.post("http://localhost:3001/updateForm", data, {
                withCredentials: true,
                // Axios will automatically set the boundary for multipart/form-data
            });

            toast.success(res.data.message);
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed.");
        }
    };

    const [selectedState, setSelectedState] = useState("");
    const [cities, setCities] = useState([]);

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setformData({ ...formData, [e.target.name]: e.target.value });
        setCities(locationData[state] || []); // Update city list based on state
    };

    return (
        <>
            <div className="container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div className="row">
                    {/* <div className="col-md-2"></div> */}
                    <div className="col-lg-12">
                        <form onSubmit={handleSumbit} >

                            <div className="mt-4">
                                <div className="basic-info">
                                    <h3>FindBuddy</h3>
                                </div>
                                <div className="basic-info mb-4">
                                    <span>Fill in your routine to find your perfect gym partner.</span>
                                </div>
                            </div>

                            <div>
                                <div >
                                    <h6>Basic Information</h6>
                                    <label htmlFor="fullname" className="fullName">Full Name</label>
                                    <input name="name" id="fullname" className="form-control" placeholder="Enter your name" onChange={handleChange} required />

                                    <div className="row g-3 mb-3">
                                        <div className="col-md-8">
                                            <label htmlFor="gender" type="number" className="form-label">Gender</label>
                                            <select id="gender" className="form-control" defaultValue="" name="gender" onChange={handleChange} required>
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male Buddy">Male</option>
                                                <option value="Femal Buddy">Female</option>
                                                <option value="Non-binary Buddy">Non-binary</option>
                                                <option value="Not Prefer to Say">Not Prefer to Say</option>
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="age" className="form-label">Age</label>
                                            <input type="number" className="form-control" placeholder="Above 16" name="age" min="16" max="50" onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="formFile" className="form-label">Choose your photo</label>
                                        <input className="form-control" name="profilePicture" type="file" id="formFile" accept="image/*" onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mt-3">
                                    <h6>Exercise Information</h6>

                                    <div className="shifts mb-2">
                                        <label htmlFor="Shifts" className="form-label" name="shift">Select Shifts</label>
                                        <select className="form-control" name="shifts" defaultValue="" onChange={handleChange} required>
                                            <option value="" disabled>Choose the Preference</option>
                                            <option value="Morning (6:30 AM - 8:30 AM)">Morning (6:30 AM - 8:30 AM)</option>
                                            <option value="Afternoon (Often closed or Quiet Hours)">Afternoon (Often closed or Quiet Hours)</option>
                                            <option value="Evening (6:00 PM - 8:30 PM)">Evening (6:00 PM - 8:30 PM)</option>
                                        </select>
                                    </div>

                                    <div className="fitnessLevel">
                                        <label htmlFor="Price" type="number" className="form-label" name="fitnessLevel">Fitness Level</label>
                                        <select className="form-control" name="fitnessLevel" defaultValue="" onChange={handleChange} required>
                                            <option value="" disabled>Choose the Preference</option>
                                            <option value="Beginner (0-1 years exp)">Beginner (0-1 years exp)</option>
                                            <option value="Intermediate (1-3 years exp)">Intermediate (1-3 years exp)</option>
                                            <option value="Advanced (3+ years exp)">Advanced (3+ years exp)</option>
                                        </select>

                                        <div>
                                            <div className="mt-3">
                                                <label htmlFor="primarygoal" className="goals">Primary Goals</label>
                                            </div>
                                            <div className="goals" name="goal" >
                                                <label htmlFor="WeightLoss"><input id="WeightLoss" type="radio" name="goal" value="Weight Loss" onChange={handleChange} required></input> Weight Loss </label>
                                                <label htmlFor="MuscleGain" style={{ marginLeft: "1rem" }}><input id="MuscleGain" type="radio" name="goal" value="Muscle Gain" onChange={handleChange} required></input> Muscle Gain </label>
                                                <label htmlFor="Strength" style={{ marginLeft: "1rem" }}><input id="Strength" type="radio" name="goal" value="Strength" onChange={handleChange} required></input> Strength </label>
                                                <label htmlFor="Endurance" style={{ marginLeft: "1rem" }}><input id="Endurance" type="radio" name="goal" value="Endurance" onChange={handleChange} required></input> Endurance </label>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h6 className="mb-3">Type of Buddy</h6>
                                            <div className="">
                                                <label htmlFor="workout" className="form-label">Workout Split</label>
                                                <select name="typeOfBuddy" id="workout" defaultValue="" className="form-control" onChange={handleChange} required>
                                                    <option value="" disabled>No Preference</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Not prefer to Say">Not prefer to Say</option>
                                                    <option value="Non-binary">Non-binary</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h6 className="mt-3">Location</h6>
                                <div>
                                    <label htmlFor="country" className="form-label">Country</label>
                                    <select className="form-control" defaultValue="" name="country" onChange={handleChange} required>
                                        <option value="" disabled >Select Country</option>
                                        <option value="India">India</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-8">
                                    <label htmlFor="state" className="form-label">State</label>
                                    <select className="form-control" defaultValue="" name="state" onChange={handleStateChange} required>
                                        <option>Select State</option>
                                        {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select name="city" className="form-control" defaultValue="" onChange={handleChange} disabled={!cities.length} required>
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button className="form-control mt-4 mb-3" style={{ color: "white", fontWeight: "600", fontSize: "1.1rem", backgroundColor: "rgb(255, 61, 0)" }}>Find your Buddy</button>
                        </form>
                    </div>
                    {/* <div className="col-lg-2"></div> */}
                </div >
            </div >
        </>
    )
}

export default Hero;