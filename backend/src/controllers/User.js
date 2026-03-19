import User from "../models/UserSchema.js";

export const loginPage = async (req, res) => {
  res.redirect("http://localhost:3000/login");
};


export const loginUser = async (req, res) => {
  res.redirect("http://localhost:3000");
};

export const signUp = (req, res) => {
  res.render("http://localhost:3000/signup");
};

export const signUpUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let user1 = new User({
      email: email,
      username: username,
    });

    console.log(req.body);

    let registerUser = await User.register(user1, password);

    req.login(registerUser, (error) => {
      if (error) {
        return next(error);
      }
      req.flash("success", "Your account has been created successfully!");
      res.redirect("http://localhost:3000");
    });
  } catch (err) {
    req.flash("errMsg", "A user with the given username is already registered");
    res.redirect("http://localhost:3000/signup");
  }

};

export const logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "You have successfully logged out. Thanks for visiting!");
      res.redirect("http://localhost:3000/login");
    }
  });
};