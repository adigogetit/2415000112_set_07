const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        age: { type: Number, required: true },
        phoneNumber: { type: String, required: true, trim: true },
        courseEnrolled: {
            courseName: { type: String, required: true, trim: true },
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.verifyPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);