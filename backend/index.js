import 'dotenv/config';
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import session from "express-session";
import multer from 'multer';
import bodyParser from "body-parser";
import flash from "connect-flash";
import LocalStrategy from "passport-local";

// Import your models and routers
import Auth from "./routers/Auth.js";
import { Form } from './src/models/FormModel.js';
import { User } from "./src/models/UserSchema.js";

const PORT = 3001;
const app = express();
const httpServer = createServer(app); // Create the HTTP server

const frontendUrl = "https://findbuddy-lsdc.onrender.com";
const backendUrl = "https://findbuddy-back.onrender.com";
const dashboardUrl = "https://findbuddy-dash.onrender.com";

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        const photoBase64 = req.file ? "data:image/webp;base64," + req.file.buffer.toString("base64") : "https://i.pinimg.com/736x/f7/82/c8/f782c8360e890a8d488eeda004b26bde.jpg";

        const {
            name, gender, age, fitnessLevel, goal, gymname,
            typeOfBuddy, city, state, country, shifts, userId
        } = req.body;

        console.log(req.body);

        const newForm = await new Form({
            name, gender, age, fitnessLevel, goal,
            typeOfBuddy, city, state, country, shifts,
            userId, gymname,
            profilePicture: photoBase64, // Use the Base64 string here!

        }).save();

        const user = await User.findByIdAndUpdate(userId, { hasCompleteProfile: true, formId: newForm._id });
        // console.log(user);
        res.status(200).json({ message: "Data received successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error during profile creation." });
    }

});

app.post("/loggedUser", async (req, res) => {
    const { decode } = req.body;
    console.log(req.body);
    try {
        const Id = req.body.id;
        const logged = await User.findOne({ _id: Id });
        res.status(200).json(logged);
    } catch (error) {
        console.log(error);
    }
});

app.post("/getUserForm", async (req, res) => {
    const { Id } = req.body;
    const getForm = await Form.findById({ _id: Id });
    console.log(getForm);
    res.status(200).json({ data: getForm });
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
        profilePicture: photoBase64, // Use the Base64 string here!
    }).save();
});

// 8. START THE SERVER (Use httpServer, only once)
httpServer.listen(PORT, () => {
    console.log(`FindBuddy Server running on port: ${PORT}`);
});