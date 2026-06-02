const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    }
});

module.exports = mongoose.model("Book", bookSchema);