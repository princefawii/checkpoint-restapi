const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cityOfBirth: {
        type: String,
    }
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;