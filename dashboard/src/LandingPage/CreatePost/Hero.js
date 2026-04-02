import React from "react";

function Hero() {

    const handleSumbit = () => {

    }

    const handleChange = () => {
        
    }

    return (
        <>
            <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i class="fa-solid fa-pen-to-square"></i>
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Intro</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <form onSubmit={handleSumbit}>

                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Choose profile photo</label>
                                    <input className="form-control" name="profileImage" type="file" id="hh" accept="image/*" onChange={handleChange} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="formFile" className="form-label">Choose background photo</label>
                                    <input className="form-control" name="backgroundImage" type="file" id="formFile" accept="image/*" onChange={handleChange} />
                                </div>

                                <label htmlFor="headline" className="headline">Headline</label>
                                <textarea name="introContent" id="headline" className="form-control" placeholder="write your headlines..." onChange={handleChange} />

                                <label htmlFor="about" className="about">About Content</label>
                                <textarea name="about" id="about" className="form-control" placeholder="Write about yourself..." onChange={handleChange} />

                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="submit" class="btn btn-primary" data-bs-dismiss="modal" aria-label="Close">Save changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Hero;