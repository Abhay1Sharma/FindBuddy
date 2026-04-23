import React from "react";

function Hero() {
    return (
        // <div className="container NotFound" style={{ userSelect: "none" }}>

        //     <div className="row">

        //         <div className="col-lg-12 col-md-12" style={{display: "flex", justifyContent: "center"}}>
        //             <video autoPlay loop muted disablepictureinpicture="true" className="notFoundImage" src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/page-not-found-animation-gif-download-6640903.mp4'} />
        //             {/* <img className="notFoundImage" src ="https://png.pngtree.com/png-clipart/20200401/original/pngtree-page-not-found-error-404-concept-with-people-trying-to-fix-png-image_5333349.jpg" alt="PageNotFound"/> */}
        //         </div>

        //         <div className="colo-lg-6" style={{textAlign: "center"}}>
        //             <h2>404 Page Not Found</h2>
        //             <p>Sorry, the page you want to find does not exist</p>
        //         </div>

        //     </div>

        // </div>

        <div className="container empty-state-wrapper" style={{ userSelect: "none", padding: "4rem 0" }}>
                    <div className="row justify-content-center">

                        {/* Video Container */}
                        <div className="col-12 d-flex justify-content-center mb-4">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                disablePictureInPicture
                                className="empty-state-video"
                                style={{
                                    maxWidth: "65vh",
                                    mixBlendMode: "multiply", // Blends video background if it's white
                                    filter: "grayscale(20%)"   // Gives it a slightly more professional tone
                                }}
                                src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/page-not-found-animation-gif-download-6640903.mp4'}
                            />
                        </div>

                        {/* Text Content */}
                        <div className="col-lg-6 text-center">
                            <h2 style={{ fontWeight: "600", letterSpacing: "-0.02em", color: "#111" }}>
                                404 Page Not Found
                            </h2>
                            <p style={{ color: "#666", fontSize: "1.1rem" }}>
                                Sorry, the page you want to find does not exist
                            </p>
                        </div>

                    </div>
                </div>
    );
};

export default Hero;