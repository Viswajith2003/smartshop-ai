const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

async function check() {
    try {
        console.log('Connecting to', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smartshop-ai');
        const User = mongoose.model('User', userSchema);
        const users = await User.find({});
        console.log('Found users:', users.map(u => u.email));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
