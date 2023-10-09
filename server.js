const User = require('./models/user');
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config({ path: './config/.env' });

const URI = process.env.MONGODB_URI;
console.log(URI);
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// Middleware to parse JSON data
app.use(express.json());

app.get('/get-users', async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json({
            message: "Users gotten successfully",
            data: user
        })
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.post('/post-user', async (req, res) => {
    try {
        // Create a new user using the User model and request data
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password, // In a real-world scenario, make sure to hash the password before saving!
            cityOfBirth: req.body.cityOfBirth
        });

        // Save the user to the database
        await user.save();

        // Send a response
        res.status(201).json({
            message: 'User registered successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({
            error: 'Failed to register user',
            details: error.message  // This will give more specific details about the error
        });
    }
});

app.put('/edit-user/:id', async (req, res) => {
    try {
        // Find the user by ID and update
        const user = await User.findByIdAndUpdate(
            req.params.id,          // User ID from the request URL
            req.body,               // Data from the request body
            { new: true }           // Option to return updated document. By default, findByIdAndUpdate returns the original.
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send the updated user as the response
        res.json({
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

app.delete('/delete-user/:id', async (req, res) => {
    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Send a confirmation as the response
        res.json({
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});