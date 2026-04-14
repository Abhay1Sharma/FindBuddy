import React from "react";

function Hero() {
    return (
        <div className="container NotFound" style={{ userSelect: "none" }}>

            <div className="row">

                <div className="col-lg-12 col-md-12" style={{display: "flex", justifyContent: "center"}}>
                    <video autoPlay loop muted disablepictureinpicture="true" className="notFoundImage" src={'https://cdnl.iconscout.com/lottie/premium/preview-watermark/page-not-found-animation-gif-download-6640903.mp4'} />
                    {/* <img className="notFoundImage" src ="https://png.pngtree.com/png-clipart/20200401/original/pngtree-page-not-found-error-404-concept-with-people-trying-to-fix-png-image_5333349.jpg" alt="PageNotFound"/> */}
                </div>

                <div className="colo-lg-6" style={{textAlign: "center"}}>
                    <h2>404 Page Not Found</h2>
                    <p>Sorry, the page you want to find does not exist</p>
                </div>

            </div>

        </div>
    );
};

export default Hero;