import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import multer from 'multer';
import bodyParser from "body-parser";
import flash from "connect-flash";
import LocalStrategy from "passport-local";

// Import your models and routers
import Auth from "./routers/Auth.js";
import { storage } from './cloudinary.js';
import { Form } from './src/models/FormModel.js';
import { Post } from './src/models/PostModel.js';
import { User } from "./src/models/UserSchema.js";
import { Profile } from './src/models/ProfileModel.js';
import { Comment } from './src/models/CommentModel.js';
import { SavePost } from "./src/models/SavaPostModel.js";

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📁 Created 'uploads' folder automatically.");
}

const PORT = 3001;
const app = express();
const httpServer = createServer(app); // Create the HTTP server

const frontendUrl = "http://localhost:3000";
const backendUrl = "http://localhost:3001";
const dashboardUrl = "http://localhost:3002";

// 1. Initialize Socket.io[]
const io = new Server(httpServer, {
    cors: {
        origin: [frontendUrl, dashboardUrl],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// 2. Database Connection
const mongoDbUrl = process.env.REACT_APP_MONGODB_URL;
async function main() {
    await mongoose.connect(mongoDbUrl);
}
main()
    .then(() => console.log("Connection build Successfully ✅"))
    .catch((err) => console.log("Database Connection Error ❌", err));

// 3. Middlewares
app.use(cors({ origin: [`${frontendUrl}`, `${dashboardUrl}`], credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(flash());

const sessionOptions = {
    secret: "mysupersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};
app.use(session(sessionOptions));
app.use('/uploads', express.static('uploads'));

// 4. Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 5. Routes
app.use("/", Auth);

// 6. Socket.io Logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_private_chat", ({ roomId }) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
    });

    socket.on("send_message", (data) => {
        // data should have: { roomId, text, senderId }
        socket.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

// 7. API Endpoints (Keeping your existing logic)
// Change storage to disk
// const diskStorage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, 'uploads/'),
//     filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
// });
const upload = multer({ storage: storage });

app.get("/allFormData", async (req, res) => {
    try {
        const allUser = await Form.find({});
        res.status(200).json(allUser);
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});

app.post("/formdata", upload.single("profilePicture"), async (req, res) => {
    try {
        const profilePath = req.file ? req.files?.path : "https://i.pinimg.com/736x/f7/82/c8/f782c8360e890a8d488eeda004b26bde.jpg";

        const {
            name, gender, age, fitnessLevel, goal, gymname,
            typeOfBuddy, city, state, country, shifts, userId
        } = req.body;

        const newForm = await new Form({
            name, gender, age, fitnessLevel, goal,
            typeOfBuddy, city, state, country, shifts,
            userId, gymname,
            profilePicture: profilePath,
        }).save();
        console.log(newForm);

        await User.findByIdAndUpdate(userId, { hasCompleteProfile: true, formId: newForm._id });
        res.status(200).json({ message: "Data received successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during profile creation." });
    }
});

app.post("/loggedUser", async (req, res) => {
    const { decode } = req.body;
    // console.log(req.body);
    try {
        const Id = req.body.id;
        const logged = await User.findOne({ _id: Id });
        res.status(200).json(logged);
    } catch (error) {
        console.log(error);
    }
});

app.get("/allPost", async (req, res) => {
    try {
        const allPost = await Post.find().populate('profileId userId');
        res.status(200).json(allPost);
    } catch (error) {
        res.status(504).json({ message: "Some Error Occurred" });
    }
});

app.post("/editPost", upload.single("editMedia"), async (req, res) => {
    try {
        const { postId, postAbout } = req.body;
        const post = await Post.findById({ _id: postId });
        if (!post) return res.status(400).json({ message: "Post not exist!!! " });
        const data = { about: postAbout };
        if (req.file) {
            data.media = req.file.path;
        }
        const updatedData = await Post.findByIdAndUpdate(postId, data);
        console.log(updatedData);
        res.status(200).json({ message: "Post Updated Successfully " });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
})

app.post("/user", async (req, res) => {
    try {
        const Id = req.body.id;
        const logged = await User.findById(Id).populate('formId profileId');
        res.status(200).json(logged);
    } catch (error) {
        console.log(error);
    }
});

app.post("/profile", async (req, res) => {
    const { Id } = req.body;
    try {
        const profile = await Profile.findOne(Id);
        // console.log(profile);
        res.status(200).json(profile);
    } catch (err) {
        console.log(err);
    }
});

app.post("/getUserForm", async (req, res) => {
    const { Id } = req.body;
    // console.log(req.body);
    const getForm = await Form.findById({ _id: Id });
    res.status(200).json({ data: getForm });
});

app.post("/userPostComments", async (req, res) => {
    try {
        // console.log(req.body.postId);
        const { postId } = req.body;
        const allComments = await Comment.find({ postId: req.body.postId }).populate("userId postId profileId");
        res.status(200).json({ message: "All Comment Post", allComments });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error });
    }
})

app.post("/comment", async (req, res) => {
    try {
        // console.log(req.body);
        const { comment, postId, profileId, userId } = req.body;
        console.log(comment, postId, userId);
        const saveComment = await new Comment({ comment: comment, userId: userId, postId: postId, profileId: profileId }).save();
        // console.log(saveComment);
        res.status(200).json({ message: "comment added", saveComment });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error })
    }
})

app.post("/editComment", async (req, res) => {
    console.log(req.body);
    try {
        const data = {
            comment: req.body.editComment,
            edit: true
        }
        const updatedComment = await Comment.findByIdAndUpdate(req.body.commentId, data);
        console.log(updatedComment);
        res.status(200).json({ message: "Comment Updated!!!", updatedComment });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

// backend/routes/post.js (or wherever your /like route is)
app.post("/like", async (req, res) => {
    try {
        const { postId, userId } = req.body;
        const post = await Post.findById(postId);

        const isLike = post.likes.includes(userId);
        const update = isLike ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } };

        // CRITICAL FIX: Add .populate() here before sending back to frontend
        const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true }).populate('userId').populate('profileId');
        console.log(updatedPost);

        return res.status(200).json({ updatedPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post("/postContent", upload.single("media"), async (req, res) => {
    try {
        // console.log("File received:", req.file);
        // console.log("Body received:", req.body);

        const data = {
            userId: req.body.userId,
            profileId: req.body.profileId,
            about: req.body.about?.trim()
        };

        if (req.file) {
            data.media = req.file ? req.file.path : null;
        }

        // console.log(data);

        const savePost = await new Post(data).save();
        res.status(200).json({ message: "Post Created", savePost });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.post("/followers", async (req, res) => {
    try {
        // console.log(req.body);
        const { profileId, userId } = req.body;
        const profile = await Profile.findById({ _id: profileId });

        if (!profile) {
            return res.status(404).json({ message: "Profile Not Found " });
        }

        const isUserFollow = profile.followers.includes(userId);
        const updateData = isUserFollow ? { $pull: { followers: userId } } : { $addToSet: { followers: userId } };

        const data = await Profile.findByIdAndUpdate(profileId, updateData, { new: true });
        // console.log(data);
        res.status(200).json({ message: isUserFollow ? "User Unfollow the User" : "User follow the user", data });
    } catch (error) {
        // console.log(error);
        res.status(400).json({ error: error.message });
    }
});

app.post("/userPosts", async (req, res) => {
    // console.log(req.body);
    try {
        const userposts = await Post.find({ userId: req.body.id }).populate('profileId userId');
        // console.log(userposts);
        res.status(200).json({ userposts });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error.message });
    }
})

app.post("/savePost", async (req, res) => {
    try {
        const { UserId, PostId, PostUserId, ProfileId } = req.body;
        const user = await User.findById({ _id: PostUserId });
        if (!user) return res.status(404).json({ message: "This Post User not Exists" });
        const post = await Post.findById({ _id: PostId });
        if (!post) return res.status(404).json({ message: "This Post not Exists" });
        const data = {
            userId: UserId,
            postId: PostId,
            postUserId: PostUserId,
            profileId: ProfileId,
        }
        const savePost = await new SavePost(data).save();
        console.log(savePost);
        res.status(200).json({ message: "Post Saved", savePost });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error.message });
    }
})

app.post("/allSavedPosts", async (req, res) => {
    try {
        const { user } = req.body;
        const allUserSavedPosts = await SavePost.find({ userId: user }).populate("userId profileId postId");
        console.log(allUserSavedPosts);
        res.status(200).json({ message: "All User Save Posts ", allUserSavedPosts });
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: error });
    }
});

app.post("/UnSavePost", async (req, res) => {
    try {
        const { UserId, SavePostId } = req.body;
        const UnSavePost = await SavePost.findByIdAndDelete(SavePostId);
        console.log(UnSavePost);
        res.status(200).json({ message: "Post Removed!!", UnSavePost });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
})

app.post("/updateForm", upload.single("profilePicture"), async (req, res) => {
    const {
        name, gender, age, fitnessLevel, goal,
        typeOfBuddy, city, state, country, shifts, userId
    } = req.body;

    const photoBase64 = req.file ? "data:image/webp;base64," + req.file.buffer.toString("base64") : "https://i.pinimg.com/736x/f7/82/c8/f782c8360e890a8d488eeda004b26bde.jpg";

    const user = await User.findById({ _id: userId });
    const _id = user.formId;
    const form = await Form.findByIdAndUpdate(_id, {
        name, gender, age, fitnessLevel, goal,
        typeOfBuddy, city, state, country, shifts, userId,
        profilePicture: photoBase64

    });

    const formUpdate = await Form.findByIdAndUpdate({})
    const newForm = await new Form({
        name, gender, age, fitnessLevel, goal,
        typeOfBuddy, city, state, country, shifts,
        userId,
        profilePicture: photoBase64,
    }).save();
});

app.delete("/deletePost/:id", async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        console.log(deletedPost);
        res.status(200).json({ message: "Post Deleted ", deletedPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const uploadFields = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
]);

app.post("/updateIntro", function (req, res, next) {
    uploadFields(req, res, function (err) {
        if (err) {
            console.error("Multer Error:", err);
            return res.status(400).json({ error: err.message || "File upload error" });
        }
        next();
    });
}, async (req, res) => {
    try {
        const { userId, intro, about } = req.body;
        console.log(req.body);

        // 1. Initialize update object
        const updateData = {};

        // 2. Handle Text Fields
        if (intro && intro !== 'undefined') updateData.introContent = intro;
        if (about && about !== 'undefined') updateData.aboutContent = about;

        // 3. Handle File Uploads
        if (req.files) {
            if (req.files['profileImage']) {
                updateData.profileImage = `${req.files['profileImage'][0].path}`;
            }
            if (req.files['backgroundImage']) {
                updateData.backgroundImage = `${req.files['backgroundImage'][0].path}`;
            }
        }

        // 4. Database Operations
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profileId = user.profileId;
        console.log(updateData);

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        console.log(updatedProfile);

        res.status(200).json({
            message: "Profile updated successfully",
            profile: updatedProfile
        });

    } catch (err) {
        console.error("Route Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 8. START THE SERVER (Use httpServer, only once)
httpServer.listen(PORT, () => {
    console.log(`FindBuddy Server running on port: ${PORT}`);
});