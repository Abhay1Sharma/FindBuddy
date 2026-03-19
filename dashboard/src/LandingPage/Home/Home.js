import React from "react";
import Hero from "./Hero";

function Home({ search }) {

    return (
        <>
        <Hero search={search} />
        </>
    );
};

export default Home;