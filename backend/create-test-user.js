const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = 'testuser' + Date.now() + '@example.com';
        const user = new User({
            name: 'Test User',
            email: email,
            password: 'Password123!',
            role: 'user'
        });
        await user.save();
        console.log('User created successfully:', email);
        process.exit(0);
    } catch (err) {
        console.error('User creation failed:', err);
        process.exit(1);
    }
}

createUser();
