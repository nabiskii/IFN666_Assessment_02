const mongoose = require("mongoose");

const shelterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
});

module.exports = mongoose.model("Shelter", shelterSchema);
