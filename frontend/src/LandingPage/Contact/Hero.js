function Hero() {

    return (
        <section class="contact" id="contact">
            <div class="container">
                <div class="section-title">
                    <h2>Get In Touch</h2>
                    <p>Have questions? We're here to help! Visit us, call, or send a message.</p>
                </div>

                <div class="contact-grid">
                    <div class="contact-info">
                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Our Location</h4>
                                <p>123 Fitness Street, Cityville, State 12345</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Phone Number</h4>
                                <p>(555) 123-4567</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Email Address</h4>
                                <p>info@ironflexgym.com</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <div class="contact-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="contact-details">
                                <h4>Opening Hours</h4>
                                <p>Monday - Friday: 5:00 AM - 11:00 PM</p>
                                <p>Saturday: 6:00 AM - 10:00 PM</p>
                                <p>Sunday: 7:00 AM - 9:00 PM</p>
                            </div>
                        </div>
                    </div>

                    <div class="contact-form">
                        <h3 style={{ marginBottom: "20px", color: "var(--secondary)" }}>Send Us a Message</h3>
                        <form id="contactForm">
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" required />
                            </div>

                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" required />
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone Number</label>
                                <input type="tel" id="phone" />
                            </div>

                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <select id="subject">
                                    <option value="">Select a subject</option>
                                    <option value="membership">Membership Inquiry</option>
                                    <option value="personal-training">Personal Training</option>
                                    <option value="group-classes">Group Classes</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" rows="5"></textarea>
                            </div>

                            <button type="submit" class="cta-button" style={{ borderRadius: "10px", width: "100%", height: "2.5rem", backgroundColor: "#FF3D00", color: "white", border: "none" }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Hero;