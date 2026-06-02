const Author = require("../models/Author");

// GET ALL
const getAllAuthors = async (req, res) => {
    //#swagger.tags=['authors']
    try {
        const authors = await Author.find();
        res.status(200).json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE
const getAuthorById = async (req, res) => {
    //#swagger.tags=['authors']
    try {
        const author = await Author.findById(req.params.id);

        if (!author) {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        res.status(200).json(author);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST
const createAuthor = async (req, res) => {
    //#swagger.tags=['authors']
    try {
        const author = new Author(req.body);

        const savedAuthor = await author.save();

        res.status(201).json(savedAuthor);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

// PUT
const updateAuthor = async (req, res) => {
    //#swagger.tags=['authors']
    try {
        const updatedAuthor = await Author.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedAuthor) {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        res.status(200).json(updatedAuthor);
    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

// DELETE
const deleteAuthor = async (req, res) => {
    //#swagger.tags=['authors']
    try {
        const deletedAuthor = await Author.findByIdAndDelete(
            req.params.id
        );

        if (!deletedAuthor) {
            return res.status(404).json({
                message: "Author not found"
            });
        }

        res.status(200).json({
            message: "Author deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
};