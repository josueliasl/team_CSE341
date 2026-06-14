const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    try {
        const result = await mongodb
            .getDatabase()
            .collection('users')
            .find()
            .toArray();

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getUserById = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid user ID'
        });
    }

    try {
        const userId = new ObjectId(req.params.id);

        const result = await mongodb
            .getDatabase()
            .collection('users')
            .findOne({ _id: userId });

        if (!result) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const createUser = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        age,
        role,
        isActive,
        createdAt
    } = req.body;

    if (!firstName || !lastName || !email || !role) {
        return res.status(400).json({
            message: 'First name, last name, email, and role are required'
        });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    if (typeof age !== 'number' || age < 1 || age > 120) {
        return res.status(400).json({
            message: 'Age must be a number between 1 and 120'
        });
    }

    const user = {
        firstName,
        lastName,
        email,
        age,
        role,
        isActive: isActive ?? true,
        createdAt: createdAt || new Date().toISOString()
    };

    try {
        const response = await mongodb
            .getDatabase()
            .collection('users')
            .insertOne(user);

        if (response.acknowledged) {
            return res.status(201).json({
                message: 'User created successfully',
                id: response.insertedId
            });
        }

        res.status(500).json({
            message: 'Error creating user'
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const updateUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid user ID'
        });
    }

    const {
        firstName,
        lastName,
        email,
        age,
        role,
        isActive,
        createdAt
    } = req.body;

    if (!firstName || !lastName || !email || !role) {
        return res.status(400).json({
            message: 'First name, last name, email, and role are required'
        });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        });
    }

    if (typeof age !== 'number' || age < 1 || age > 120) {
        return res.status(400).json({
            message: 'Age must be a number between 1 and 120'
        });
    }

    const userId = new ObjectId(req.params.id);

    const user = {
        firstName,
        lastName,
        email,
        age,
        role,
        isActive,
        createdAt
    };

    try {
        const response = await mongodb
            .getDatabase()
            .collection('users')
            .replaceOne({ _id: userId }, user);

        if (response.matchedCount === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            message: 'Invalid user ID'
        });
    }

    try {
        const userId = new ObjectId(req.params.id);

        const response = await mongodb
            .getDatabase()
            .collection('users')
            .deleteOne({ _id: userId });

        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};