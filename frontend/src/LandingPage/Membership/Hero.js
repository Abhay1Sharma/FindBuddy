
function Hero() {

    return (
        <section class="membership" id="membership">
            <div class="container">
                <div class="section-title">
                    <h2>Membership Plans</h2>
                    <p>Choose the perfect plan that fits your fitness goals and budget. All plans include access to basic amenities.</p>
                </div><br /><br />

                <div class="plans-grid">
                    <div class="plan-card">
                        <div class="plan-header">
                            <div class="plan-name">Basic</div>
                            <div class="plan-price">$29<span>/month</span></div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="fas fa-check"></i> Gym Access (Peak Hours)</li>
                                <li><i class="fas fa-check"></i> Free Weights Area</li>
                                <li><i class="fas fa-check"></i> Cardio Machines</li>
                                <li><i class="fas fa-times"></i> Group Classes</li>
                                <li><i class="fas fa-times"></i> Swimming Pool</li>
                                <li><i class="fas fa-times"></i> Personal Training</li>
                            </ul>
                            <button class="cta-button" style={{width: "100%", marginTop: "20px", height: "2.5rem", borderRadius: "25px", border: "none", backgroundColor: "#FF3D00", color: "white"}}>Select Plan</button>
                        </div>
                    </div>

                    <div class="plan-card popular">
                        <div class="popular-badge">Most Popular</div>
                        <div class="plan-header">
                            <div class="plan-name">Premium</div>
                            <div class="plan-price">$59<span>/month</span></div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="fas fa-check"></i> 24/7 Gym Access</li>
                                <li><i class="fas fa-check"></i> All Equipment Areas</li>
                                <li><i class="fas fa-check"></i> Unlimited Group Classes</li>
                                <li><i class="fas fa-check"></i> Swimming Pool & Sauna</li>
                                <li><i class="fas fa-check"></i> 2 Personal Training Sessions</li>
                                <li><i class="fas fa-times"></i> Spa Services</li>
                            </ul>
                            <button class="cta-button" style={{width: "100%", marginTop: "20px", height: "2.5rem", borderRadius: "25px", border: "none", backgroundColor: "#FF3D00", color: "white"}}>Select Plan</button>
                        </div>
                    </div>

                    <div class="plan-card">
                        <div class="plan-header">
                            <div class="plan-name">Elite</div>
                            <div class="plan-price">$99<span>/month</span></div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="fas fa-check"></i> 24/7 Gym Access</li>
                                <li><i class="fas fa-check"></i> All Equipment Areas</li>
                                <li><i class="fas fa-check"></i> Unlimited Group Classes</li>
                                <li><i class="fas fa-check"></i> All Amenities</li>
                                <li><i class="fas fa-check"></i> 8 Personal Training Sessions</li>
                                <li><i class="fas fa-check"></i> Unlimited Spa Services</li>
                            </ul>
                            <button class="cta-button" style={{width: "100%", marginTop: "20px", height: "2.5rem", borderRadius: "25px", border: "none", backgroundColor: "#FF3D00", color: "white"}}>Select Plan</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Hero;