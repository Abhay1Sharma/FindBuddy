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

// 1. Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3002"],
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
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3002'], credentials: true }));
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

// ... Keep your other app.post routes here ...

// 8. START THE SERVER (Use httpServer, only once)
httpServer.listen(PORT, () => {
    console.log(`FindBuddy Server running on port: ${PORT}`);
});