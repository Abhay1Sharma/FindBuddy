import { Button } from "@mui/material";

function Footer() {
    return (
        <footer className="footer" style={{ backgroundColor: "#263238", color: "#fff", padding: "40px 0 20px" }}>
            <div className="container"> {/* Changed class to className */}
                <div className="footer-grid">
                    <div className="footer-about">
                        <div className="footer-logo">
                            <i className="fas fa-dumbbell"></i>
                            <h3>Find<span>Buddy</span></h3>
                        </div>
                        <p>Transforming lives through fitness since 2010. Our mission is to provide a welcoming, supportive environment where everyone can achieve their fitness goals.</p>
                        
                        <div className="social-links">
                            {/* FIX: Removed nested <a> tags. Material UI Buttons can act as links directly */}
                            <Button href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-facebook-f"></i>
                            </Button>
                            <Button href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </Button>
                            <Button href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-twitter"></i>
                            </Button>
                            <Button href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube"></i>
                            </Button>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul>
                            {/* Valid internal hash links are okay for ESLint */}
                            <li><a href="#home"><i className="fas fa-chevron-right"></i> Home</a></li>
                            <li><a href="#features"><i className="fas fa-chevron-right"></i> Features</a></li>
                            <li><a href="#membership"><i className="fas fa-chevron-right"></i> Membership</a></li>
                            <li><a href="#trainers"><i className="fas fa-chevron-right"></i> Trainers</a></li>
                            <li><a href="#schedule"><i className="fas fa-chevron-right"></i> Schedule</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4 className="footer-heading">Services</h4>
                        <ul>
                            {/* FIX: Changed href="#" to href="#!" or specific IDs to satisfy ESLint */}
                            <li><a href="#personal-training"><i className="fas fa-chevron-right"></i> Personal Training</a></li>
                            <li><a href="#classes"><i className="fas fa-chevron-right"></i> Group Classes</a></li>
                            <li><a href="#nutrition"><i className="fas fa-chevron-right"></i> Nutrition Counseling</a></li>
                            <li><a href="#therapy"><i className="fas fa-chevron-right"></i> Physical Therapy</a></li>
                            <li><a href="#childcare"><i className="fas fa-chevron-right"></i> Child Care</a></li>
                        </ul>
                    </div>

                    <div className="footer-newsletter">
                        <h4 className="footer-heading">Newsletter</h4>
                        <p>Subscribe to get updates on new classes, special offers, and fitness tips.</p>
                        <form className="newsletter-form">
                            <input type="email" placeholder="Your email address" required/>
                            <button type="submit"><i className="fas fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>

                <div className="copyright">
                    <p>&copy; 2024 IronFlex Gym. All rights reserved. | Designed with <i className="fas fa-heart" style={{color: "red"}}></i> for fitness enthusiasts</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;