const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
    {
        scholarshipHolder: { type: String, required: true, trim: true },
        age: { type: Number, required: true },
        phoneNumber: { type: String, required: true, trim: true },
        courseEnrolled: {
            courseName: { type: String, required: true, trim: true },
        },
        percentage: { type: Number, required: true, min: 0, max: 100 },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Scholarship', scholarshipSchema);