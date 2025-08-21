const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Crear directorio de logs si no existe
const fs = require('fs');
const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

// Configuración de formatos
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
        format: 'HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
        return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
);

// Configuración del logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'gaming-blog' },
    transports: [
        // Logs de error
        new DailyRotateFile({
            filename: path.join(logDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '14d',
            format: logFormat
        }),
        
        // Logs combinados
        new DailyRotateFile({
            filename: path.join(logDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: logFormat
        }),
        
        // Logs de acceso
        new DailyRotateFile({
            filename: path.join(logDir, 'access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d',
            format: logFormat
        })
    ]
});

// Agregar logs a consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Función para loggear requests HTTP
logger.logRequest = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress,
            userId: req.user ? req.user.id : 'anonymous'
        };
        
        if (res.statusCode >= 400) {
            logger.error('HTTP Request Error', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    });
    
    next();
};

// Función para loggear operaciones de base de datos
logger.logDatabase = (operation, table, details, error = null) => {
    const logData = {
        operation,
        table,
        details,
        timestamp: new Date().toISOString()
    };
    
    if (error) {
        logger.error('Database Operation Error', { ...logData, error: error.message, stack: error.stack });
    } else {
        logger.info('Database Operation', logData);
    }
};

// Función para loggear autenticación
logger.logAuth = (action, userId, details, success = true) => {
    const logData = {
        action,
        userId,
        details,
        success,
        timestamp: new Date().toISOString(),
        ip: details.ip || 'unknown'
    };
    
    if (success) {
        logger.info('Authentication Success', logData);
    } else {
        logger.warn('Authentication Failure', logData);
    }
};

// Función para loggear operaciones CRUD
logger.logCRUD = (operation, resource, resourceId, userId, details) => {
    const logData = {
        operation,
        resource,
        resourceId,
        userId,
        details,
        timestamp: new Date().toISOString()
    };
    
    logger.info('CRUD Operation', logData);
};

module.exports = logger;
