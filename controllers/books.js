const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET ALL
const getAllBooks = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const db = mongodb.getDatabase();
        const result = await db.collection('books').find().toArray();
    
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (err) {
        console.error('Error in getAllBooks:', err);
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE
const getBookById = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const result = await db.collection('books').find({_id: userId}).toArray();
        
        res.setHeader('Content-Type', 'application/json');

        if (!result || result.length === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        console.error('Error in getBookById:', err);
        res.status(500).json({ message: err.message });
    }
};

// POST
const createBook = async (req, res) => {
    //#swagger.tags=['books']
    const books = {
        title: req.body.title,
        isbn: req.body.isbn,
        publicationYear: req.body.publicationYear,
        authorId: req.body.authorId
    };
    
    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('books').insertOne(books);
        
        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'Some error occurred while creating the Book' });
        }
    } catch (err) {
        console.error('Error in createBook:', err);
        res.status(400).json({
            message: err.message
        });
    }
};

// PUT
const updateBook = async (req, res) => {
    //#swagger.tags=['books']
    const userId = new ObjectId(req.params.id);
    const books = {
        title: req.body.title,
        isbn: req.body.isbn,
        publicationYear: req.body.publicationYear,
        authorId: req.body.authorId
    };
    
    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('books').replaceOne({_id: userId}, books);
        
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'Some error occurred while updating the book' });
        }
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message || 'Some error occurred while updating the book' });
    }
};

// DELETE
const deleteBook = async (req, res) => {
    //#swagger.tags=['books']
    try {
        const userId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('books').deleteOne({_id: userId});
        
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ error: 'Some error occurred while deleting the book' });
        }
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ message: error.message || 'Some error occurred while deleting the book' });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};