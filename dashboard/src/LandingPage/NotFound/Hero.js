import React from "react";

function Hero() {
    return (
        <div className="container NotFound" style={{ userSelect: "none" }}>

            <div className="row">

                <div className="col-lg-12 col-md-12" style={{display: "flex", justifyContent: "center"}}>
                    <img className="notFoundImage" src ="https://png.pngtree.com/png-clipart/20200401/original/pngtree-page-not-found-error-404-concept-with-people-trying-to-fix-png-image_5333349.jpg" alt="PageNotFound"/>
                </div>

                <div className="colo-lg-6" style={{textAlign: "center"}}>
                    <h2>404 Page Not Found</h2>
                    <p>Sorry, the page you found does not exist</p>
                </div>

            </div>

        </div>
    );
};

export default Hero;