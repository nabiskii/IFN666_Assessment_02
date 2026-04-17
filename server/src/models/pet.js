const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    species: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
    },
    breed: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available',
    },
    shelter: {
        type: mongoose.Schema.ObjectId,
        ref: "Shelter",
        required: true,
    }
});

petSchema.plugin(paginate);

module.exports = mongoose.model("Pet", petSchema);
