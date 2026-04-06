const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await User.countDocuments();
        console.log('Total users:', count);
        const users = await User.find({}, { email: 1, name: 1 }).limit(10);
        console.log('Recent users:', users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
