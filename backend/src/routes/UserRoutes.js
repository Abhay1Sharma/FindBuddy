import express from "express";
import passport from "passport";
import  { signUpUser, logOutUser, loginPage, loginUser } from "../controllers/User.js";

const router = express.Router();

router.route("/login")
.post(saveUrl, passport.authenticate("local", {
    failureRedirect: "http://localhost:3000/login",
    failureFlash: true,
  }),
  loginUser
);

router.route("/signup")
.post(signUpUser);

router.get("/logout", logOutUser);