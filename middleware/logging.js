const morgan = require('morgan');
const logger = require('../config/logger');

// Middleware personalizado para logging de requests
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log del request inicial
    logger.info('Incoming Request', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Log de la respuesta cuando termine
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('Content-Length') || 0,
            timestamp: new Date().toISOString()
        };
        
        // Log diferente según el status code
        if (res.statusCode >= 500) {
            logger.error('Server Error Response', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Client Error Response', logData);
        } else if (res.statusCode >= 300) {
            logger.info('Redirect Response', logData);
        } else {
            logger.info('Success Response', logData);
        }
    });
    
    next();
};

// Middleware para logging de errores
const errorLogger = (err, req, res, next) => {
    logger.error('Unhandled Error', {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    next(err);
};

// Middleware para logging de operaciones lentas
const slowRequestLogger = (threshold = 1000) => {
    return (req, res, next) => {
        const start = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            if (duration > threshold) {
                logger.warn('Slow Request Detected', {
                    method: req.method,
                    url: req.originalUrl,
                    duration: `${duration}ms`,
                    threshold: `${threshold}ms`,
                    timestamp: new Date().toISOString()
                });
            }
        });
        
        next();
    };
};

// Middleware para logging de autenticación
const authLogger = (req, res, next) => {
    if (req.path.includes('/login') || req.path.includes('/register')) {
        logger.info('Authentication Attempt', {
            path: req.path,
            method: req.method,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

// Middleware para logging de operaciones CRUD
const crudLogger = (req, res, next) => {
    const crudOperations = ['create', 'update', 'delete', 'edit'];
    const isCRUD = crudOperations.some(op => req.path.includes(op));
    
    if (isCRUD) {
        logger.info('CRUD Operation Detected', {
            method: req.method,
            path: req.path,
            operation: crudOperations.find(op => req.path.includes(op)),
            ip: req.ip || req.connection.remoteAddress,
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

module.exports = {
    requestLogger,
    errorLogger,
    slowRequestLogger,
    authLogger,
    crudLogger
};
