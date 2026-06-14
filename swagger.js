const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'City Library API',
        description: 'API for managing authors, books, libraries, and users',
        version: '1.0.0'
    },
    host: 'localhost:3002',
    schemes: ['http'],
    security: [],
    securityDefinitions: {}
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointFiles, doc);