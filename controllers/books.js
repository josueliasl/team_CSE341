const Book = require("../models/Book");

// GET ALL
const getAllBooks = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE
const getBookById = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST
const createBook = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const book = new Book(req.body);

        const savedBook = await book.save();

        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT
const updateBook = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE
const deleteBook = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};