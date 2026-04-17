const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

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

shelterSchema.plugin(paginate);

module.exports = mongoose.model("Shelter", shelterSchema);
