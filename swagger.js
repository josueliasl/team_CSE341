const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'User Api',
        description: 'User Api'
    },
    host: 'localhost:3002',
    schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

// This generates swagger.json
swaggerAutogen(outputFile, endpointFiles, doc);