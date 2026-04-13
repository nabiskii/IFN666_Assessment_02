const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    pet: {
        type: mongoose.Schema.ObjectId,
        ref: "Pet",
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("Application", applicationSchema);
