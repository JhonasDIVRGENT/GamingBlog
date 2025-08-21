// Data Access Layer for Blog
const sql = require('mssql');
const config = require('../config/dbConfig');
const logger = require('../config/logger');

// Helper function para ejecutar queries con logging automático
async function executeQuery(operation, table, query, inputs = {}, details = {}) {
    let pool;
    try {
        pool = await sql.connect(config);
        const request = pool.request();
        
        // Aplicar inputs si existen
        Object.keys(inputs).forEach(key => {
            request.input(key, inputs[key]);
        });
        
        const result = await request.query(query);
        
        // Log de operación exitosa
        logger.logDatabase(operation, table, { ...details, inputs });
        
        return result;
    } catch (err) {
        // Log de error con detalles completos
        logger.logDatabase(operation, table, { ...details, inputs }, err);
        throw err;
    } finally {
        if (pool) {
            await pool.close();
        }
    }
}

// Helper function para operaciones SELECT simples
async function executeSelect(table, query, inputs = {}) {
    const result = await executeQuery('SELECT', table, query, inputs);
    return result.recordset;
}

// Helper function para operaciones INSERT
async function executeInsert(table, query, inputs = {}, details = {}) {
    const result = await executeQuery('INSERT', table, query, inputs, details);
    return result;
}

// Helper function para operaciones UPDATE
async function executeUpdate(table, query, inputs = {}, details = {}) {
    const result = await executeQuery('UPDATE', table, query, inputs, details);
    return result;
}

// Helper function para operaciones DELETE
async function executeDelete(table, query, inputs = {}, details = {}) {
    const result = await executeQuery('DELETE', table, query, inputs, details);
    return result;
}

// ===== FUNCIONES DE POSTS =====

async function createPost(title, content, userID) {
    const query = 'INSERT INTO Posts (Title, Content, UserID) VALUES (@Title, @Content, @UserID)';
    const inputs = {
        Title: title,
        Content: content,
        UserID: userID
    };
    
    return await executeInsert('Posts', query, inputs, { title, content, userID });
}

async function getAllPosts() {
    const query = 'SELECT * FROM Posts ORDER BY CreatedAt DESC';
    return await executeSelect('Posts', query);
}

async function getPostById(postID) {
    const query = 'SELECT * FROM Posts WHERE PostID = @PostID';
    const inputs = { PostID: postID };
    const results = await executeSelect('Posts', query, inputs);
    return results[0];
}

async function updatePost(postID, title, content) {
    const query = 'UPDATE Posts SET Title = @Title, Content = @Content WHERE PostID = @PostID';
    const inputs = {
        PostID: postID,
        Title: title,
        Content: content
    };
    
    return await executeUpdate('Posts', query, inputs, { postID, title, content });
}

async function deletePost(postID) {
    const query = 'DELETE FROM Posts WHERE PostID = @PostID';
    const inputs = { PostID: postID };
    
    return await executeDelete('Posts', query, inputs, { postID });
}

// ===== FUNCIONES DE COMENTARIOS =====

async function createComment(content, userID, postID) {
    const query = 'INSERT INTO Comments (Content, UserID, PostID) VALUES (@Content, @UserID, @PostID)';
    const inputs = {
        Content: content,
        UserID: userID,
        PostID: postID
    };
    
    return await executeInsert('Comments', query, inputs, { content, userID, postID });
}

async function getCommentsByPost(postID) {
    const query = 'SELECT * FROM Comments WHERE PostID = @PostID ORDER BY CreatedAt ASC';
    const inputs = { PostID: postID };
    return await executeSelect('Comments', query, inputs);
}

async function updateComment(commentID, content) {
    const query = 'UPDATE Comments SET Content = @Content WHERE CommentID = @CommentID';
    const inputs = {
        CommentID: commentID,
        Content: content
    };
    
    return await executeUpdate('Comments', query, inputs, { commentID, content });
}

async function deleteComment(commentID) {
    const query = 'DELETE FROM Comments WHERE CommentID = @CommentID';
    const inputs = { CommentID: commentID };
    
    return await executeDelete('Comments', query, inputs, { commentID });
}

// ===== FUNCIONES DE USUARIOS =====

async function registerUser(username, email, password, role = 'user') {
    const query = 'INSERT INTO Users (Username, Email, Password, Role) VALUES (@Username, @Email, @Password, @Role)';
    const inputs = {
        Username: username,
        Email: email,
        Password: password,
        Role: role
    };
    
    return await executeInsert('Users', query, inputs, { username, email, role });
}

async function loginUser(email, password) {
    const query = 'SELECT * FROM Users WHERE Email = @Email AND Password = @Password';
    const inputs = {
        Email: email,
        Password: password
    };
    
    const results = await executeSelect('Users', query, inputs);
    return results[0];
}

// ===== FUNCIÓN DE PRUEBA =====

async function testConnection() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT TOP 1 * FROM Users');
        logger.info('Database connection test successful', { 
            table: 'Users', 
            recordCount: result.recordset.length 
        });
        await pool.close();
        return result.recordset;
    } catch (err) {
        logger.error('Database connection test failed', { error: err.message });
        throw err;
    }
}

// Ejecutar test de conexión si se ejecuta directamente
if (require.main === module) {
    testConnection()
        .then(() => console.log('✅ Database connection test completed'))
        .catch(err => console.error('❌ Database connection test failed:', err.message));
}

module.exports = {
    // Posts
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    
    // Comments
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
    
    // Users
    registerUser,
    loginUser,
    
    // Utility
    testConnection
};
