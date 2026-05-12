import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";

const backendUrl = "https://findbuddy-back.onrender.com";

function Hero() {
    const navigate = useNavigate();
    const storedToken = localStorage.token;
    const decode = jwtDecode(storedToken);
    const [loading, setLoading] = useState(false);

    const locationData = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur", "Vizianagaram", "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Chittoor", "Hindupur", "Proddatur"],
        "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Roing", "Tezu", "Bomdila", "Aalo", "Khonsa"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia", "Tezpur", "Bongaigaon", "Dhubri", "Diphu", "North Lakhimpur", "Karimganj", "Sivasagar", "Goalpara", "Barpeta"],
        "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chapra", "Saharsa", "Sasaram", "Hajipur", "Motihari", "Siwan", "Bettiah"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Jagdalpur", "Ambikapur", "Dhamtari", "Durg", "Mahasamund", "Raigarh", "Champa", "Bhatapara", "Kishunpur"],
        "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Quepem", "Canacona", "Sanquelim"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Navsari", "Morbi", "Vapi", "Bharuch", "Porbandar", "Veraval", "Valsad", "Bhuj", "Mehsana", "Patan", "Amreli"],
        "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Hisar", "Rohtak", "Karnal", "Sonipat", "Panchkula", "Yamunanagar", "Sirsa", "Rewari", "Bhiwani", "Bahadurgarh", "Jind", "Palwal", "Kaithal", "Thanesar"],
        "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Chamba", "Hamirpur", "Paonta Sahib", "Bilaspur", "Una", "Nahan", "Palampur", "Baddi"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih", "Phusro", "Ramgarh", "Medininagar", "Sahibganj", "Chaibasa", "Dumka", "Gumia", "Jhumri Telaiya"],
        "Karnataka": ["Bengaluru", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davanagere", "Ballari", "Tumakuru", "Shivamogga", "Kalaburagi", "Raichur", "Bidar", "Hassan", "Gadag-Betageri", "Udupi", "Hospet", "Bijapur", "Chitradurga", "Kolar", "Mandya"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Kottayam", "Malappuram", "Kannur", "Kasaragod", "Pathanamthitta", "Thalassery", "Vatakara", "Kanhangad", "Aluva"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Ratlam", "Rewa", "Satna", "Dewas", "Murwara", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Damoh"],
        "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur", "Navi Mumbai", "Akola", "Jalgaon", "Latur", "Sangli", "Ahmednagar", "Chandrapur", "Parbhani", "Ichalkaranji", "Ambarnath", "Bhiwandi"],
        "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Senapati", "Ukhrul", "Bishnupur", "Kakching", "Moreh", "Mayang Imphal"],
        "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Williamnagar", "Cherrapunji", "Baghmara", "Resubelpara"],
        "Mizoram": ["Aizawl", "Lunglei", "Saiha", "Champhai", "Kolasib", "Serchhip", "Lawngtlai", "Mamit"],
        "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Mon", "Phek", "Kiphire", "Chumukedima"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jharsuguda", "Balangir", "Rayagada", "Bawanipatna", "Dhenkanal", "Barbil"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Pathankot", "Moga", "Abohar", "Khanna", "Firozpur", "Batala", "Barnala", "Muktsar", "Kapurthala"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur", "Sikar", "Pali", "Sri Ganganagar", "Chittorgarh", "Tonk", "Kishangarh", "Beawar", "Hanumangarh", "Dholpur"],
        "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Singtam", "Rangpo", "Jorethang", "Lachung"],
        "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi", "Thanjavur", "Tiruppur", "Dindigul", "Hosur", "Nagercoil", "Kanchipuram", "Kumarapalayam", "Karaikudi", "Neyveli"],
        "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Miryalaguda", "Siddipet", "Jagtial", "Mancherial"],
        "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Ambassa", "Belonia", "Khowai", "Ranirbazar"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Noida", "Ghaziabad", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Jhansi", "Gorakhpur", "Saharanpur", "Mathura", "Firozabad", "Muzaffarnagar", "Ayodhya", "Jhansi", "Shahjahanpur", "Loni", "Maunath Bhanjan", "Hapur", "Etawah", "Mirzapur"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Roorkee", "Rishikesh", "Kashipur", "Rudrapur", "Nainital", "Pithoragarh", "Almora", "Tehri", "Ramnagar", "Manglaur"],
        "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda", "Baharampur", "Kharagpur", "Haldia", "Habra", "Shantipur", "Ranaghat", "Naihati", "Basirhat", "Bankura", "Purulia"],
        "Andaman and Nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Havelock Island", "Campbell Bay"],
        "Chandigarh": ["Chandigarh"],
        "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Dadra"],
        "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini", "Najafgarh", "Janakpuri", "Pitampura", "Vasant Kunj"],
        "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua", "Udhampur", "Sopore", "Samba", "Reasi", "Poonch", "Rajouri"],
        "Ladakh": ["Leh", "Kargil", "Nubra", "Drass"],
        "Lakshadweep": ["Kavaratti", "Agatti", "Minicoy", "Amini", "Andrott", "Kalpeni"],
        "Puducherry": ["Puducherry", "Karaikal", "Mahe", "Yanam", "Oulgaret"]
    };

    const [image, setImage] = useState([]);
    const [formData, setformData] = useState({
        name: "",
        age: "",
        gender: "",
        gymname: "",
        fitnessLevel: "",
        goal: "",
        typeOfBuddy: "",
        state: "",
        city: "",
        country: "",
        shifts: "",
        profilePicture: "",
        userId: decode.id,
    });


    console.log(formData);

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

            // 2. You MUST manually append each field
            // This allows the browser to bundle the binary image correctly
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            // 3. Send 'data' (the FormData), NOT 'formData' (your state object)
            setLoading(true);
            const res = await axios.post(`${backendUrl}/formdata`, data, {
                withCredentials: true,
                // Axios will automatically set the boundary for multipart/form-data
            });
            toast.success("High five! Profile Saved 🏋️‍♂️");
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error("Upload failed.");
        } finally {
            setLoading(false);
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
                    <div className="col-lg-12 form-content">
                        <form onSubmit={handleSumbit} >

                            <div className="form-header">
                                <div className="basic-info">
                                    <h3>FindBuddy</h3>
                                </div>
                                <div className="basic-info mb-4">
                                    <span>Fill your routine to find your perfect gym partner.</span>
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
                                            <select id="gender" defaultValue="" className="form-control" name="gender" onChange={handleChange} required>
                                                <option value="" disabled >Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="non-binary">Non-binary</option>
                                                <option value="not say">Not Prefer to Say</option>
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

                                    <label htmlFor="gymName" className="gymName">Gym Name</label>
                                    <input name="gymname" id="gymName" className="form-control" placeholder="Enter gym name" onChange={handleChange} required />

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
                                            <option value="" disabled selected>Choose the Preference</option>
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
                                                    <option value="" disabled selected>No Preference</option>
                                                    <option value="Male Buddy">Male</option>
                                                    <option value="Female Buddy">Female</option>
                                                    <option value="Not prefer to Say">Not prefer to Say</option>
                                                    <option value="Non-binary Buddy">Non-binary</option>
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
                                    <select className="form-control" name="state" onChange={handleStateChange} required>
                                        <option value="">Select State</option>
                                        {Object.keys(locationData).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label htmlFor="city" className="form-label">City</label>
                                    <select name="city" className="form-control" onChange={handleChange} disabled={!cities.length} required>
                                        <option value="">Select City</option>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {loading ?
                                <button className="form-control mt-4 mb-3" style={{ color: "white", fontWeight: "600", fontSize: "1.1rem", backgroundColor: "rgb(213, 149, 130)" }}>Wait....</button>
                                :
                                <button className="form-control mt-4 mb-3" style={{ color: "white", fontWeight: "600", fontSize: "1.1rem", backgroundColor: "rgb(255, 61, 0)" }}>Create Your Profile</button>
                            }
                        </form>
                    </div>
                </div >
            </div >
        </>
    )
}

export default Hero;