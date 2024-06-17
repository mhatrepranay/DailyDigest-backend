import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from 'jsonwebtoken';
import { expressjwt as expressJwt } from 'express-jwt';
import UserModel1 from './models/User1.js';
import newsrouter from "./routers/Articlerouter.js";
import AnalyticsRouter from "./routers/AnalyticsRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/crud");

const SECRET_KEY = "your_secret_key"; // Replace with your actual secret key

// Middleware to verify JWT token
const jwtMiddleware = expressJwt({
    secret: SECRET_KEY,
    algorithms: ["HS256"]
});

// ULMS API's
app.use("/api", newsrouter);
app.use("/", AnalyticsRouter);

// Data fetching on the home page
app.get('/', (req, res) => {
    UserModel1.find({})
        .then(users1 => res.json(users1))
        .catch(err => console.log(err))
});

// Add user API
app.post("/createUser1", (req, res) => {
    UserModel1.create(req.body)
        .then(users1 => res.json(users1))
        .catch(err => res.json(err))
});

// Login API
app.post("/signIn", (req, res) => {
    const { username, password } = req.body;

    // Query the database to find the user with the provided username and password
    UserModel1.findOne({ username, password })
        .then(user => {
            if (user) {
                // User found, generate and send JWT token
                const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY,);
                res.json({ success: true, message: "Sign-in successful", token });
            } else {
                // User not found or invalid credentials, send error response
                res.status(401).json({ success: false, message: "Invalid username or password" });
            }
        })
        .catch(err => {
            // Handle database query errors
            console.error('Sign-in error:', err);
            res.status(500).json({ success: false, message: "Internal server error" });
        });
});


//update user Api
app.put('/users/:id', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        let updatedUserData = {
            username,
            email,
            password,
            role
        };

        // Remove undefined fields (optional)
        updatedUserData = Object.fromEntries(
            Object.entries(updatedUserData).filter(([_, v]) => v !== undefined)
        );

        const updatedUser = await UserModel1.findByIdAndUpdate(
            req.params.id,
            updatedUserData,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update user role API
app.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!role) {
            return res.status(400).json({ error: 'Role is required' });
        }

        const updatedUser = await UserModel1.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Get user by ID API (Protected Route)
app.get('/profile', jwtMiddleware, (req, res) => {
    const userId = req.auth.id;

    UserModel1.findById(userId)
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch(err => {
            console.error('Error fetching user:', err);
            res.status(500).json({ success: false, message: "Internal server error" });
        });
});

app.listen(3001, () => {
    console.log("Server started");
});
