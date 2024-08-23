const express = require('express');
const router = express.Router();
const User = require('../models/users'); // Use the correct model name (User)
const multer = require('multer');
const fs = require('fs');

// Image upload configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

const upload = multer({
    storage: storage,
}).single("image");

// Insert user
router.post("/add", upload, async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
        await newUser.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error saving user:', err);
        res.json({ message: err.message, type: 'danger' });
    }
});

// Fetch all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch users from the database
        res.render('index', { title: 'Home Page', users: users });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('An error occurred while fetching users.');
    }
});

router.get('/add', (req, res) => {
    try {
        res.render('add_users', { title: "Add Users" }); // Corrected "tittle" to "title"
    } catch (err) {
        console.error('Error rendering Add Users page:', err);
        res.status(500).send('An error occurred while rendering the Add Users page.');
    }
});

// Edit user
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id); // Use async/await here
        if (!user) {
            return res.redirect('/');
        }
        res.render('edit_users', {
            title: 'Edit User',
            user: user,
        });
    } catch (err) {
        console.error('Error finding user:', err);
        res.redirect('/');
    }
});

// Update user
router.post('/update/:id', upload, async (req, res) => {
    const id = req.params.id;
    let new_image = '';

    try {
        // If a new image file is uploaded
        if (req.file) {
            new_image = req.file.filename;
            // Delete old image file if it exists
            if (req.body.old_image) {
                fs.unlinkSync("./upload/" + req.body.old_image);
            }
        } else {
            // Use the old image if no new image is uploaded
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        });

        req.session.message = {
            type: "success",
            message: "User updated successfully"
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error updating user:', err);
        res.json({ message: err.message, type: 'danger' });
    }
});
// Delete user
// Delete user
router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const result = await User.findByIdAndDelete(id);
        
        if (result && result.image) {
            try {
                fs.unlinkSync('./upload/' + result.image); // Delete the associated image file
            } catch (err) {
                console.log('Error deleting image file:', err);
            }
        }

        req.session.message = {
            type: "info",
            message: "User deleted successfully"
        };
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user:', err);
        res.json({ message: err.message, type: 'danger' });
    }
});


module.exports = router;
