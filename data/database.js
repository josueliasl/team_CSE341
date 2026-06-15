require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }

    console.log('Initializing database connection...');
    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            database = client.db();
            console.log('✅ Database connected successfully!');
            callback(null, database);
        })
        .catch((err) => {
            console.error('❌ Database connection error:', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized - call initDb first');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};