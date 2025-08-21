// Database Configuration
module.exports = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server',
    database: 'your_database',
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false for production
    }
};
