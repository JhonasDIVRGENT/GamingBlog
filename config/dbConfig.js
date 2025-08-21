// Database Configuration
module.exports = {
    user: 'sa',
    password: 'sql',
    server: 'DESKTOP-HVD5TEJ\\SQLEXPRESS',
    database: 'GamingBlog',
    options: {
        encrypt: true, // Use this if you're on Azure
        trustServerCertificate: true // Change to false for production
    }
};
