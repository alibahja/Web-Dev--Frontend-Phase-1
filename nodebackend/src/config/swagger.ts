import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BiblioTech API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation for BiblioTech Library Management System',
      contact: {
        name: 'BiblioTech Support',
        email: 'bibliotech453@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'] // Path to your API routes and controllers
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;