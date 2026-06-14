const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET ALL
const getAllLibraries = async (req, res) => {
    //#swagger.tags=['libraries']
    try {
        const db = mongodb.getDatabase();
        const result = await db.collection('libraries').find().toArray();

        res.status(200).json(result);
    } catch (err) {
        console.error('Error in getAllLibraries:', err);
        res.status(500).json({ message: err.message });
    }
};

// GET SINGLE
const getLibraryById = async (req, res) => {
    //#swagger.tags=['libraries']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid library ID' });
    }

    try {
        const libraryId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const result = await db.collection('libraries').findOne({ _id: libraryId });

        if (!result) {
            return res.status(404).json({ message: 'Library not found' });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error('Error in getLibraryById:', err);
        res.status(500).json({ message: err.message });
    }
};

// POST
const createLibrary = async (req, res) => {
    //#swagger.tags=['libraries']
    const { name, location, booksAvailable, isOpen } = req.body;

    // Validation
    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
    }

    if (booksAvailable === undefined || typeof booksAvailable !== 'number' || booksAvailable < 0) {
        return res.status(400).json({ message: 'booksAvailable must be a number greater than or equal to 0' });
    }

    const library = {
        name,
        location,
        booksAvailable,
        isOpen: isOpen ?? true
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('libraries').insertOne(library);

        if (response.acknowledged) {
            return res.status(201).json({
                message: 'Library created successfully',
                id: response.insertedId
            });
        }

        res.status(500).json({ message: 'Error creating library' });
    } catch (err) {
        console.error('Error in createLibrary:', err);
        res.status(500).json({ message: err.message });
    }
};

// PUT
const updateLibrary = async (req, res) => {
    //#swagger.tags=['libraries']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid library ID' });
    }

    const { name, location, booksAvailable, isOpen } = req.body;

    if (!name || !location) {
        return res.status(400).json({ message: 'Name and location are required' });
    }

    if (booksAvailable === undefined || typeof booksAvailable !== 'number' || booksAvailable < 0) {
        return res.status(400).json({ message: 'booksAvailable must be a number greater than or equal to 0' });
    }

    const libraryId = new ObjectId(req.params.id);
    const library = { name, location, booksAvailable, isOpen };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('libraries').replaceOne({ _id: libraryId }, library);

        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'Library not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error in updateLibrary:', err);
        res.status(500).json({ message: err.message });
    }
};

// DELETE
const deleteLibrary = async (req, res) => {
    //#swagger.tags=['libraries']
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid library ID' });
    }

    try {
        const libraryId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('libraries').deleteOne({ _id: libraryId });

        if (response.deletedCount === 0) {
            return res.status(404).json({ message: 'Library not found' });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Error in deleteLibrary:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllLibraries,
    getLibraryById,
    createLibrary,
    updateLibrary,
    deleteLibrary
};