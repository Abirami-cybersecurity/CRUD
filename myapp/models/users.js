const mongoose = require('mongoose');
/*
const User = require('../models/users'); // Use the correct model name (User)

const multer = require('multer');
const express = require('express');
const router = express.Router();

// Image upload configuration
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: storage,
}).single("image");

// Insert user
router.post("/add", upload, (req, res) => {
    const newUser = new User({  // Use a different variable name to avoid conflicts
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });
    User.save((err) => {
        if (err) {
            res.json({ message: err.message, type: 'danger' });
        } else {
            req.session.message = {
                type: 'success',
                message: 'User added successfully'
            };
            res.redirect('/');
        }
    });
});
*/
// User schema definition
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now(),
    }
});

module.exports = mongoose.model("User", userSchema); // Corrected model name
